import { v4 as uuid } from "uuid";
import express from "express";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { dataRouter } from "./routes/data.js";
import { categoriesRouter } from "./routes/categories.js";
//import rateLimit from "express-rate-limit";

/**
 * Initializes the application middlewares.
 *
 * @param {Express} app Express application
 */
function init(app) {
  app.use(compression());
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  /*app.set("trust proxy", 1); // see https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  // basic protection against DDOS or brute force attacks
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
  });
  app.use(limiter);*/

  app.use("/api", authRouter);
  app.use("/api", dataRouter);
  app.use("/api", categoriesRouter);

  // sets the correlation id of any incoming requests
  app.use((req, res, next) => {
    req.correlationId = req.get("X-Request-ID") || uuid();
    res.set("X-Request-ID", req.id);
    next();
  });
}

/**
 * Installs fallback error handlers.
 *
 * @param app Express application
 * @returns {void}
 */
function fallbacks(app) {
  /* eslint-disable-next-line no-unused-vars */
  app.use((err, req, res, next) => {
    const errmsg = err.message;
    console.error(
      `💥 Unexpected error occurred while calling ${req.path}: ${errmsg}`
    );
    res.status(err.status || 500);
    res.json({ error: err.message || "Internal server error" });
  });

  /* eslint-disable no-unused-vars */
  app.use((req, res, next) => {
    console.error(`💥 Route not found to ${req.path}`);
    res.status(404);
    res.json({ error: "Not found" });
  });
}

function createApp() {
  const app = express();
  init(app);
  fallbacks(app);
  return app;
}

export { createApp };
