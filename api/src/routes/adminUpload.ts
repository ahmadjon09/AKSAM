// Image upload endpoint: multipart file -> ImgBB -> returned URL stored in
// the database by the product/category save flow. Limits: 8 MB, image mimes
// only, stricter rate limit.

import type { FastifyInstance } from "fastify";
import { pipeline } from "stream/promises";
import { uploadToImgbb } from "../lib/imgbb";
import { badRequest } from "../lib/errors";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export default async function adminUploadRoutes(app: FastifyInstance) {
  app.post(
    "/v1/admin/upload",
    {
      preHandler: [
        app.rateLimit({ bucket: "upload", limit: 30, windowSeconds: 3600, byToken: true }),
        app.authenticate
      ]
    },
    async (request, reply) => {
      const file = await request.file();
      if (!file) throw badRequest("No file provided");
      if (!ALLOWED_MIME.has(file.mimetype)) throw badRequest("Unsupported file type");
      if (file.file.truncated || file.file.bytesRead > MAX_BYTES) throw badRequest("File is too large (max 8 MB)");

      const chunks: Buffer[] = [];
      await pipeline(file.file, async function* (source: AsyncIterable<Buffer>) {
        for await (const chunk of source) chunks.push(chunk);
      });

      const buffer = Buffer.concat(chunks);
      if (buffer.length > MAX_BYTES) throw badRequest("File is too large (max 8 MB)");

      const result = await uploadToImgbb(buffer, file.filename, file.mimetype);
      return reply.send(result);
    }
  );
}
