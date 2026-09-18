# Graph Report - .  (2026-09-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 228 nodes · 349 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ffea7e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync_repos.py
- cn
- sections/index.ts
- compilerOptions
- Projects.tsx
- package.json
- capture-screenshots.js
- command
- devDependencies
- graphify.js

## God Nodes (most connected - your core abstractions)
1. `main()` - 21 edges
2. `compilerOptions` - 19 edges
3. `get_headers()` - 15 edges
4. `cn()` - 13 edges
5. `command` - 10 edges
6. `captureRepo()` - 9 edges
7. `main()` - 6 edges
8. `ensure_vite_base()` - 6 edges
9. `isBlankFile()` - 5 edges
10. `scanLocalImages()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AnimatedTextCycle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/animated-text-cycle.tsx → src/lib/utils.ts
- `DiaTextReveal()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dia-text.tsx → src/lib/utils.ts
- `GlowingEffect()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/glowing-effect.tsx → src/lib/utils.ts
- `GradientButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/gradient-button.tsx → src/lib/utils.ts
- `ProjectPreviewProps` --references--> `Repo`  [EXTRACTED]
  src/components/ui/project-preview.tsx → src/data/repos.ts

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "sync_repos.py"
Cohesion: 0.15
Nodes (30): check_pages(), create_deploy_workflow(), create_or_update_file(), detect_pages_source(), enable_pages(), enable_pages_workflow(), ensure_vite_base(), fetch_all_repos() (+22 more)

### Community 1 - "cn"
Cohesion: 0.15
Nodes (16): roles, AnimatedTextCycle(), AnimatedTextCycleProps, DiaTextProps, DiaTextReveal(), GlowingEffect(), GlowingEffectProps, GradientButton() (+8 more)

### Community 2 - "sections/index.ts"
Cohesion: 0.13
Nodes (14): App(), About(), languages, Certificates(), Contact(), Education(), Footer(), Hero() (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.08
Nodes (25): DOM, DOM.Iterable, ES2023, src, vite/client, compilerOptions, allowImportingTsExtensions, allowSyntheticDefaultImports (+17 more)

### Community 4 - "Projects.tsx"
Cohesion: 0.11
Nodes (17): categories, categorize(), Category, others, pinned, Projects(), validRepos, allDomain (+9 more)

### Community 5 - "package.json"
Cohesion: 0.09
Nodes (21): class-variance-authority, clsx, motion, dependencies, class-variance-authority, clsx, motion, react (+13 more)

### Community 6 - "capture-screenshots.js"
Cohesion: 0.16
Nodes (21): applyPlaceholder(), captureRepo(), __dirname, discoverRoutes(), discoverSections(), FOUR04_TITLES, IMAGE_EXTS, isBlankBuffer() (+13 more)

### Community 7 - "command"
Cohesion: 0.11
Nodes (18): GITHUB_PERSONAL_ACCESS_TOKEN, command, environment, type, mcp, github, plugin, $schema (+10 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, playwright, pngjs, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, typescript (+11 more)

## Knowledge Gaps
- **83 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `type`, `docker`, `run` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `type` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync_repos.py` be split into smaller, more focused modules?**
  _Cohesion score 0.14838709677419354 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.14942528735632185 - nodes in this community are weakly interconnected._
- **Should `sections/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Projects.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10666666666666667 - nodes in this community are weakly interconnected._