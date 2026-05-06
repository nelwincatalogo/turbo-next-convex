# Coolify setup

1. Create Application -> choose your repo/branch
2. Build pack: Docker Compose
3. Compose file path: `docker-compose.coolify.yml`
4. Add env vars in Coolify:
   - `NEXT_PUBLIC_CONVEX_URL=https://<your-convex-prod>.convex.cloud`
   - `NEXT_PUBLIC_SITE_URL=https://app.yourdomain.com`
5. Configure domain:
   - `web service -> app.yourdomain.com port 3000`
