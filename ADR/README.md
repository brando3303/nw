Copyright 2025 (c) Brandon C Bailey

ADR was migrated into nw-backend for native cron execution.

Current sync implementation lives in:
- nw-backend/adr/NotionHelper.js
- nw-backend/adr/syncPlayers.js

Current cron endpoint lives in:
- nw-backend/api/cron/endpoints.js