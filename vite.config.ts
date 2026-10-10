import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Helper to safely load .env in Node without leaking
function loadLocalEnv() {
  const envPath = path.resolve(__dirname, '.env')
  if (fs.existsSync(envPath)) {
    try {
      const text = fs.readFileSync(envPath, 'utf8')
      for (const line of text.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eq = trimmed.indexOf('=')
        if (eq > 0) {
          const k = trimmed.slice(0, eq).trim()
          let v = trimmed.slice(eq + 1).trim()
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
          if (!process.env[k]) process.env[k] = v
        }
      }
    } catch {}
  }
}
loadLocalEnv()

const netlifyFunctionsPlugin = () => ({
  name: 'local-netlify-functions',
  configurePreviewServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const parsedUrl = new URL(req.url, 'http://localhost')
      if (parsedUrl.pathname === '/.netlify/functions/latest-live') {
        try {
          const { handler } = await import('./netlify/functions/latest-live.mjs')
          const result = await handler()
          res.writeHead(result.statusCode || 200, result.headers || { 'Content-Type': 'application/json' })
          res.end(result.body || '')
          return
        } catch (e) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Function unavailable' }))
          return
        }
      }
      next()
    })
  },
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const parsedUrl = new URL(req.url, 'http://localhost')
      if (parsedUrl.pathname === '/.netlify/functions/latest-live') {
        try {
          const { handler } = await import('./netlify/functions/latest-live.mjs')
          const result = await handler()
          res.writeHead(result.statusCode || 200, result.headers || { 'Content-Type': 'application/json' })
          res.end(result.body || '')
          return
        } catch (e) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Function unavailable' }))
          return
        }
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    netlifyFunctionsPlugin(),
  ],
  preview: {
    host: true,
    port: 4176,
    allowedHosts: true,
  },
})

