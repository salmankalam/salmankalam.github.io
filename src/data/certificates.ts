export interface Certificate {
  name: string;
  image: string;
  link: string;
  tags: string[];
}

export const certificates: Certificate[] = [
  {
    name: "Career Essentials in GitHub Professional Certificate",
    image: "certificates/career-essentials-github-professional.png",
    link: "https://example.com/certificate/career-essentials-github",
    tags: ["GitHub", "Version Control", "Collaboration", "Professional Development"],
  },
  {
    name: "Design Thinking Data Intelligence",
    image: "certificates/design-thinking-data-intelligence.png",
    link: "https://example.com/certificate/design-thinking-data-intelligence",
    tags: ["Design Thinking", "Data Intelligence", "Problem Solving", "Analytics"],
  },
  {
    name: "Introduction to Analytics Engineering",
    image: "certificates/introduction-analytics-engineering.png",
    link: "https://example.com/certificate/introduction-analytics-engineering",
    tags: ["Analytics Engineering", "Data Pipelines", "SQL", "Data Engineering"],
  },
  {
    name: "Practical GitHub Project Management and Collaboration",
    image: "certificates/practical-github-project-management.png",
    link: "https://example.com/certificate/practical-github-project-management",
    tags: ["GitHub", "Project Management", "Agile", "Team Collaboration"],
  },
  {
    name: "Java Algorithms",
    image: "certificates/java-algorithms.png",
    link: "https://example.com/certificate/java-algorithms",
    tags: ["Java", "Algorithms", "Data Structures", "Programming"],
  },
  {
    name: "Practical GitHub Actions",
    image: "certificates/practical-github-actions.png",
    link: "https://example.com/certificate/practical-github-actions",
    tags: ["GitHub", "CI/CD", "Automation", "DevOps"],
  },
];