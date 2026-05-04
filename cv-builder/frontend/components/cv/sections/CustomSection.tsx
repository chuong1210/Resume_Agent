import { CVCustomSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVCustomSection;
  style: CVStyle;
}

export function CustomSection({ section, style }: Props) {
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
      <div className="text-sm whitespace-pre-wrap">{section.content}</div>
    </div>
  );
}
