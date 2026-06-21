---
name: smart-explore
description: use when exploring a project directory to discover structure while excluding noise (dependencies, build artifacts, version control)
---

Smart directory exploration for any project type. Discovers repos, packages, entry points, and key files while excluding noise that bloats context.

## Exclusions

### Always exclude
`.git`, `node_modules`, `vendor`, `.venv`, `venv`, `dist`, `build`, `target`, `__pycache__`, `.cache`, `coverage`, `.idea`, `.vscode`, `.DS_Store`

### Add when detected
- Python: `.tox`, `.nox`, `.pytest_cache`, `.mypy_cache`
- Rust: `.cargo/`
- Java: `.gradle/`, `.mvn/`
- .NET: `bin/`, `obj/`
- Ruby: `.bundle/`, `tmp/`
- PHP: `.composer/`

## Workflow

### 1. Read `.gitignore` (if exists)
Add any additional exclusion patterns.

### 2. Detect project type
Check for manifest files: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`, `composer.json`, `*.csproj`, `CMakeLists.txt`

### 3. Walk directory tree
Use `find` with exclusions. Start shallow (`-maxdepth 2`), go deeper only when needed.

```bash
find /workspace/<project> -maxdepth 2 -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | head -50
```

### 4. Find packages
Locate manifest files to identify all packages/repos.

### 5. Read manifests
For each package discovered, read its manifest to understand dependencies and structure.

## Rules

- Use `-maxdepth` to control depth; start shallow
- Limit results with `head` to avoid overwhelming context
- Adapt exclusions based on detected language/ecosystem
- Skip binary files and large artifacts
