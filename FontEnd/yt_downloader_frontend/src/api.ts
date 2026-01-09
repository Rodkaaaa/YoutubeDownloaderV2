import type { VideoInfo, ApiError } from "./types";

const API_BASE_URL = "http://localhost:5000/api";

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const response = await fetch(
    `${API_BASE_URL}/info?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Error al obtener información del video");
  }

  return response.json();
}

export async function downloadVideo(
  url: string,
  formatId: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      format_id: formatId,
    }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Error al descargar el video");
  }

  return response.blob();
}
