# Production Deployment Guide (including OpenVidu)

Deploying the whole application to production requires three main components:
1. **The Frontend (React + Vite)**: Hosted on Vercel or Netlify (Free).
2. **The Backend (Node.js + Express + SQLite)**: Hosted on Render, Railway, or Fly.io.
3. **The OpenVidu Server (Video Calls)**: Hosted on a Dedicated Virtual Private Server (VPS) like DigitalOcean, Linode, AWS EC2, or Vultr. *This cannot be hosted on free serverless platforms because of WebRTC port requirements.*

---

## Part 1: Prerequisites
- A **Domain Name** (e.g., `yourdomain.com`). This is absolutely required because WebRTC (video calling) strictly requires valid HTTPS/SSL certificates to access cameras in modern browsers.
- A **VPS provider account** (e.g., DigitalOcean). You will need a server with at least 2 CPUs and 4GB of RAM (typically starts around $10-$12/month).
- Accounts on **Vercel** and **Render** (as used in `DEPLOY_FREE.md`).

---

## Part 2: Deploying the OpenVidu Server

This is the most critical part for video to work.

### Step 2.1: Setup the VPS & DNS
1. Spin up an Ubuntu 20.04 or Ubuntu 22.04 LTS server on your VPS provider.
2. In your Domain Registrar (like GoDaddy, Namecheap, Route53), create an `A Record` to point a sub-domain (e.g., `video.yourdomain.com`) to the IP address of your new VPS server.

### Step 2.2: Install OpenVidu
1. SSH into your new VPS:
   ```bash
   ssh root@your_server_ip
   ```
2. Gain root privileges:
   ```bash
   sudo su
   ```
3. Run the official OpenVidu install script:
   ```bash
   cd /opt
   curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
   ```

### Step 2.3: Configure OpenVidu
1. Go into the installation directory:
   ```bash
   cd openvidu
   ```
2. Edit the `.env` settings file:
   ```bash
   nano .env
   ```
3. Update the following fields in the `.env` file:
   - `DOMAIN_OR_PUBLIC_IP=video.yourdomain.com` (Your actual sub-domain)
   - `OPENVIDU_SECRET=CreateAStrongPasswordHere`
   - `CERTIFICATE_TYPE=letsencrypt` (This generates a free valid SSL certificate)
   - `LETSENCRYPT_EMAIL=your-email@example.com`

4. Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).
5. Start the OpenVidu server:
   ```bash
   ./openvidu start
   ```

OpenVidu is now running! You can verify it by visiting `https://video.yourdomain.com` in your browser.

---

## Part 3: Deploying the Backend (Render)

We will use Render.com, similar to the free deployment, but point it to your new OpenVidu server.

1. Go to **Render.com** and create a New Web Service connected to your GitHub repo.
2. Set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `GenerateARandomStringForPasswords`
   - `OPENVIDU_URL` = `https://video.yourdomain.com` (The exact domain of your VPS from Part 2).
   - `OPENVIDU_SECRET` = `CreateAStrongPasswordHere` (The exact password from Part 2).

6. Click Deploy and copy the Render URL (e.g., `https://na-app-backend.onrender.com`).

---

## Part 4: Deploying the Frontend (Vercel)

1. Go to **Vercel.com** and create a New Project connected to your GitHub repo.
2. Keep the root directory as the root (`./`) so Vercel builds the React app.
3. Configure the **Environment Variables**:
   - `VITE_BACKEND_URL` = `https://na-app-backend.onrender.com` (Your Render URL)
   - `VITE_BACKEND_WS_URL` = `wss://na-app-backend.onrender.com` (Notice: `wss://`)

4. Click Deploy.

### Finishing Up
Once Vercel finishes deploying, visit your Vercel frontend URL. You can now log in, join meeting rooms, and turn on your camera! Because everything is running over valid HTTPS certificates, modern browsers will correctly prompt users for camera permissions, and the Node.js backend will seamlessly broker connections to your dedicated OpenVidu VPS.
