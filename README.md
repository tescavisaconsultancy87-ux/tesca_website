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

## 🤖 AI Chat Assistant with PDF Training

The website includes a Gemini-powered AI chat assistant. You can feed custom knowledge or "train" the AI on your specific business files by simply dropping a PDF file in the root of the project:

1. **How to train**: Save or copy your PDF file (e.g. `knowledge.pdf` or `tesca_details.pdf`) directly into the project root directory (`lunar-aurora/`).
2. **Dynamic Reading**: The server-side API endpoint [chat.ts](file:///c:/Users/dhame/Desktop/TESCA_2005/lunar-aurora/src/pages/api/chat.ts) automatically detects the `.pdf` file in the root, extracts its text, and passes it to the Gemini API as reference context.
3. **Environment setup**: Make sure your `.env` file contains a valid `GEMINI_API_KEY`.
4. **Caching**: To ensure fast load times, the parsed PDF content is cached in memory and only re-parsed if the PDF file is updated.
