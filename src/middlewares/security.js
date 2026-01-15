import helmet from "helmet";
import cors from "cors";

export const configureSecurity = (app) => {
  // Trust proxy
  app.set("trust proxy", 1);

  // Security headers - disable policies that block cross-origin requests
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable for EJS templates
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: false,
    })
  );

  // CORS - allow all origins
  app.use(
    cors({
      origin: true, // Allow all origins
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    })
  );

  // Handle preflight requests
  app.options("*", cors());
};
