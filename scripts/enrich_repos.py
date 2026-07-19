#!/usr/bin/env python3
"""
enrich_repos.py - Enrich repos.json with AI-powered summaries and tags.
Reads the existing repos.json and updates entries with ai_enriched: false.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
REPOS_JSON_PATH = BASE_DIR / "repos.json"

ENRICHMENTS = {
    "sovereignmarine": {
        "short_summary": "A full-stack SaaS dashboard built with TanStack Start and React",
        "long_summary": "A modern full-stack SaaS application built with TanStack Start, React 19, and TypeScript. Features a comprehensive shadcn/ui component library with Radix UI primitives, Tailwind CSS v4 styling, and a Vite build system. Includes routing, authentication, and data management with TanStack Router and React Query.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend", "fullstack"],
            "tools": ["React", "TanStack Start", "TanStack Router", "Tailwind CSS", "shadcn/ui", "Radix UI", "Vite", "Zod", "TypeScript"],
            "type": ["project", "saas"]
        }
    },
    "viva-ecommerce-store": {
        "short_summary": "A modern e-commerce storefront built with React and TypeScript",
        "long_summary": "A full-featured e-commerce storefront application built with React 19, TypeScript, and TanStack technologies. Uses shadcn/ui component library with Tailwind CSS for styling, TanStack Router for navigation, and Vite as the build tool. Designed as a modern, scalable e-commerce platform.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend", "e-commerce"],
            "tools": ["React", "TanStack Router", "TanStack React Query", "Tailwind CSS", "shadcn/ui", "Radix UI", "Vite", "TypeScript"],
            "type": ["project", "e-commerce"]
        }
    },
    "retail-ai-backend": {
        "short_summary": "A FastAPI backend for retail AI analytics and forecasting",
        "long_summary": "A Python-based backend API service built with FastAPI for retail AI analytics. Implements machine learning models using scikit-learn, Prophet for time series forecasting, and SHAP for model explainability. Includes data cleaning, ML pipelines, and Supabase integration for data storage. Deployed via Render.",
        "tags": {
            "languages": ["Python"],
            "domain": ["backend", "data analysis", "machine learning"],
            "tools": ["FastAPI", "scikit-learn", "Prophet", "SHAP", "pandas", "numpy", "Uvicorn", "Supabase"],
            "type": ["project", "api"]
        }
    },
    "price_prediction_used_cars_explainable_ai": {
        "short_summary": "Explainable AI model for used car price prediction",
        "long_summary": "A machine learning project that predicts used car prices using ensemble models (LightGBM) with comprehensive Explainable AI (XAI) analysis. Includes data preprocessing, model training with multiple algorithms, and SHAP-based interpretability visualizations (summary plots, bar charts). Compares XAI methods for transparency in price predictions.",
        "tags": {
            "languages": ["Jupyter Notebook", "Python"],
            "domain": ["data analysis", "machine learning"],
            "tools": ["LightGBM", "SHAP", "scikit-learn", "pandas", "numpy", "Jupyter"],
            "type": ["project", "machine learning"]
        }
    },
    "car-prediction-insights": {
        "short_summary": "A web dashboard for visualizing car prediction insights",
        "long_summary": "A frontend web application built with Lovable that provides visual insights and analytics for car prediction data. Serves as the frontend interface for the car prediction system.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend", "data visualization"],
            "tools": ["React", "Tailwind CSS", "Vite"],
            "type": ["project", "dashboard"]
        }
    },
    "car-prediction-backend": {
        "short_summary": "Backend API server for car prediction services",
        "long_summary": "A backend service that handles data processing and prediction logic for the car prediction system. Provides API endpoints for serving predictions and managing car-related data.",
        "tags": {
            "languages": ["Python"],
            "domain": ["backend", "api"],
            "tools": ["FastAPI", "Python"],
            "type": ["project", "api"]
        }
    },
    "dba": {
        "short_summary": "Database analytics project with Northstar dataset analysis",
        "long_summary": "A data analytics repository focused on database analysis and business intelligence using the Northstar dataset. Includes data cleaning, analytics implementation, and dataset processing pipelines.",
        "tags": {
            "languages": ["Python"],
            "domain": ["data analysis", "database"],
            "tools": ["pandas", "Jupyter"],
            "type": ["project", "analytics"]
        }
    },
    "The-Registry": {
        "short_summary": "A modern web application built with React and Vite",
        "long_summary": "A frontend web application built with React, TypeScript, and Vite. Features shadcn/ui components, Tailwind CSS styling, and comprehensive testing setup with Playwright and Vitest.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend"],
            "tools": ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Playwright", "Vitest", "TypeScript"],
            "type": ["project"]
        }
    },
    "fragment": {
        "short_summary": "A React-based web application with modern tooling",
        "long_summary": "A frontend web application built with React, TypeScript, and Vite. Uses shadcn/ui component library, Tailwind CSS for styling, and includes a robust testing setup with Playwright for E2E testing and Vitest for unit testing.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend"],
            "tools": ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Playwright", "Vitest", "TypeScript"],
            "type": ["project"]
        }
    },
    "ai_tools_hub": {
        "short_summary": "A curated directory of AI tools and resources",
        "long_summary": "A static HTML website that serves as a comprehensive directory of AI tools, featuring tool listings with descriptions, categories, and images. Covers a wide range of AI-powered tools for various use cases.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "curation"],
            "tools": ["HTML", "CSS"],
            "type": ["project", "directory"]
        }
    },
    "chatbot": {
        "short_summary": "A Python chatbot with natural language processing",
        "long_summary": "A Python-based chatbot application with NLP capabilities. Includes training data, example scripts, and a modular source code structure. Deployable via Heroku with a Procfile configuration.",
        "tags": {
            "languages": ["Python"],
            "domain": ["backend", "nlp"],
            "tools": ["Python", "NLP", "Heroku"],
            "type": ["project", "chatbot"]
        }
    },
    "nextjs-dashboard": {
        "short_summary": "A Next.js dashboard with authentication and analytics",
        "long_summary": "A full-stack dashboard application built with Next.js 14+ and TypeScript. Features authentication system with NextAuth.js, PostgreSQL database integration, Tailwind CSS styling, and a responsive dashboard layout for data visualization and management.",
        "tags": {
            "languages": ["TypeScript", "CSS", "JavaScript"],
            "domain": ["frontend", "fullstack", "dashboard"],
            "tools": ["Next.js", "React", "TypeScript", "Tailwind CSS", "NextAuth.js", "PostgreSQL", "pnpm"],
            "type": ["project", "dashboard"]
        }
    },
    "myblog": {
        "short_summary": "A full-stack blog application with Node.js and EJS",
        "long_summary": "A complete blog application built with Node.js, Express.js, and EJS templating engine. Features server-side rendering, public asset management, task scheduling, and a clean blog interface. Includes 404 handling and a modular view structure.",
        "tags": {
            "languages": ["JavaScript", "HTML", "CSS"],
            "domain": ["fullstack", "blog"],
            "tools": ["Node.js", "Express.js", "EJS", "JavaScript"],
            "type": ["project", "blog"]
        }
    },
    "travelandtour": {
        "short_summary": "A travel and tour booking website",
        "long_summary": "A frontend website for a travel and tour agency, featuring destination listings, booking information, and travel packages. Built with modern web technologies to provide an engaging user experience.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "travel"],
            "tools": ["HTML", "CSS", "JavaScript"],
            "type": ["project", "website"]
        }
    },
    "tictactoe": {
        "short_summary": "A classic Tic Tac Toe game built with web technologies",
        "long_summary": "An interactive Tic Tac Toe game implementation with a clean user interface. Features game logic, score tracking, and responsive design for both desktop and mobile play.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "game"],
            "tools": ["HTML", "CSS", "JavaScript"],
            "type": ["project", "game"]
        }
    },
    "portfolio": {
        "short_summary": "A personal portfolio website showcasing projects and skills",
        "long_summary": "A personal portfolio website that showcases projects, skills, and professional experience. Designed to highlight work samples and provide contact information for potential employers or clients.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "portfolio"],
            "tools": ["HTML", "CSS", "JavaScript"],
            "type": ["project", "portfolio"]
        }
    },
    "rentalcar": {
        "short_summary": "A car rental booking website",
        "long_summary": "A frontend website for a car rental service, featuring vehicle listings, booking forms, and pricing information. Provides an intuitive interface for browsing and reserving rental cars.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "rental"],
            "tools": ["HTML", "CSS", "JavaScript"],
            "type": ["project", "website"]
        }
    },
    "Web-Notes": {
        "short_summary": "A web-based note-taking application",
        "long_summary": "A browser-based note-taking application that allows users to create, edit, and manage notes online. Features a clean interface for efficient note organization and retrieval.",
        "tags": {
            "languages": ["HTML", "CSS", "JavaScript"],
            "domain": ["frontend", "productivity"],
            "tools": ["HTML", "CSS", "JavaScript"],
            "type": ["project", "app"]
        }
    },
    "Notes": {
        "short_summary": "A notes application with backend capabilities",
        "long_summary": "A notes application that provides note management functionality. Built with a Python backend for data persistence and retrieval.",
        "tags": {
            "languages": ["Python"],
            "domain": ["backend", "productivity"],
            "tools": ["Python"],
            "type": ["project", "app"]
        }
    },
    "salmankalam.github.io": {
        "short_summary": "Personal GitHub Pages portfolio website",
        "long_summary": "The main portfolio website hosted on GitHub Pages at salmankalam.github.io. Serves as a personal landing page and will be expanded to showcase projects from the repository data.",
        "tags": {
            "languages": ["HTML", "CSS"],
            "domain": ["frontend", "portfolio", "github pages"],
            "tools": ["GitHub Pages", "HTML", "CSS"],
            "type": ["project", "portfolio"]
        }
    }
}


def main():
    with open(REPOS_JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    enriched_count = 0
    for repo in data["repos"]:
        name = repo["name"]
        if name in ENRICHMENTS:
            enrichment = ENRICHMENTS[name]
            repo["short_summary"] = enrichment["short_summary"]
            repo["long_summary"] = enrichment["long_summary"]
            repo["tags"] = enrichment["tags"]
            repo["ai_enriched"] = True
            enriched_count += 1

    with open(REPOS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Enriched {enriched_count}/{len(data['repos'])} repos")
    remaining = [r["name"] for r in data["repos"] if not r["ai_enriched"]]
    if remaining:
        print(f"Not enriched: {', '.join(remaining)}")
    print("Done!")


if __name__ == "__main__":
    main()
