import { CVCertificationsSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVCertificationsSection;
  style: CVStyle;
}

export function CertificationsSection({ section, style }: Props) {
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
            <h3 className="font-semibold text-sm">{item.name}</h3>
            <span className="text-xs" style={{ color: style.colors.secondary }}>
              {item.date}
            </span>
          </div>
          <p className="text-xs" style={{ color: style.colors.secondary }}>
            {item.issuer}
          </p>
        </div>
      ))}
    </div>
  );
}
