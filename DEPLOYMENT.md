# Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Crypto Market Analyzer"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Your app will be live!**
   - Vercel provides a URL like: `https://your-app.vercel.app`
   - Custom domains can be added later

## Alternative: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

## Environment Variables

No environment variables needed for this project! The Binance API is public and doesn't require authentication.

## Build Verification

Before deploying, test the build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works.

## Troubleshooting

**Build fails?**
- Check Node.js version (should be 18+)
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors: `npm run build`

**API errors in production?**
- Binance API might have CORS restrictions
- Consider adding a Next.js API route as a proxy
- Check Vercel/Netlify function logs

**Styling issues?**
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.ts` paths
- Verify `postcss.config.js` exists

