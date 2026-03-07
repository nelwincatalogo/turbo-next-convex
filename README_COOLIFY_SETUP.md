# Coolify setup

1. Create Application -> choose your repo/branch
2. Build pack: Docker Compose
3. Compose file path: `docker-compose.coolify.yml`
4. Add env var in Coolify:
   - `NEXT_PUBLIC_CONVEX_URL=https://<your-convex-prod>.convex.cloud`
5. Configure domains per service:
   - `web service -> app.yourdomain.com port 3000`
   - `admin service -> admin.yourdomain.com port 3000`
