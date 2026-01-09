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

export interface ApiError {
  error: string;
}
