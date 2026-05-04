import { CVSkillsSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVSkillsSection;
  style: CVStyle;
}

export function SkillsSection({ section, style }: Props) {
  return (
    <div>
      <h2
        className="font-bold uppercase tracking-wide border-b pb-1 mb-3"
        style={{
          fontSize: `${style.fontSize.subheading}px`,
          color: style.colors.primary,
          borderColor: style.colors.primary,
        }}
      >
        {section.title}
      </h2>
      {section.groups.map((group, gi) => (
        <div key={gi} className="mb-2">
          <h3 className="font-semibold text-sm mb-1" style={{ color: style.colors.secondary }}>
            {group.label}
          </h3>
          {section.displayStyle === 'tags' && (
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: style.colors.accent, color: style.colors.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {section.displayStyle === 'list' && (
            <ul className="list-disc list-inside text-sm">
              {group.items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
