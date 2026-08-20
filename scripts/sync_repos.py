#!/usr/bin/env python3
"""
sync_repos.py - Sync GitHub repos to repos.json
- Fetches all repos from GitHub API
- Detects new repos
- Analyzes each repo (languages, topics, frontend detection, Pages status)
- Enables GitHub Pages for frontend repos if not already enabled
- Updates repos.json with all data
"""

import base64
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

OWNER = "salmankalam"
BASE_DIR = Path(__file__).resolve().parent.parent
REPOS_JSON_PATH = BASE_DIR / "repos.json"
OPENSE_JSON_PATH = BASE_DIR / "opencode.json"
GITHUB_API = "https://api.github.com"


def get_token():
    token = os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN")
    if token:
        return token
    try:
        with open(OPENSE_JSON_PATH, encoding="utf-8") as f:
            config = json.load(f)
        env = config.get("mcp", {}).get("github", {}).get("environment", {})
        token = env.get("GITHUB_PERSONAL_ACCESS_TOKEN")
        if token:
            return token
    except Exception:
        pass
    print("ERROR: No GitHub token found. Set GITHUB_PERSONAL_ACCESS_TOKEN env var.")
    sys.exit(1)


def get_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
    }


def repo_name_to_title(name):
    name = name.split("/")[-1]
    title = re.sub(r'[-_./]', ' ', name)
    title = title.title()
    title = re.sub(r'\bAi\b', 'AI', title)
    title = re.sub(r'\bApi\b', 'API', title)
    title = re.sub(r'\bCss\b', 'CSS', title)
    title = re.sub(r'\bHtml\b', 'HTML', title)
    title = re.sub(r'\bJs\b', 'JS', title)
    title = re.sub(r'\bCi\b', 'CI', title)
    title = re.sub(r'\bCd\b', 'CD', title)
    return title


def fetch_all_repos(token):
    repos = []
    page = 1
    headers = get_headers(token)
    while True:
        r = requests.get(
            f"{GITHUB_API}/user/repos",
            headers=headers,
            params={"per_page": 100, "page": page, "sort": "updated", "type": "all"},
        )
        if r.status_code != 200:
            print(f"ERROR: Failed to fetch repos: {r.status_code} {r.text}")
            sys.exit(1)
        data = r.json()
        if not data:
            break
        repos.extend(data)
        page += 1
    return repos


def fetch_repo_languages(token, full_name):
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/languages", headers=get_headers(token))
    return r.json() if r.status_code == 200 else {}


def fetch_repo_topics(token, full_name):
    headers = {**get_headers(token), "Accept": "application/vnd.github.mercy-preview+json"}
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/topics", headers=headers)
    return r.json().get("names", []) if r.status_code == 200 else []


def fetch_readme(token, full_name):
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3.raw"}
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/readme", headers=headers)
    text = r.text if r.status_code == 200 else ""
    if text.startswith("\ufeff"):
        text = text[1:]
    return text


def fetch_repo_contents(token, full_name):
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/contents", headers=get_headers(token))
    return r.json() if r.status_code == 200 else []


def fetch_repo_contents_at(token, full_name, path):
    r = requests.get(
        f"{GITHUB_API}/repos/{full_name}/contents/{path}",
        headers=get_headers(token),
    )
    return r.json() if r.status_code == 200 else []


def check_pages(token, full_name):
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/pages", headers=get_headers(token))
    return r.json() if r.status_code == 200 else None


DEPLOY_WORKFLOW = """name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Install dependencies
        run: npm ci || npm install
      - name: Build site
        run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
"""


def get_file_sha(token, full_name, path):
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/contents/{path}", headers=get_headers(token))
    return r.json().get("sha") if r.status_code == 200 else None


def create_or_update_file(token, full_name, path, content, message):
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3+json"}
    sha = get_file_sha(token, full_name, path)
    payload = {
        "message": message,
        "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
    }
    if sha:
        payload["sha"] = sha
    r = requests.put(f"{GITHUB_API}/repos/{full_name}/contents/{path}", headers=headers, json=payload)
    return r.status_code in (200, 201)


def ensure_vite_base(token, full_name):
    """Add base './' to vite.config.ts so assets resolve under a subpath (repo-name/)."""
    sha = get_file_sha(token, full_name, "vite.config.ts")
    if not sha:
        return False
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3.raw"}
    r = requests.get(f"{GITHUB_API}/repos/{full_name}/contents/vite.config.ts", headers=headers)
    if r.status_code != 200:
        return False
    text = r.text
    if "base" in text and re.search(r'base\s*:', text):
        return True
    if "defineConfig({" not in text:
        return False
    updated = text.replace("defineConfig({", 'defineConfig({\n  base: "./",', 1)
    return create_or_update_file(
        token,
        full_name,
        "vite.config.ts",
        updated,
        "chore: add base './' for GitHub Pages subpath",
    )


def set_pages_workflow(token, full_name):
    """Switch the Pages build to 'workflow' so Actions (not legacy Jekyll) deploys dist."""
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3+json"}
    r = requests.put(
        f"{GITHUB_API}/repos/{full_name}/pages",
        headers=headers,
        json={"build_type": "workflow"},
    )
    return r.status_code in (200, 201, 204)


def enable_pages_workflow(token, full_name):
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3+json"}
    r = requests.post(
        f"{GITHUB_API}/repos/{full_name}/pages",
        headers=headers,
        json={"build_type": "workflow"},
    )
    return r.status_code in (200, 201, 204)


def enable_pages(token, full_name, branch="main", path="/"):
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3+json"}
    r = requests.post(
        f"{GITHUB_API}/repos/{full_name}/pages",
        headers=headers,
        json={"source": {"branch": branch, "path": path}},
    )
    return r.status_code in (200, 201, 204)


def is_vite_project(token, full_name, contents):
    """True if the repo is a Vite/React app (needs workflow build, never legacy deploy)."""
    if not isinstance(contents, list):
        return False
    names = {item.get("name") for item in contents if isinstance(item, dict)}
    if "vite.config.ts" in names or "vite.config.js" in names or "vite.config.mts" in names:
        return True
    if "package.json" in names:
        try:
            pkg = fetch_repo_contents_at(token, full_name, "package.json")
            if isinstance(pkg, dict):
                raw = base64.b64decode(pkg.get("content", "")).decode("utf-8")
                data = json.loads(raw)
                scripts = data.get("scripts", {}) or {}
                devdeps = data.get("devDependencies", {}) or {}
                build = str(scripts.get("build", ""))
                return "vite" in devdeps or "vite build" in build or "vite" in devdeps.get("vite", "")
        except Exception:
            return False
    return False


DEPLOY_PAGES_YAML = """name: Deploy to GitHub Pages

on:
  push:
    branches: [{branch}]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: {upload_path}
      - uses: actions/deploy-pages@v4
"""


def create_deploy_workflow(token, full_name, default_branch, upload_path):
    """Commit .github/workflows/deploy-pages.yml into the target repo.

    Requires the token to have the `workflow` scope (contents write).
    Returns True if the workflow is present/created, False on failure.
    """
    headers = {**get_headers(token), "Accept": "application/vnd.github.v3+json"}
    wf_path = ".github/workflows/deploy-pages.yml"

    check = requests.get(
        f"{GITHUB_API}/repos/{full_name}/contents/{wf_path}",
        headers=headers,
    )
    if check.status_code == 200:
        print(f"     Workflow already present, skipping")
        return True

    content = DEPLOY_PAGES_YAML.format(
        branch=default_branch or "main", upload_path=upload_path
    )
    r = requests.put(
        f"{GITHUB_API}/repos/{full_name}/contents/{wf_path}",
        headers=headers,
        json={
            "message": "chore: add GitHub Pages deploy workflow",
            "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
        },
    )
    return r.status_code in (200, 201)


def detect_pages_source(token, full_name, contents):
    """Detect how a repo should be published to Pages.

    Returns (build_type, source) where build_type is "legacy" or "workflow",
    or None if no hostable content is found.
    - legacy "/": root index.html
    - legacy "/docs": docs/index.html
    - workflow "dist": dist/index.html
    - workflow "dist/client": dist/client/index.html
    """
    if not isinstance(contents, list):
        return None
    names = {item.get("name") for item in contents if isinstance(item, dict)}

    if "index.html" in names:
        return ("legacy", "/")

    if "dist" in names:
        dist = fetch_repo_contents_at(token, full_name, "dist")
        if isinstance(dist, list):
            dist_names = {item.get("name") for item in dist if isinstance(item, dict)}
            if "index.html" in dist_names:
                return ("workflow", "dist")
            if "client" in dist_names:
                client = fetch_repo_contents_at(token, full_name, "dist/client")
                if isinstance(client, list) and any(
                    isinstance(i, dict) and i.get("name") == "index.html"
                    for i in client
                ):
                    return ("workflow", "dist/client")

    if "docs" in names:
        docs = fetch_repo_contents_at(token, full_name, "docs")
        if isinstance(docs, list) and any(
            isinstance(i, dict) and i.get("name") == "index.html" for i in docs
        ):
            return ("legacy", "/docs")

    return None


def is_frontend_repo(languages, contents, full_name, repo_info):
    if isinstance(contents, list):
        names = {item.get("name") for item in contents}
        # Root index.html (plain HTML site)
        if "index.html" in names:
            return True
        # dist/ or dist/client build output (e.g. React/Vite/TanStack)
        for folder in ("dist", "docs"):
            if folder in names:
                return True

    if languages:
        primary = max(languages, key=languages.get)
        if primary.lower() in ("html", "css", "javascript", "typescript"):
            return True

    desc = (repo_info.get("description") or "").lower()
    frontend_keywords = [
        "frontend", "front-end", "react", "vue", "angular",
        "svelte", "ui", "web app", "website", "landing page",
    ]
    if any(kw in desc for kw in frontend_keywords):
        return True

    return False


def generate_basic_summary(repo_info, readme_text, languages, topics):
    desc = repo_info.get("description") or ""

    short = desc if desc else ""
    if not short and readme_text:
        first_line = readme_text.strip().split("\n")[0]
        first_line = re.sub(r'^#+\s*', '', first_line)
        short = first_line[:200]
    if not short:
        langs = list(languages.keys())[:3]
        short = f"A {', '.join(langs) if langs else 'project'} repository"

    long = ""
    if readme_text:
        lines = readme_text.strip().split("\n")
        paragraph = []
        for line in lines:
            stripped = line.strip()
            if not stripped and paragraph:
                break
            if stripped and not stripped.startswith("#"):
                paragraph.append(stripped)
        long = " ".join(paragraph)[:1000] if paragraph else ""
    if not long:
        long = short

    tag_languages = list(languages.keys()) if languages else ["Unknown"]
    tag_domain = set()
    tag_tools = set()
    tag_type = set()

    desc_lower = desc.lower()
    readme_lower = (readme_text or "").lower()
    combined = desc_lower + " " + readme_lower

    domain_keywords = {
        "frontend": ["frontend", "front-end", "ui", "web app", "website", "landing page", "react", "vue"],
        "backend": ["backend", "back-end", "api", "server", "rest", "express"],
        "data analysis": ["data analysis", "data science", "machine learning", "ml", "prediction", "analysis"],
        "deployment": ["deployment", "ci/cd", "devops", "docker"],
        "database": ["database", "db", "sql", "nosql", "postgresql", "mongodb"],
        "fullstack": ["fullstack", "full-stack", "full stack"],
    }
    for domain, keywords in domain_keywords.items():
        if any(kw in combined for kw in keywords):
            tag_domain.add(domain)

    if not tag_domain:
        if any(lang in ("Python", "Jupyter Notebook", "R") for lang in tag_languages):
            tag_domain.add("data analysis")
        elif any(lang in ("JavaScript", "TypeScript", "HTML", "CSS") for lang in tag_languages):
            tag_domain.add("frontend")
        else:
            tag_domain.add("general")

    tool_keywords = [
        "react", "vue", "angular", "svelte", "next.js", "nextjs", "nuxt",
        "tailwind", "bootstrap", "material-ui", "chakra",
        "django", "flask", "fastapi", "express", "node.js", "nodejs",
        "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
        "docker", "kubernetes", "github actions",
        "postgresql", "mysql", "mongodb", "sqlite",
        "typescript", "jquery", "webpack", "vite",
    ]
    for tool in tool_keywords:
        if re.search(r'\b' + re.escape(tool) + r'\b', combined, re.IGNORECASE):
            tag_tools.add(tool)

    combined_lower = (desc + " " + readme_text).lower()
    if any(kw in combined_lower for kw in ["tutorial", "learning", "learn", "course"]):
        tag_type.add("tutorial")
    if any(kw in combined_lower for kw in ["template", "starter", "boilerplate"]):
        tag_type.add("template")
    if any(kw in combined_lower for kw in ["project", "app", "application", "demo"]):
        tag_type.add("project")
    if not tag_type:
        tag_type.add("project")

    return short, long, {
        "languages": tag_languages,
        "domain": sorted(tag_domain),
        "tools": sorted(tag_tools),
        "type": sorted(tag_type),
    }


def fetch_pinned_repos(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    query = {
        "query": """
        query {
          user(login: "%s") {
            pinnedItems(first: 10, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                }
              }
            }
          }
        }
        """
        % OWNER
    }
    r = requests.post("https://api.github.com/graphql", headers=headers, json=query)
    if r.status_code != 200:
        print(f"  WARNING: Failed to fetch pinned repos: {r.status_code}")
        return []
    data = r.json()
    nodes = data.get("data", {}).get("user", {}).get("pinnedItems", {}).get("nodes", [])
    pinned = [n["name"] for n in nodes if "name" in n]
    print(f"  Pinned repos: {pinned}")
    return pinned


def load_existing_repos():
    if REPOS_JSON_PATH.exists():
        with open(REPOS_JSON_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {"last_updated": None, "repos": []}


def save_repos(data):
    with open(REPOS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved repos.json")


def main():
    print("=" * 60)
    print("  GitHub Repo Sync Script")
    print("=" * 60)

    token = get_token()
    existing = load_existing_repos()
    tracked_names = {r["full_name"] for r in existing["repos"]}
    # Repos the user hosts externally (not on GitHub Pages) — never enable Pages.
    externally_hosted = {
        r["full_name"]
        for r in existing["repos"]
        if r.get("hostedByTheUser")
    }
    print(f"\n Tracked repos: {len(tracked_names)}")

    print("\n Fetching pinned repos...")
    pinned_names = fetch_pinned_repos(token)
    for repo in existing["repos"]:
        repo["pinned"] = repo["name"] in pinned_names

    print("\n Fetching repos from GitHub...")
    repos = fetch_all_repos(token)
    print(f"   Found {len(repos)} repos total")

    new_repos = [r for r in repos if r["full_name"] not in tracked_names]
    print(f"\n New repos: {len(new_repos)}")

    if not new_repos:
        print("\n No new repos found. Nothing to do.")
        existing["last_updated"] = datetime.now(timezone.utc).isoformat()
        save_repos(existing)
        return

    pages_enabled_count = 0
    pages_already_active = 0

    for repo in new_repos:
        full_name = repo["full_name"]
        name = repo["name"]
        print(f"\n{'=' * 50}")
        print(f"  Processing: {full_name}")
        print(f"{'=' * 50}")

        print(f"  Fetching details...")
        languages = fetch_repo_languages(token, full_name)
        topics = fetch_repo_topics(token, full_name)
        readme_text = fetch_readme(token, full_name)
        contents = fetch_repo_contents(token, full_name)

        print(f"  Analyzing...")
        frontend = is_frontend_repo(languages, contents, full_name, repo)
        print(f"     Frontend: {frontend}")

        pages_info = check_pages(token, full_name)
        pages_url = None
        pages_on = False

        if frontend and full_name not in externally_hosted:
            if pages_info and pages_info.get("build_type") == "workflow":
                pages_already_active += 1
                pages_on = True
                if full_name == f"{OWNER}/{OWNER}.github.io":
                    pages_url = f"https://{OWNER}.github.io"
                else:
                    pages_url = pages_info.get("html_url") or f"https://{OWNER}.github.io/{name}/"
                print(f"     Pages active (workflow): {pages_url}")
            elif is_vite_project(token, full_name, contents):
                print(f"     Vite/React app detected; deploying built dist via Actions...")
                default_branch = repo.get("default_branch") or "main"
                wf_ok = create_deploy_workflow(token, full_name, default_branch, "dist")
                ensure_vite_base(token, full_name)
                if pages_info:
                    pw_ok = set_pages_workflow(token, full_name)
                else:
                    pw_ok = enable_pages_workflow(token, full_name)
                if wf_ok and pw_ok:
                    pages_enabled_count += 1
                    pages_on = True
                    pages_url = f"https://{OWNER}.github.io/{name}/"
                    if full_name == f"{OWNER}/{OWNER}.github.io":
                        pages_url = f"https://{OWNER}.github.io"
                    print(f"     Pages enabled (workflow): {pages_url}")
                else:
                    print(f"     Failed: workflow={wf_ok}, pages={pw_ok}")
            else:
                print(f"     Detecting publish source...")
                source = detect_pages_source(token, full_name, contents)
                if not source:
                    print(f"     No hostable index.html found; skipping Pages")
                elif source[0] == "legacy":
                    print(f"     Enabling Pages (legacy, path {source[1]})...")
                    success = enable_pages(token, full_name, path=source[1])
                    if not success:
                        success = enable_pages(token, full_name, "master", source[1])
                    if success:
                        pages_enabled_count += 1
                        pages_on = True
                        pages_url = f"https://{OWNER}.github.io/{name}/"
                        if full_name == f"{OWNER}/{OWNER}.github.io":
                            pages_url = f"https://{OWNER}.github.io"
                        print(f"     Pages enabled: {pages_url}")
                    else:
                        print(f"     Failed to enable Pages")
                else:
                    _, upload_path = source
                    print(f"     Workflow deploy detected (upload {upload_path})...")
                    default_branch = repo.get("default_branch") or "main"
                    wf_ok = create_deploy_workflow(
                        token, full_name, default_branch, upload_path
                    )
                    pw_ok = enable_pages_workflow(token, full_name)
                    if wf_ok and pw_ok:
                        pages_enabled_count += 1
                        pages_on = True
                        pages_url = f"https://{OWNER}.github.io/{name}/"
                        if full_name == f"{OWNER}/{OWNER}.github.io":
                            pages_url = f"https://{OWNER}.github.io"
                        print(f"     Pages enabled (workflow): {pages_url}")
                    else:
                        print(f"     Failed: workflow={wf_ok}, pages={pw_ok}")
        else:
            print(f"     Skipping Pages (not frontend)")

        # Set default pages_url for non-frontend repos (GitHub link is always available)
        if not frontend:
            pages_url = None

        # Externally-hosted repos are never on GitHub Pages.
        externally_hosted_this = full_name in externally_hosted
        if externally_hosted_this:
            pages_url = None

        short, long, tags = generate_basic_summary(repo, readme_text, languages, topics)
        description = repo_name_to_title(name)

        entry = {
            "name": name,
            "full_name": full_name,
            "description": description,
            "short_summary": short,
            "long_summary": long,
            "repo_url": repo["html_url"],
            "pages_url": pages_url,
            "pages_enabled": pages_on and not externally_hosted_this,
            "frontend": frontend,
            "hostedByTheUser": externally_hosted_this,
            "hostedByTheUserLink": None,
            "pinned": name in pinned_names,
            "tags": tags,
            "topics": topics,
            "language": repo.get("language"),
            "languages": languages,
            "created_at": repo["created_at"],
            "updated_at": repo["updated_at"],
            "pushed_at": repo["pushed_at"],
            "size": repo["size"],
            "ai_enriched": False,
        }
        existing["repos"].append(entry)

    existing["repos"].sort(key=lambda r: r["updated_at"], reverse=True)
    existing["last_updated"] = datetime.now(timezone.utc).isoformat()
    save_repos(existing)

    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Total repos:        {len(repos)}")
    print(f"  New repos:          {len(new_repos)}")
    print(f"  Pages enabled:      {pages_enabled_count}")
    print(f"  Pages already active: {pages_already_active}")

    need_ai = [r["full_name"] for r in new_repos]
    if need_ai:
        print(f"\n  Repos needing AI enrichment:")
        for r in need_ai:
            print(f"     - {r}")

    print(f"\n Done!")


if __name__ == "__main__":
    main()
