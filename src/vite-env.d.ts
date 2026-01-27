/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL?: string
  readonly VITE_GITHUB_TOKEN?: string
  readonly VITE_VERCEL_TOKEN?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
