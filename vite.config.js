import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this repo at /TravelApp/, not at the domain root, so the
// built asset URLs need that prefix or every script and stylesheet 404s.
//
// It is gated on an env var the Pages workflow sets, deliberately: setting
// `base` unconditionally would also move `npm run dev` and `npm run preview`
// to /TravelApp/, which silently breaks `npm run smoke` and every bookmark
// anyone has locally.
const base = process.env.GITHUB_PAGES ? '/TravelApp/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
