# React Math Game

## Development

Use Node.js 14.18 or newer, then run:

```sh
npm install
npm run dev
```

This project uses Vite 4 to support Node.js 14. Both are out of support;
upgrade Node and Vite when possible to receive security fixes.

With npm 6, the install may warn that the lockfile uses a newer format and
rewrite it. Warnings about optional dependencies for other operating systems
are expected on Windows.

Open the address printed by Vite. Run `npm test` for the existing smoke test
and `npm run build` to create a production build in `dist`. Use
`npm run preview` to preview that build locally.

## GitHub Pages

For a project site at `https://USERNAME.github.io/REPOSITORY/`, set
`VITE_BASE_PATH=/REPOSITORY/` when running `npm run build` and deploy the
resulting `dist` folder. For a user or organization site at the domain root,
the default base path `/` works.

The Pages workflow runs `npm install` before building. npm can update the
lockfile in the runner's temporary checkout, but the workflow does not commit
those changes back to the repository.

The game stores progress in the browser's local storage. GitHub Pages serves
static files and does not provide the backend for the example API requests.

In Configuration, choose multiplication, division, or both, and select the
tables to practise. These settings are saved separately for each user.
Use **New player** next to the player selector to add a name. The player list
and progress stay in this browser. New browsers start without players; existing
player lists and trainer profiles are retained.
