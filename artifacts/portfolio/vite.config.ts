import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "node:fs/promises";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const DEFAULT_PORT = 21113;
const DEFAULT_BASE_PATH = "/";

function normalizeBasePath(rawBasePath?: string) {
  if (!rawBasePath) return DEFAULT_BASE_PATH;
  const withLeadingSlash = rawBasePath.startsWith("/")
    ? rawBasePath
    : `/${rawBasePath}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function resolvePort(rawPort?: string) {
  if (!rawPort) return DEFAULT_PORT;
  const parsedPort = Number(rawPort);
  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }
  return parsedPort;
}

function readRequestBody(request: import("node:http").IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function jsonResponse(
  response: import("node:http").ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function textResponse(
  response: import("node:http").ServerResponse,
  statusCode: number,
  message: string,
) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "text/plain");
  response.end(message);
}

function galleryManagerPlugin() {
  const publicDir = path.resolve(import.meta.dirname, "public");
  const uploadsDir = path.join(publicDir, "uploads");
  const contentJsonPath = path.join(publicDir, "portfolio-content.json");
  const imageTypes: Record<string, string> = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp",
  };

  return {
    name: "portfolio-content-manager",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestPath = request.url
          ? new URL(request.url, "http://localhost").pathname
          : "";

        if (requestPath === "/__portfolio-manager/content") {
          if (request.method !== "POST") {
            textResponse(response, 405, "Method not allowed");
            return;
          }

          try {
            const rawBody = await readRequestBody(request);
            const content = JSON.parse(rawBody);

            if (!content || typeof content !== "object" || Array.isArray(content)) {
              textResponse(response, 400, "Content payload must be an object");
              return;
            }

            await fs.writeFile(
              contentJsonPath,
              `${JSON.stringify(content, null, 2)}\n`,
              "utf8",
            );
            jsonResponse(response, 200, { ok: true });
          } catch (error) {
            textResponse(response, 500, "Could not save portfolio-content.json");
          }
          return;
        }

        if (requestPath === "/__portfolio-manager/asset") {
          if (request.method !== "POST") {
            textResponse(response, 405, "Method not allowed");
            return;
          }

          try {
            const rawBody = await readRequestBody(request);
            const payload = JSON.parse(rawBody) as {
              filename?: string;
              dataUrl?: string;
            };
            const match =
              payload.dataUrl?.match(
                /^data:(image\/(?:gif|jpeg|png|svg\+xml|webp));base64,(.+)$/,
              ) ?? null;

            if (!match) {
              textResponse(response, 400, "Invalid image upload");
              return;
            }

            const mimeType = match[1];
            const extension = imageTypes[mimeType];
            const baseName =
              payload.filename
                ?.replace(/\.[^.]+$/, "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") || "portfolio-image";
            const filename = `${baseName}-${Date.now()}.${extension}`;
            const targetPath = path.join(uploadsDir, filename);
            const resolvedTargetPath = path.resolve(targetPath);
            const resolvedUploadsDir = path.resolve(uploadsDir);

            if (!resolvedTargetPath.startsWith(resolvedUploadsDir)) {
              textResponse(response, 400, "Invalid image path");
              return;
            }

            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(
              resolvedTargetPath,
              Buffer.from(match[2], "base64"),
            );
            jsonResponse(response, 200, { src: `/uploads/${filename}` });
          } catch (error) {
            textResponse(response, 500, "Could not upload image");
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(async () => {
  const port = resolvePort(process.env.PORT);
  const basePath = normalizeBasePath(process.env.BASE_PATH);

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      galleryManagerPlugin(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, ".."),
              }),
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets",
        ),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
