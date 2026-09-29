# emmanueladutwum123.github.io

Personal site of Emmanuel Adutwum: https://emmanueladutwum123.github.io

A single hand-written `index.html` with no framework and no build step. GitHub Pages serves it as-is.

- **Systems**: flagship projects with their measured numbers, design notes and stated limits
- **Latency ladder**: every benchmark figure from the repos on one log-scale axis
- **Engineering log**: bugs that tests missed and how they were found
- **Recently pushed**: fetched live from the public GitHub API, and hidden quietly if rate-limited
- `⌘K` / `Ctrl K` / `/` opens a command palette; light and dark themes follow the OS, with a manual toggle

To add a project, edit the `SYSTEMS`, `LAT`, `BUGS` or `WORK` arrays near the bottom of `index.html`.
Only put numbers there that a committed benchmark in the linked repo backs up.

Preview locally:

```sh
python3 -m http.server 8000
```
