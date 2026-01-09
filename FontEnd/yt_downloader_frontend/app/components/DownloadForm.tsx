"use client";

import { useState } from "react";
import Image from "next/image";
import { getVideoInfo, downloadVideo, type VideoInfo, type Format } from "../lib/api";

export default function DownloadForm() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError("Por favor ingresa una URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
      setSelectedFormat("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat || !videoInfo) {
      setError("Por favor selecciona un formato");
      return;
    }

    setError("");
    setDownloading(true);

    try {
      const blob = await downloadVideo(url, selectedFormat);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      setSuccess("¡Video descargado exitosamente!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la descarga");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-800">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Descarga videos de YouTube
        </h2>

        <div className="space-y-4 mb-6">
          <label htmlFor="url" className="block text-sm font-semibold text-gray-300">
            URL del video:
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGetInfo()}
              className="flex-1 px-4 py-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGetInfo}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Cargando..." : "Obtener Formatos"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {videoInfo && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                {videoInfo.title}
              </h3>
              {videoInfo.thumbnail && (
                <Image
                  src={videoInfo.thumbnail}
                  alt="thumbnail"
                  width={400}
                  height={225}
                  className="w-full max-w-sm rounded-lg shadow-md mb-4"
                />
              )}
              <p className="text-gray-300 mb-2">
                <strong>Duración:</strong> {Math.floor(videoInfo.duration / 60)} minutos
              </p>
              <p className="text-gray-300">
                <strong>Total de formatos:</strong> {videoInfo.formats.length}
              </p>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-semibold text-gray-300 mb-2">
                Selecciona el formato:
              </label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecciona un formato --</option>
                {videoInfo.formats.map((fmt: Format) => (
                  <option key={fmt.id} value={fmt.id}>
                    {fmt.ext.toUpperCase()} - {fmt.format || `Formato ${fmt.id}`}
                    {fmt.height ? ` (${fmt.height}p)` : ""}
                    {fmt.filesize ? ` - ${(fmt.filesize / 1024 / 1024).toFixed(1)}MB` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownload}
              disabled={!selectedFormat || downloading}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {downloading ? "Descargando..." : "Descargar Video"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
