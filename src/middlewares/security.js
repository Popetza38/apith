import helmet from "helmet";
import cors from "cors";

export const configureSecurity = (app) => {
  // Trust proxy
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable for EJS templates
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS - Allow all origins for API access
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
      exposedHeaders: ["Content-Length", "Content-Type"],
      credentials: false, // Set to false when using origin: "*"
      maxAge: 86400, // Cache preflight for 24 hours
    })
  );

  // Handle preflight OPTIONS requests explicitly
  app.options("*", cors());
};
