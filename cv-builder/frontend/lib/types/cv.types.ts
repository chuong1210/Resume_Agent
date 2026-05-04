// CV JSON Schema — single source of truth for the entire app

export interface CVDocument {
  id: string;
  meta: CVMeta;
  style: CVStyle;
  sections: CVSection[];
}

export interface CVMeta {
  title: string;
  templateId: string;
  language: 'vi' | 'en' | 'ja';
  lastModified: string;
}

export interface CVStyle {
  fontFamily: string;
  fontSize: {
    base: number;
    heading: number;
    subheading: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    pagePadding: number;
  };
  layout: 'single-column' | 'two-column' | 'sidebar';
}

export type CVSection =
  | CVHeaderSection
  | CVExperienceSection
  | CVEducationSection
  | CVSkillsSection
  | CVProjectsSection
  | CVCertificationsSection
  | CVCustomSection;

export interface CVHeaderSection {
  type: 'header';
  id: string;
  visible: boolean;
  data: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    avatar?: string;
    summary: string;
  };
}

export interface CVExperienceSection {
  type: 'experience';
  id: string;
  visible: boolean;
  title: string;
  items: ExperienceItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'present';
  location?: string;
  bullets: string[];
  technologies?: string[];
}

export interface CVEducationSection {
  type: 'education';
  id: string;
  visible: boolean;
  title: string;
  items: EducationItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface CVSkillsSection {
  type: 'skills';
  id: string;
  visible: boolean;
  title: string;
  displayStyle: 'tags' | 'list' | 'grouped' | 'progress';
  groups: {
    label: string;
    items: string[];
  }[];
}

export interface CVProjectsSection {
  type: 'projects';
  id: string;
  visible: boolean;
  title: string;
  items: ProjectItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  highlights: string[];
}

export interface CVCertificationsSection {
  type: 'certifications';
  id: string;
  visible: boolean;
  title: string;
  items: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
}

export interface CVCustomSection {
  type: 'custom';
  id: string;
  visible: boolean;
  title: string;
  content: string;
}
