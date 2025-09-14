# Deployment Guide

## ⚙️ System Requirements

- **Node.js**: >= 22.0.0 (required by Vercel)
- **pnpm**: >= 8.0.0
- **Git**: Latest version
- **GitHub Account**: For repository hosting
- **Vercel Account**: For deployment platform

## 📋 Pre-Deployment Checklist

### 1. Code Quality

- [ ] All tests pass: `pnpm test`
- [ ] TypeScript compilation successful: `pnpm type-check`
- [ ] ESLint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

### 2. Repository Setup

- [ ] Code committed to Git
- [ ] Pushed to GitHub repository
- [ ] Repository is public or Vercel has access

### 3. Vercel Project Setup

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Build settings configured correctly

### 4. GitHub Secrets Configuration

- [ ] `VERCEL_TOKEN` added to repository secrets
- [ ] `VERCEL_ORG_ID` added to repository secrets
- [ ] `VERCEL_PROJECT_ID` added to repository secrets
- [ ] (Optional) `CODECOV_TOKEN` for coverage reports

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Push to main branch**:

   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Monitor deployment**:
   - Check GitHub Actions tab for workflow status
   - Check Vercel dashboard for deployment progress

### Option 2: Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login and deploy**:
   ```bash
   vercel login
   vercel --prod
   ```

## 🔧 Configuration Files

### vercel.json

```json
{
  "version": 2,
  "name": "gomoku-react",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

### .vercelignore

Key files to exclude from deployment:

- `node_modules/`
- `coverage/`
- `test/`
- Development configuration files

## 🐛 Troubleshooting

### Build Failures

**Problem**: TypeScript compilation errors
**Solution**:

```bash
pnpm type-check
# Fix all TypeScript errors before deploying
```

**Problem**: Missing dependencies
**Solution**:

```bash
pnpm install
# Ensure pnpm-lock.yaml is committed
```

**Problem**: Build timeouts
**Solution**:

- Check for infinite loops in code
- Optimize large dependencies
- Increase Vercel timeout limits (Pro plan)

### Deployment Issues

**Problem**: 404 errors on refresh
**Solution**: Ensure `vercel.json` has proper routing:

```json
"routes": [
  { "src": "/(.*)", "dest": "/index.html" }
]
```

**Problem**: Static assets not loading
**Solution**: Check asset paths and caching headers in `vercel.json`

**Problem**: Environment variables not working
**Solution**:

1. Add variables in Vercel dashboard
2. Prefix with `VITE_` for client-side variables
3. Redeploy after adding variables

### GitHub Actions Issues

**Problem**: Workflow fails with authentication errors
**Solution**:

1. Verify GitHub secrets are correctly set
2. Check Vercel token permissions
3. Ensure repository has correct access

**Problem**: Tests fail in CI but pass locally
**Solution**:

1. Check Node.js version consistency
2. Clear cache and reinstall dependencies
3. Check for environment-specific issues

### Performance Issues

**Problem**: Slow loading times
**Solution**:

1. Enable compression in `vercel.json`
2. Optimize bundle size with `vite-bundle-analyzer`
3. Implement code splitting
4. Configure proper caching headers

**Problem**: Large bundle size
**Solution**:

1. Analyze bundle with: `pnpm build && npx vite-bundle-analyzer dist`
2. Remove unused dependencies
3. Implement dynamic imports
4. Use tree shaking

## 📊 Monitoring

### Performance Monitoring

- Use Vercel Analytics for performance insights
- Monitor Core Web Vitals
- Set up alerts for deployment failures

### Error Tracking

- Consider integrating Sentry for error tracking
- Monitor build logs in Vercel dashboard
- Check GitHub Actions logs for CI issues

### Health Checks

```bash
# Test deployment locally
pnpm build && pnpm preview

# Check for common issues
pnpm lint
pnpm type-check
pnpm test
```

## 🔒 Security Considerations

### Content Security Policy

Configure CSP headers in `vercel.json`:

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
      }
    ]
  }
]
```

### Environment Variables

- Never commit sensitive tokens to Git
- Use Vercel environment variables for secrets
- Prefix public variables with `VITE_`

## 📈 Optimization Tips

### Build Optimization

- Use `pnpm` for faster, more efficient builds
- Enable Vercel's Edge Network
- Configure proper caching strategies

### Code Optimization

- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize re-renders with useCallback/useMemo

### Asset Optimization

- Optimize images with next-gen formats
- Use SVG for icons when possible
- Configure Vercel's image optimization

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [GitHub Actions Documentation](https://docs.github.com/en/actions)
3. Check project issues on GitHub
4. Contact support through Vercel dashboard
