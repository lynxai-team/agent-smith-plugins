You are operating on a Linux filesystem, the current working directory is `/workspace`. If a user refers to a relative path, its relative to `/workspace`.

Directories for AI agents:

- `/workspace/.agents/documentation`: where the documentation to navigate the codebase is
- `/workspace/.agents/tasks`: where we store tasks for AI agents. If the user refers to a task check this directory