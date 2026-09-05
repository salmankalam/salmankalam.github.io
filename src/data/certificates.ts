export interface Certificate {
  name: string;
  image: string;
  link: string;
  tags: string[];
  featured?: boolean;
}

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
];

export const certificates: Certificate[] = [
  {
    name: "AI-Powered Software Development, Coding, Testing and System Design",
    image: "certificates/AIPowered-Software-Development-Coding-Testing-and-System-Design.png",
    link: "https://example.com/certificate/ai-powered-software-dev",
    tags: ["AI", "Software Development", "Testing", "System Design"],
  },
  {
    name: "DevOps Foundations",
    image: "certificates/devops-foundations.png",
    link: "https://example.com/certificate/devops-foundations",
    tags: ["DevOps", "Foundations", "CI/CD"],
  },
  {
    name: "DevOps Foundations — Continuous Delivery & Integration",
    image: "certificates/DevOps-Foundations-Continuous-Delivery-Continuous-Integration.png",
    link: "https://example.com/certificate/devops-cd-ci",
    tags: ["DevOps", "CI/CD", "Continuous Delivery"],
  },
  {
    name: "DevOps Foundations — Infrastructure as Code",
    image: "certificates/DevOps-Foundations-Infrastructure-as-Code-IaC.png",
    link: "https://example.com/certificate/devops-iac",
    tags: ["DevOps", "IaC", "Infrastructure", "Automation"],
  },
  {
    name: "Design Thinking Data Intelligence",
    image: "certificates/design-thinking-data-intelligence.png",
    link: "https://example.com/certificate/design-thinking-data-intelligence",
    tags: ["Design Thinking", "Data Intelligence", "Analytics"],
  },
  {
    name: "Introduction to Analytics Engineering",
    image: "certificates/introduction-analytics-engineering.png",
    link: "https://example.com/certificate/introduction-analytics-engineering",
    tags: ["Analytics Engineering", "SQL", "Data Pipelines"],
  },
  {
    name: "Java Algorithms",
    image: "certificates/java-algorithms.png",
    link: "https://example.com/certificate/java-algorithms",
    tags: ["Java", "Algorithms", "Data Structures"],
  },
  {
    name: "Learning Docker",
    image: "certificates/Learning-Docker.png",
    link: "https://example.com/certificate/learning-docker",
    tags: ["Docker", "Containers", "DevOps"],
  },
  {
    name: "Practical GitHub Actions",
    image: "certificates/practical-github-actions.png",
    link: "https://example.com/certificate/practical-github-actions",
    tags: ["GitHub", "CI/CD", "Automation"],
  },
  {
    name: "Practical GitHub Project Management & Collaboration",
    image: "certificates/practical-github-project-management.png",
    link: "https://example.com/certificate/practical-github-project-management",
    tags: ["GitHub", "Project Management", "Agile"],
  },
  {
    name: "React Server-Side Rendering with Next.js",
    image: "certificates/react-server-side-rendering-with-nextjs.png",
    link: "https://example.com/certificate/react-ssr-nextjs",
    tags: ["React", "Next.js", "SSR", "Frontend"],
  },
];
