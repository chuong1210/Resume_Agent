import { CVProjectsSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVProjectsSection;
  style: CVStyle;
}

export function ProjectsSection({ section, style }: Props) {
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
      {section.items.map((item) => (
        <div key={item.id} className="mb-3" style={{ marginBottom: `${style.spacing.itemGap}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold">{item.name}</h3>
            <div className="flex gap-2 text-xs" style={{ color: style.colors.primary }}>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline">
                  Live
                </a>
              )}
              {item.github && (
                <a href={item.github} target="_blank" rel="noopener noreferrer" className="underline">
                  GitHub
                </a>
              )}
            </div>
          </div>
          <p className="text-sm" style={{ color: style.colors.secondary }}>
            {item.description}
          </p>
          {item.highlights.length > 0 && (
            <ul className="list-disc list-inside mt-1 text-sm">
              {item.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
          {item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: style.colors.accent, color: style.colors.primary }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
