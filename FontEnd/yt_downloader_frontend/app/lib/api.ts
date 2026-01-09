const API_BASE_URL = "http://localhost:5000/api";

export interface Format {
  id: string;
  ext: string;
  format: string;
  filesize: number | null;
  height: number | null;
  width: number | null;
  fps: number | null;
  vcodec: string;
  acodec: string;
  abr: number | null;
  tbr: number | null;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  formats: Format[];
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const response = await fetch(
    `${API_BASE_URL}/info?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    const error = await response.json();
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
    const error = await response.json();
    throw new Error(error.error || "Error al descargar el video");
  }

  return response.blob();
}
