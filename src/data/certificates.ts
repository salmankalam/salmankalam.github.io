export interface Certificate {
  name: string;
  image: string;
  link: string;
  tags: string[];
  featured?: boolean;
  category?: string;
}

export type CertificateCategory = {
  id: string;
  label: string;
};

export const certificateCategories: CertificateCategory[] = [
  { id: "devops", label: "DevOps & Infrastructure" },
  { id: "software-engineering", label: "Software Engineering & Architecture" },
  { id: "data-ai", label: "Data, AI & Analytics" },
  { id: "seo", label: "SEO & Digital Marketing" },
  { id: "version-control", label: "Version Control & Collaboration" },
];

export const featuredCertificates: Certificate[] = [
  {
    name: "Career Essentials in GitHub Professional Certificate",
    image: "certificates/featured/career-essentials-github-professional.png",
    link: "https://example.com/certificate/career-essentials-github",
    tags: ["GitHub", "Version Control", "Professional Development"],
    featured: true,
  },
  {
    name: "DevOps Professional Certificate by PagerDuty",
    image: "certificates/featured/DevOps-Professional-Certificate-by-PagerDuty-and-LinkedIn.png",
    link: "https://example.com/certificate/devops-professional-pagerduty",
    tags: ["DevOps", "PagerDuty", "Incident Management"],
    featured: true,
  },
  {
    name: "Docker Foundations Professional Certificate",
    image: "certificates/featured/Docker-Foundations-Professional-Certificate.png",
    link: "https://example.com/certificate/docker-foundations-professional",
    tags: ["Docker", "Containers", "DevOps"],
    featured: true,
  },
  {
    name: "React Creating and Hosting Full Stack Site",
    image: "certificates/featured/React-Creating-and-Hosting-FullStack-Site.png",
    link: "https://example.com/certificate/react-fullstack-hosting",
    tags: ["React", "Full Stack", "Hosting", "Frontend"],
    featured: true,
  },
  {
    name: "Search Professional Certificate by Moz",
    image: "certificates/featured/SEO-Professional-Certificate-by-Moz.png",
    link: "https://example.com/certificate/search-professional-moz",
    tags: ["SEO", "Search", "Moz", "Digital Marketing"],
    featured: true,
  },
];

export const certificates: Certificate[] = [
  {
    name: "DevOps Foundations",
    image: "certificates/devops/devops-foundations.png",
    link: "https://example.com/certificate/devops-foundations",
    tags: ["DevOps", "Foundations", "CI/CD"],
    category: "devops",
  },
  {
    name: "DevOps Foundations — Continuous Delivery & Integration",
    image: "certificates/devops/DevOps-Foundations-Continuous-Delivery-Continuous-Integration.png",
    link: "https://example.com/certificate/devops-cd-ci",
    tags: ["DevOps", "CI/CD", "Continuous Delivery"],
    category: "devops",
  },
  {
    name: "DevOps Foundations — Infrastructure as Code",
    image: "certificates/devops/DevOps-Foundations-Infrastructure-as-Code-IaC.png",
    link: "https://example.com/certificate/devops-iac",
    tags: ["DevOps", "IaC", "Infrastructure", "Automation"],
    category: "devops",
  },
  {
    name: "Learning Docker",
    image: "certificates/devops/Learning-Docker.png",
    link: "https://example.com/certificate/learning-docker",
    tags: ["Docker", "Containers", "DevOps"],
    category: "devops",
  },
  {
    name: "Docker Build and Optimize Docker Images",
    image: "certificates/devops/Docker-Build-and-Optimize-Docker-Images.png",
    link: "https://example.com/certificate/docker-build-optimize",
    tags: ["Docker", "Containers", "Optimization", "DevOps"],
    category: "devops",
  },
  {
    name: "SOLID Principles: System Design for Java Developers",
    image: "certificates/software-engineering/SOLID-Principles-System-Design-for-Java-Developers.png",
    link: "https://example.com/certificate/solid-java-system-design",
    tags: ["Java", "SOLID", "System Design", "OOP"],
    category: "software-engineering",
  },
  {
    name: "Programming Foundations: Design Patterns",
    image: "certificates/software-engineering/Programming-Foundations-Design-Patterns.png",
    link: "https://example.com/certificate/design-patterns",
    tags: ["Programming", "Design Patterns", "Software Architecture"],
    category: "software-engineering",
  },
  {
    name: "Microservices Foundations",
    image: "certificates/software-engineering/Microservices-Foundations.png",
    link: "https://example.com/certificate/microservices-foundations",
    tags: ["Microservices", "Architecture", "Distributed Systems"],
    category: "software-engineering",
  },
  {
    name: "Java Algorithms",
    image: "certificates/software-engineering/java-algorithms.png",
    link: "https://example.com/certificate/java-algorithms",
    tags: ["Java", "Algorithms", "Data Structures"],
    category: "software-engineering",
  },
  {
    name: "React Server-Side Rendering with Next.js",
    image: "certificates/software-engineering/react-server-side-rendering-with-nextjs.png",
    link: "https://example.com/certificate/react-ssr-nextjs",
    tags: ["React", "Next.js", "SSR", "Frontend"],
    category: "software-engineering",
  },
  {
    name: "AI-Powered Software Development, Coding, Testing and System Design",
    image: "certificates/data-ai/AIPowered-Software-Development-Coding-Testing-and-System-Design.png",
    link: "https://example.com/certificate/ai-powered-software-dev",
    tags: ["AI", "Software Development", "Testing", "System Design"],
    category: "data-ai",
  },
  {
    name: "Design Thinking Data Intelligence",
    image: "certificates/data-ai/design-thinking-data-intelligence.png",
    link: "https://example.com/certificate/design-thinking-data-intelligence",
    tags: ["Design Thinking", "Data Intelligence", "Analytics"],
    category: "data-ai",
  },
  {
    name: "Introduction to Analytics Engineering",
    image: "certificates/data-ai/introduction-analytics-engineering.png",
    link: "https://example.com/certificate/introduction-analytics-engineering",
    tags: ["Analytics Engineering", "SQL", "Data Pipelines"],
    category: "data-ai",
  },
  {
    name: "Technical SEO",
    image: "certificates/seo/Technical-SEO.png",
    link: "https://example.com/certificate/technical-seo",
    tags: ["SEO", "Technical", "Web Performance", "Search"],
    category: "seo",
  },
  {
    name: "Using AI as Your SEO Assistant",
    image: "certificates/seo/Using-AI-as-Your-SEO-Assistant.png",
    link: "https://example.com/certificate/ai-seo-assistant",
    tags: ["AI", "SEO", "Marketing", "Automation"],
    category: "seo",
  },
  {
    name: "Practical GitHub Actions",
    image: "certificates/version-control/practical-github-actions.png",
    link: "https://example.com/certificate/practical-github-actions",
    tags: ["GitHub", "CI/CD", "Automation"],
    category: "version-control",
  },
  {
    name: "Practical GitHub Project Management & Collaboration",
    image: "certificates/version-control/practical-github-project-management.png",
    link: "https://example.com/certificate/practical-github-project-management",
    tags: ["GitHub", "Project Management", "Agile"],
    category: "version-control",
  },
];