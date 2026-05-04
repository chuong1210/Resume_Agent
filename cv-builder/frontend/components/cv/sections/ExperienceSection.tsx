import { CVExperienceSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVExperienceSection;
  style: CVStyle;
}

export function ExperienceSection({ section, style }: Props) {
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
            <h3 className="font-semibold" style={{ color: style.colors.text }}>
              {item.position}
            </h3>
            <span className="text-sm" style={{ color: style.colors.secondary }}>
              {item.startDate} - {item.endDate}
            </span>
          </div>
          <p className="text-sm" style={{ color: style.colors.secondary }}>
            {item.company}
            {item.location && ` — ${item.location}`}
          </p>
          {item.bullets.length > 0 && (
            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
              {item.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
          {item.technologies && item.technologies.length > 0 && (
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
