import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp();

// Apply global session middleware to all routes
app.use('*');

showRoutes(app);

export default app;
