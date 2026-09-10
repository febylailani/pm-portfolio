# pr-evidence

Screenshots attached to pull request descriptions.

This is an **orphan branch**. It shares no history with `main` and is never merged.
It exists because `gh pr edit --body` cannot upload images — GitHub's image-upload
endpoint needs a browser session, not an API token — so the images have to be reachable
at a stable raw URL for the PR description to render them inline.

Keeping them here rather than in `main` means review evidence never shows up in a
feature branch's diff, and never ships to the built site.

Link them as:

    https://raw.githubusercontent.com/febylailani/pm-portfolio/pr-evidence/<path>

| folder | PR |
|---|---|
| `pr21/` | #21 — modal image 404'd on GitHub Pages (missing `url` filter) |
| `pr22/` | #22 — hero tagline copy change |
