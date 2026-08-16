// ImgBB integration. Admin uploads are streamed through to ImgBB and the
// returned URL is what we store — the API never keeps image binaries.
// Without an ImgBB key the upload endpoint returns a clear error instead of
// crashing.

import { env } from "./env";
import { AppError } from "./errors";

export interface ImgbbResponse {
  url: string;
  thumbUrl: string;
  deleteUrl: string;
}

export async function uploadToImgbb(buffer: Buffer, filename: string, mime: string): Promise<ImgbbResponse> {
  if (!env.imgbbApiKey) {
    throw new AppError(503, "imgbb_not_configured", "Image upload is not configured on the server");
  }

  const form = new FormData();
  form.append("key", env.imgbbApiKey);
  form.append("image", new Blob([buffer], { type: mime }), filename);
  form.append("name", filename.slice(0, 60));

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(30000)
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AppError(502, "imgbb_failed", `ImgBB rejected the upload (${res.status}): ${body.slice(0, 160)}`);
  }

  const json = (await res.json()) as {
    success: boolean;
    data?: { url: string; thumb?: { url: string }; delete_url?: string };
  };
  if (!json.success || !json.data) {
    throw new AppError(502, "imgbb_failed", "ImgBB returned an unexpected response");
  }

  return {
    url: json.data.url,
    thumbUrl: json.data.thumb?.url ?? json.data.url,
    deleteUrl: json.data.delete_url ?? ""
  };
}
