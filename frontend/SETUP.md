# Frontend Setup Instructions

## Install Dependencies

Run the following command in the `frontend` directory:

```bash
npm install
```

This will install all required dependencies including:
- Vue 3
- Tailwind CSS v4
- Axios
- TypeScript
- Vite

## Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Tailwind CSS v4

This project uses Tailwind CSS v4 which has a new CSS-first configuration approach:
- `postcss.config.js` - PostCSS configuration with @tailwindcss/postcss plugin
- `src/style.css` - Imports Tailwind and defines custom theme variables
- No JavaScript config file needed (tailwind.config.js is empty)

## Troubleshooting

If Tailwind styles aren't applying:
1. Stop the dev server (Ctrl+C)
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Run `npm run dev`

If rounded corners still don't work, the dev server needs to be restarted to pick up the Tailwind configuration changes.
