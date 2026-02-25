# Deploy to Vercel - Step by Step

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Navigate to Your Project

```bash
cd "New folder (3)/json-echo-server"
```

## Step 3: Deploy

```bash
vercel
```

### What Will Happen:

1. Vercel CLI will ask you to login (opens browser)
2. Login with GitHub, GitLab, or Email
3. Answer the prompts:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Your account
   - **Link to existing project?** → No
   - **Project name?** → Press Enter (or type custom name)
   - **Directory?** → Press Enter (current directory)
   - **Override settings?** → No

4. Vercel will deploy and give you URLs:
   - **Preview URL**: `https://json-echo-server-abc123.vercel.app`
   - **Production URL**: `https://json-echo-server.vercel.app`

## Step 4: Test Your Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/health

# Test echo endpoint
curl -X POST https://your-app.vercel.app/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from Vercel!"}'
```

## Your Endpoints

After deployment, you'll have:

- **Health Check**: `https://your-app.vercel.app/health`
- **Echo API**: `https://your-app.vercel.app/echo`

## Deploy Updates

To deploy changes later:

```bash
vercel --prod
```

## View Deployment

```bash
vercel ls
```

## Important Notes

- Vercel serverless functions have a 4.5MB request limit (not 15MB)
- Free tier includes:
  - 100 GB bandwidth/month
  - Unlimited requests
  - Automatic HTTPS
  - Global CDN
- Your URL is permanent and works 24/7

## Troubleshooting

If deployment fails:

1. Make sure you're in the correct directory
2. Check that `api/echo.js` and `api/health.js` exist
3. Run `vercel --debug` for detailed logs

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Click "Deploy"

This auto-deploys on every git push!
