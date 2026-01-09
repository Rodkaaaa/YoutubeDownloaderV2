import "./style.css";
import type { VideoInfo } from "./types";
import { getVideoInfo, downloadVideo } from "./api";

class YouTubeDownloader {
  private urlInput: HTMLInputElement;
  private getInfoBtn: HTMLButtonElement;
  private errorDiv: HTMLDivElement;
  private videoInfoDiv: HTMLDivElement;
  private formatSelect: HTMLSelectElement;
  private downloadBtn: HTMLButtonElement;
  private loadingSpan: HTMLSpanElement;
  private successDiv: HTMLDivElement;

  private currentVideoInfo: VideoInfo | null = null;

  constructor() {
    this.urlInput = document.getElementById("url") as HTMLInputElement;
    this.getInfoBtn = document.getElementById("getInfoBtn") as HTMLButtonElement;
    this.errorDiv = document.getElementById("error") as HTMLDivElement;
    this.videoInfoDiv = document.getElementById("videoInfo") as HTMLDivElement;
    this.formatSelect = document.getElementById("format") as HTMLSelectElement;
    this.downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement;
    this.loadingSpan = document.getElementById("loading") as HTMLSpanElement;
    this.successDiv = document.getElementById("success") as HTMLDivElement;

    this.attachEventListeners();
    this.setupNavigation();
  }

  private setupNavigation(): void {
    const downloadLink = document.getElementById("downloadLink");
    const aboutLink = document.getElementById("aboutLink");
    const downloadSection = document.getElementById("downloadSection");
    const aboutSection = document.getElementById("aboutSection");

    downloadLink?.addEventListener("click", (e) => {
      e.preventDefault();
      downloadSection?.classList.remove("hidden");
      aboutSection?.classList.add("hidden");
      downloadLink?.classList.add("border-b-2", "border-blue-600");
      aboutLink?.classList.remove("border-b-2", "border-blue-600");
    });

    aboutLink?.addEventListener("click", (e) => {
      e.preventDefault();
      aboutSection?.classList.remove("hidden");
      downloadSection?.classList.add("hidden");
      aboutLink?.classList.add("border-b-2", "border-blue-600");
      downloadLink?.classList.remove("border-b-2", "border-blue-600");
    });
  }

  private attachEventListeners(): void {
    this.getInfoBtn.addEventListener("click", () => this.handleGetInfo());
    this.formatSelect.addEventListener("change", () => this.updateDownloadBtn());
    this.downloadBtn.addEventListener("click", () => this.handleDownload());

    this.urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleGetInfo();
      }
    });
  }

  private clearError(): void {
    this.errorDiv.textContent = "";
    this.errorDiv.classList.add("hidden");
  }

  private showError(message: string): void {
    this.errorDiv.textContent = message;
    this.errorDiv.classList.remove("hidden");
  }

  private async handleGetInfo(): Promise<void> {
    const url = this.urlInput.value.trim();

    if (!url) {
      this.showError("Por favor ingresa una URL de YouTube");
      return;
    }

    this.clearError();
    this.getInfoBtn.disabled = true;
    this.loadingSpan.textContent = "Cargando...";

    try {
      const videoInfo = await getVideoInfo(url);
      this.currentVideoInfo = videoInfo;
      this.displayVideoInfo(videoInfo);
    } catch (error) {
      this.showError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      this.getInfoBtn.disabled = false;
      this.loadingSpan.textContent = "";
    }
  }

  private displayVideoInfo(videoInfo: VideoInfo): void {
    this.formatSelect.innerHTML = '<option value="">-- Selecciona un formato --</option>';

    videoInfo.formats.forEach((fmt) => {
      const option = document.createElement("option");
      option.value = fmt.id;

      let label = `${fmt.ext.toUpperCase()}`;
      if (fmt.format) label += ` - ${fmt.format}`;
      if (fmt.height) label += ` (${fmt.height}p)`;
      if (fmt.filesize) {
        const sizeMB = (fmt.filesize / 1024 / 1024).toFixed(1);
        label += ` - ${sizeMB}MB`;
      }

      option.textContent = label;
      this.formatSelect.appendChild(option);
    });

    const duration = Math.floor(videoInfo.duration / 60);
    const thumbnail = videoInfo.thumbnail
      ? `<img src="${videoInfo.thumbnail}" alt="thumbnail" class="w-full max-w-sm rounded-lg shadow-md mb-4">`
      : "";

    this.videoInfoDiv.innerHTML = `
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">${this.escapeHtml(videoInfo.title)}</h2>
        ${thumbnail}
        <p class="text-gray-600 mb-2"><strong>Duración:</strong> ${duration} minutos</p>
        <p class="text-gray-600"><strong>Total de formatos:</strong> ${videoInfo.formats.length}</p>
      </div>
    `;

    this.videoInfoDiv.classList.remove("hidden");
    this.updateDownloadBtn();
  }

  private updateDownloadBtn(): void {
    const hasFormat = this.formatSelect.value !== "";
    this.downloadBtn.disabled = !hasFormat;
  }

  private async handleDownload(): Promise<void> {
    if (!this.currentVideoInfo || !this.formatSelect.value) {
      this.showError("Por favor selecciona un formato");
      return;
    }

    this.clearError();
    this.downloadBtn.disabled = true;
    this.loadingSpan.textContent = "Descargando...";

    try {
      const blob = await downloadVideo(
        this.urlInput.value.trim(),
        this.formatSelect.value
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video_${Date.now()}.${this.getFileExtension()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.showSuccess("¡Video descargado exitosamente!");
    } catch (error) {
      this.showError(
        error instanceof Error ? error.message : "Error en la descarga"
      );
    } finally {
      this.downloadBtn.disabled = false;
      this.loadingSpan.textContent = "";
    }
  }

  private showSuccess(message: string): void {
    this.successDiv.textContent = message;
    this.successDiv.classList.remove("hidden");
    setTimeout(() => {
      this.successDiv.classList.add("hidden");
    }, 3000);
  }

  private getFileExtension(): string {
    const selectedOption = this.formatSelect.selectedOptions[0];
    const format = selectedOption?.textContent || "mp4";
    const ext = format.match(/([a-z0-9]+)\s/i)?.[1] || "mp4";
    return ext.toLowerCase();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new YouTubeDownloader();
  console.log("YouTube Downloader iniciado");
});
