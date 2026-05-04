import { CVSection, CVStyle } from '@/lib/types/cv.types';
import { HeaderSection } from './HeaderSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import { CustomSection } from './CustomSection';

interface SectionRendererProps {
  section: CVSection;
  style: CVStyle;
}

export function SectionRenderer({ section, style }: SectionRendererProps) {
  const sectionStyle = {
    marginBottom: `${style.spacing.sectionGap}px`,
  };

  const renderSection = () => {
    switch (section.type) {
      case 'header':
        return <HeaderSection section={section} style={style} />;
      case 'experience':
        return <ExperienceSection section={section} style={style} />;
      case 'education':
        return <EducationSection section={section} style={style} />;
      case 'skills':
        return <SkillsSection section={section} style={style} />;
      case 'projects':
        return <ProjectsSection section={section} style={style} />;
      case 'certifications':
        return <CertificationsSection section={section} style={style} />;
      case 'custom':
        return <CustomSection section={section} style={style} />;
      default:
        return null;
    }
  };

  return <div style={sectionStyle}>{renderSection()}</div>;
}
