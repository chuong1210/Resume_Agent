import { CVHeaderSection, CVStyle } from '@/lib/types/cv.types';

interface Props {
  section: CVHeaderSection;
  style: CVStyle;
}

export function HeaderSection({ section, style }: Props) {
  const { fullName, title, email, phone, location, linkedin, github, website, summary } =
    section.data;

  return (
    <div className="text-center border-b pb-4" style={{ borderColor: style.colors.primary }}>
      <h1
        className="font-bold"
        style={{ fontSize: `${style.fontSize.heading}px`, color: style.colors.primary }}
      >
        {fullName}
      </h1>
      {title && (
        <p
          className="font-semibold mt-1"
          style={{ fontSize: `${style.fontSize.subheading}px`, color: style.colors.secondary }}
        >
          {title}
        </p>
      )}
      <div
        className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm"
        style={{ color: style.colors.secondary }}
      >
        {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}
        {location && <span>{location}</span>}
        {linkedin && <span>{linkedin}</span>}
        {github && <span>{github}</span>}
        {website && <span>{website}</span>}
      </div>
      {summary && (
        <p className="mt-3 text-sm leading-relaxed max-w-2xl mx-auto">{summary}</p>
      )}
    </div>
  );
}
