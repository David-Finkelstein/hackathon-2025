# GuestyGuard AI 🤖

## Prerequisites

- **Node.js** 20+ (download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Google API Key** (get from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the root directory with your Google API key:

```bash
cp .env.example .env
```

Then edit `.env` and replace `your_google_api_key_here` with your actual API key:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Run in Development Mode

```bash
npm run dev
```

This will start the development server with hot-reload enabled using `tsx`.

### 4. Build for Production

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 5. Run Production Build

```bash
npm start
```

This runs the compiled JavaScript from the `dist/` directory.

## Project Structure

```
.
├── src/
│   └── index.ts           # Main application entry point
├── dist/                  # Compiled JavaScript (generated)
├── .env                   # Environment variables (local, not in git)
├── .env.example           # Environment template
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled production build |
| `npm run clean` | Remove the dist/ directory |

## Environment Variables

### Required

- **GOOGLE_API_KEY**: Your Google Generative AI API key
  - Get it from: https://aistudio.google.com/app/apikey
  - Never commit this to version control

## API Documentation

For more information on the Google Generative AI API, visit:
- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)

## License

MIT

