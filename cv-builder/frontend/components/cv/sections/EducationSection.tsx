import { CVEducationSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVEducationSection;
  style: CVStyle;
}

export function EducationSection({ section, style }: Props) {
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
        <div key={item.id} className="mb-2" style={{ marginBottom: `${style.spacing.itemGap}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold">{item.institution}</h3>
            <span className="text-sm" style={{ color: style.colors.secondary }}>
              {item.startDate} - {item.endDate}
            </span>
          </div>
          <p className="text-sm" style={{ color: style.colors.secondary }}>
            {item.degree}{item.major ? ` in ${item.major}` : ''}
            {item.gpa ? ` — GPA: ${item.gpa}` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
