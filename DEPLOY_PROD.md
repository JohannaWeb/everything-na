# 100% Free Production Deployment Guide

Deploying this application with Video Calling requires three components. We are going to use **Always Free** tiers so your monthly bill is **$0.00**.

1. **The OpenVidu Server (Video Calls)**: Hosted on **Oracle Cloud Always Free** VPS.
2. **The Backend (Node.js + SQLite)**: Hosted on **Render.com** (Free tier).
3. **The Frontend (React)**: Hosted on **Vercel.com** (Free tier).

---

## Part 1: Prerequisites
- A **Domain Name** (e.g., `yourdomain.com`). This is the *only* thing you might have to pay for (usually $10/year). You absolutely need a domain name to generate valid SSL certificates for browser camera permissions.
- Free accounts on Oracle Cloud, Render.com, and Vercel.

---

## Part 2: Deploying the Video Server (OpenVidu) for FREE

To host a video server for free, **Oracle Cloud** is the best option because their "Always Free" tier gives you a very powerful ARM server (up to 4 CPUs and 24GB RAM) for $0/month. AWS EC2 free tier also works but is much weaker.

### Step 2.1: Spin Up the Free Server
1. Go to [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) and sign up.
2. In the Oracle console, go to **Compute -> Instances** and click **Create Instance**.
3. **Image**: Change image to **Canonical Ubuntu 22.04**.
4. **Shape**: Choose **Ampere (ARM) VM.Standard.A1.Flex** (This is the free powerful one). Allocate 2 CPUs and 12GB RAM to stay well within the free limits.
5. **Networking**: Ensure it assigns a Public IPv4 address.
6. **SSH Keys**: Download the automatically generated SSH Private Key. You will need this to log in!
7. Click **Create** and wait 2 minutes for it to provision. Copy the **Public IP Address**.

### Step 2.2: Configure DNS and Firewall
1. **DNS**: In your Domain Registrar (GoDaddy, Namecheap etc.), add an `A Record`.
   - Host: `video`
   - Value: `[Your Oracle Public IP]`
   *(Your OpenVidu server will live at `video.yourdomain.com`)*
2. **Firewall**: In Oracle Cloud, click on your instance -> Primary VNIC -> Subnet -> Security List.
   - Add Ingress Rules to **open all ports**:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: All Protocols (Or specifically open TCP 22, 80, 443, 4443 and UDP 40000-65535).

### Step 2.3: Install OpenVidu
1. Connect to your server using SSH (replace the key path and IP):
   ```bash
   ssh -i "path\to\your\oracle_key.key" ubuntu@YOUR_ORACLE_IP
   ```
2. Gain root privileges:
   ```bash
   sudo su
   ```
3. Run the OpenVidu install script:
   ```bash
   cd /opt
   curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
   ```
4. Enter the folder and edit the settings:
   ```bash
   cd openvidu
   nano .env
   ```
5. Update these specific fields in `.env`:
   - `DOMAIN_OR_PUBLIC_IP=video.yourdomain.com` 
   - `OPENVIDU_SECRET=MakeUpAHardPassword123`
   - `CERTIFICATE_TYPE=letsencrypt` 
   - `LETSENCRYPT_EMAIL=your-email@example.com`

6. Save (`Ctrl+O`, `Enter`, `Ctrl+X`) and Start the server:
   ```bash
   ./openvidu start
   ```
*Wait 2-3 minutes. You can test it by visiting `https://video.yourdomain.com` in your browser.*

---

## Part 3: Deploying the Backend for FREE

1. Go to **[Render.com](https://render.com)** and sign in with GitHub.
2. Click **New -> Blueprint**.
3. Connect your GitHub repository (`everything-na`).
4. Render will automatically read your `render.yaml` file and configure the backend.
5. In the Render Dashboard for your new `na-app-backend` service, go to **Environment Variables** and update them:
   - `OPENVIDU_URL`: `https://video.yourdomain.com` (Your Oracle server domain)
   - `OPENVIDU_SECRET`: `MakeUpAHardPassword123` (The password you set in Oracle)
   - `JWT_SECRET`: `SomeRandomStringForPasswords`
   - `NODE_ENV`: `production`
6. Copy the URL Render gives you (e.g., `https://na-app-backend.onrender.com`).

---

## Part 4: Deploying the Frontend for FREE

1. Go to **[Vercel.com](https://vercel.com)** and click **Add New -> Project**.
2. Import your GitHub repository (`everything-na`).
3. Set the **Framework Preset** to Vite. Leave the Root Directory as `./`.
4. Open the **Environment Variables** section and add:
   - `VITE_BACKEND_URL`: `https://na-app-backend.onrender.com` (Your Render backend URL)
   - `VITE_BACKEND_WS_URL`: `wss://na-app-backend.onrender.com` (Notice it is `wss://`)
5. Click **Deploy**.

## Final Step
Once Vercel finishes deploying, they will provide a live URL (`https://your-app-name.vercel.app`). 

Go there, create an account, and join a meeting! Your frontend is talking to Render (for chat/auth), and Render is securely brokering the WebRTC video feeds to your free Oracle Cloud OpenVidu server!
