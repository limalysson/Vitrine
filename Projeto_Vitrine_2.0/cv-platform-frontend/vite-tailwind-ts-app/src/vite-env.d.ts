/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // outras VITE_* vars...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}