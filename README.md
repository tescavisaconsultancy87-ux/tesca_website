# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🔐 Security & Environment Variables

All sensitive values, credentials, and API keys are stored in environment variables and must **never** be hardcoded anywhere in the codebase.

- **Local Development**: Copy `.env.example` to `.env` and fill in your local credentials.
- **Production (Cloudflare Workers)**: Set production secrets using `npx wrangler secret put <KEY_NAME>` or via the Cloudflare Dashboard.

> [!WARNING]
> **Git History Secret Rotation Notice**: If any API key, database token, or app password was previously hardcoded in source files or configuration prior to environment variable migration, **those old secret values remain accessible in past Git commits**. You MUST immediately rotate those secrets in their respective administrative consoles (Supabase, Gmail, Groq, Google Cloud, etc.) to ensure complete infrastructure security.

