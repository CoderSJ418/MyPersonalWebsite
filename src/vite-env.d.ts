/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL?: string
  readonly VITE_GITHUB_TOKEN?: string
  readonly VITE_VERCEL_TOKEN?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface Window {
  dataLayer: unknown[]
  gtag?: (...args: unknown[]) => void
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
