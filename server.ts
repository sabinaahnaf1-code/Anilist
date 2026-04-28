import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/trailer", async (req, res) => {
    const title = req.query.title as string;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const { searchYouTubeTrailer, findGeminiTrailerId } = await import("./src/services/trailerService.ts");
      
      let videoId = await searchYouTubeTrailer(title);
      
      if (!videoId) {
        videoId = await findGeminiTrailerId(title);
      }

      res.json({ videoId });
    } catch (error) {
      console.error("Trailer search failed:", error);
      res.status(500).json({ error: "Failed to search for trailer" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mode");
  } else {
    // Serving built static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // SPA Fallback: handle refreshes on non-root routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production server mode");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
