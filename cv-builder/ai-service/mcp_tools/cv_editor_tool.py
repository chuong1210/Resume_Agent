from langchain_core.tools import tool
import json


@tool
def apply_diff_to_cv(cv_json: str, patches_json: str) -> str:
    """Apply a list of CVPatch objects to a CV document and return the updated CV JSON."""
    cv = json.loads(cv_json)
    patches = json.loads(patches_json)

    for patch in patches:
        op = patch.get("op")
        if op == "update_style":
            path = patch["path"].split(".")
            obj = cv
            for key in path[:-1]:
                obj = obj[key]
            obj[path[-1]] = patch["value"]
        elif op == "toggle_section":
            for s in cv["sections"]:
                if s["id"] == patch["sectionId"]:
                    s["visible"] = patch["visible"]
        elif op == "update_field":
            for s in cv["sections"]:
                if s["id"] == patch["sectionId"]:
                    if patch.get("itemId"):
                        for item in s.get("items", []):
                            if item["id"] == patch["itemId"]:
                                item[patch["field"]] = patch["value"]
                    else:
                        parts = patch["field"].split(".")
                        target = s
                        for p in parts[:-1]:
                            target = target[p]
                        target[parts[-1]] = patch["value"]
        elif op == "add_item":
            for s in cv["sections"]:
                if s["id"] == patch["sectionId"]:
                    import uuid
                    item = patch["item"]
                    item["id"] = item.get("id", str(uuid.uuid4()))
                    s.setdefault("items", []).append(item)
        elif op == "remove_item":
            for s in cv["sections"]:
                if s["id"] == patch["sectionId"]:
                    s["items"] = [i for i in s.get("items", []) if i["id"] != patch["itemId"]]
        elif op == "update_bullets":
            for s in cv["sections"]:
                if s["id"] == patch["sectionId"]:
                    for item in s.get("items", []):
                        if item["id"] == patch["itemId"]:
                            item["bullets"] = patch["bullets"]
        elif op == "reorder_sections":
            order_map = {sid: i for i, sid in enumerate(patch["order"])}
            cv["sections"].sort(key=lambda s: order_map.get(s["id"], 999))

    return json.dumps(cv)
