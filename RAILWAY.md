# Railway setup

Create a MongoDB service in the same Railway project as the Kingred Bot panel. In the panel service's Variables page, add a reference variable named `MONGO_URL` with the value `${{Mongo.MONGO_URL}}`, replacing `Mongo` with the exact name of the MongoDB service if it differs. The application also accepts `MONGO_PUBLIC_URL` or `MONGODB_URI` when the database is outside the Railway project, but the private `MONGO_URL` reference is preferred for services in the same project.

Add the following optional values to the panel service:

```env
MONGODB_DATABASE=kingred
MONGODB_SERVERS_COLLECTION=servers
```

The same MongoDB service is also used for Kingred token records and Baileys authentication state. The bot stores the token, protected phone number, credentials, and signal keys under the bot's stable token namespace in MongoDB, so replacing the Railway container no longer requires WhatsApp pairing again. Set a stable `SESSION_SECRET` (and optionally `KINGRED_TOKEN_SECRET`); changing these secrets makes previously encrypted token records unreadable.

After deploying this version, pair each existing bot once more. That first
connection migrates its live Baileys credentials into MongoDB. Later Railway
redeploys restore those credentials automatically. Do not delete the
`BaileysAuth` collection or change the bot token identity.

After saving the variables, redeploy the panel service. The `/admin` server registry will then save server name, hub URL, bot ID, bot key, public URL, active state, and creation time in the Railway MongoDB service.

The webhook hub URL is not the MongoDB URL. Each actual bot deployment still uses `KINGRED_HUB_URL`, `KINGRED_BOT_ID`, `KINGRED_BOT_KEY`, and `KINGRED_PUBLIC_URL` for event delivery and pairing.

## Administrator access

Add this variable to the Kingred Bot panel service in Railway:

```env
KINGRED_ADMIN_PASSCODE=replace-with-a-long-random-passcode
```

The passcode is checked only on the server and is never sent to the browser. After a successful passcode login, the browser receives the normal signed session cookie and can open `/admin`, add or remove bot servers, or read the users-and-bots overview. Use a long random value and keep it private.

## Automatic bot registration from the Webhook Hub

To register each bot only once in the Webhook Hub and have it appear automatically in this panel, add these variables to the Webhook Hub service:

```env
KINGRED_PANEL_URL=https://your-kingred-panel.up.railway.app
KINGRED_PANEL_SYNC_SECRET=one-long-random-secret
KINGRED_HUB_URL=https://your-webhook-hub.up.railway.app
```

Add the same sync secret to the kingred panel service:

```env
KINGRED_PANEL_SYNC_SECRET=one-long-random-secret
```

After both services are redeployed, every new or updated Webhook Hub registration is upserted into the panel by Bot ID. The panel’s `/admin` page no longer needs a duplicate manual server entry for synchronized bots.
