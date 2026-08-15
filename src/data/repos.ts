import reposData from "../../repos.json";

export interface Screenshot {
  file: string;
  type: "hero" | "full" | "mobile" | "section";
  label: string;
}

export interface Repo {
  name: string;
  full_name: string;
  description: string;
  short_summary: string;
  long_summary: string;
  repo_url: string;
  pages_url: string | null;
  pages_enabled: boolean;
  frontend: boolean;
  hostedByTheUser?: boolean;
  hostedByTheUserLink?: string | null;
  tags: {
    languages: string[];
    domain: string[];
    tools: string[];
    type: string[];
  };
  topics: string[];
  language: string;
  created_at: string;
  ai_enriched: boolean;
  pinned?: boolean;
  screenshots?: Screenshot[];
  page_title?: string;
  screenshot_error?: string | null;
}

interface ReposFile {
  last_updated: string;
  repos: Repo[];
}

export const repos: Repo[] = (reposData as ReposFile).repos;
