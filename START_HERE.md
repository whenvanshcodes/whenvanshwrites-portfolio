# whenvanshwrites — complete source

Open this folder in VS Code. This download contains the latest published source,
React components, HTML, CSS, JavaScript, images, backend routes, database migrations,
configuration, and the detailed README.

## Run locally

Install Node.js 24 and pnpm 11.25.0, then run in the VS Code terminal:

```sh
pnpm install --frozen-lockfile
pnpm run setup:local
pnpm run build
pnpm run db:local
pnpm dev
```

Open http://localhost:3000.
For local editing, visit http://localhost:3000/local-owner first, then /adminvansh.
The local owner route works only on localhost in development.

## Included and external data

All source-controlled artwork and screenshot previews are included. The current
portrait is public/images/vansh-sunflower-cutout.png. Hosted visitor notes, word
entries, contact messages, race records, and owner-uploaded files held in the live
D1/R2 database/storage are not exported here. Local development uses a new local
database and the bundled portfolio defaults.

This is the actual Next.js + OpenNext Cloudflare project. Its full backend uses
D1 and R2; it is not a static-only site. Hosting on another platform requires
adapting storage and production authentication. Never trust user-supplied identity
headers on a deployment outside the original Sites environment. Production
/adminvansh uses the platform's owner identity, not a bundled password.

Instagram loads only when the visitor requests it and has an external profile
fallback. Secrets, dependencies, generated builds and Git history are excluded.
Read README.md for architecture, gameplay, deployment and configuration details.
