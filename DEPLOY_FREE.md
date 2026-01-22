# Free Deployment Instructions for NA App

## What You Need
- GitHub account
- The code pushed to GitHub
- Email for sign-up

---

## Step 1: Push Code to GitHub

```bash
cd c:\Users\joaop\everything-na\na-app-react
git init
git add .
git commit -m "Initial commit - NA App with meetings"
git remote add origin https://github.com/YOUR_USERNAME/na-app.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Render.com (FREE)

1. Go to **https://render.com** and sign up (use GitHub)

2. Click **"New"** → **"Web Service"**

3. Connect your GitHub repo: `na-app`

4. Configure:
   - **Name**: `na-app-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier

5. Add Environment Variables:
   - `JWT_SECRET` = `your-random-secret-key-here`
   - `NODE_ENV` = `production`

6. Click **"Create Web Service"**

7. Wait for build (~5 minutes)

8. **Copy your backend URL**: `https://na-app-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel (FREE)

1. Go to **https://vercel.com** and sign up (use GitHub)

2. Click **"Add New"** → **"Project"**

3. Import your `na-app` repository

4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is, NOT backend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_BACKEND_URL` = `https://na-app-backend.onrender.com`
   - `VITE_BACKEND_WS_URL` = `wss://na-app-backend.onrender.com`

6. Click **"Deploy"**

7. Wait for build (~2 minutes)

8. **Your app is live!** Get your URL: `https://na-app.vercel.app`

---

## Step 4: Update Frontend with Backend URL

After Render gives you the backend URL, update `.env.production`:

```
VITE_BACKEND_URL=https://YOUR-BACKEND.onrender.com
VITE_BACKEND_WS_URL=wss://YOUR-BACKEND.onrender.com
```

Then redeploy on Vercel.

---

## Important Notes

### Free Tier Limitations

**Render.com Free:**
- Server sleeps after 15 min inactivity
- First request wakes it up (30s delay)
- 750 hours/month (plenty for testing)

**Vercel Free:**
- Unlimited for hobby projects
- Fast CDN worldwide

### Video Calls
- Video calls require OpenVidu server (not free)
- Text chat and sharing queue work without OpenVidu
- Consider adding video later with paid hosting

### Database
- SQLite included and persists on Render
- Good for small/medium scale
- For larger scale, migrate to PostgreSQL

---

## Testing Your Deployment

1. Visit: `https://your-app.vercel.app`
2. Click Register
3. Create an account
4. Log in
5. Navigate to Meetings
6. Try text chat

---

## Quick Commands Summary

```bash
# Build frontend
npm run build

# Run backend locally
cd backend
npm start

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Update"
git push
```

---

## Troubleshooting

**"Failed to fetch" error:**
- Backend URL wrong in environment variables
- Wait 30s for Render server to wake up
- Check browser console for actual error

**"Unauthorized" error:**
- JWT_SECRET mismatch between frontend expectations
- Token expired

**Video calls not working:**
- Expected without OpenVidu server
- Text chat should still work

---

Done! Your NA app is now live and free! 🎉
