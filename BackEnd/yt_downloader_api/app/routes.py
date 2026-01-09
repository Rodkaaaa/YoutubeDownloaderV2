# app/routes.py
from flask import Blueprint, jsonify, request, send_from_directory
import yt_dlp
import os
import uuid

api_bp = Blueprint("api", __name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOWNLOADS_DIR = os.path.join(PROJECT_ROOT, "downloads")
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

print(f"[INIT] Project root: {PROJECT_ROOT}")
print(f"[INIT] Downloads dir: {DOWNLOADS_DIR}")

@api_bp.get("/health")
def health():
    return jsonify({"status": "ok"})

@api_bp.get("/info")
def get_info():
    """Obtiene información del video y lista todos los formatos disponibles."""
    try:
        url = request.args.get("url")
        if not url:
            return jsonify({
                "error": "Falta parámetro 'url' en query string"
            }), 400
        
        if "youtube.com" not in url and "youtu.be" not in url:
            return jsonify({
                "error": "URL inválida. Solo URLs de YouTube."
            }), 400
        
        print(f"[INFO] Extrayendo info de: {url}")
        
        # Opciones más ligeras para solo extraer info
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'socket_timeout': 30,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"[INFO] Iniciando extract_info...")
            info = ydl.extract_info(url, download=False)
            print(f"[INFO] Info extraída exitosamente")
        
        # Construir respuesta
        video_data = {
            "id": info.get("id"),
            "title": info.get("title"),
            "duration": info.get("duration"),
            "thumbnail": info.get("thumbnail"),
            "formats": []
        }
        
        # Procesar solo formatos válidos
        formats_list = info.get("formats", [])
        print(f"[INFO] Total de formatos: {len(formats_list)}")
        
        for fmt in formats_list:
            try:
                format_info = {
                    "id": fmt.get("format_id"),
                    "ext": fmt.get("ext"),
                    "format": fmt.get("format"),
                    "filesize": fmt.get("filesize"),
                    "height": fmt.get("height"),
                    "width": fmt.get("width"),
                    "fps": fmt.get("fps"),
                    "vcodec": fmt.get("vcodec"),
                    "acodec": fmt.get("acodec"),
                    "abr": fmt.get("abr"),
                    "tbr": fmt.get("tbr"),
                }
                video_data["formats"].append(format_info)
            except Exception as e:
                print(f"[WARNING] Error procesando formato: {e}")
                continue
        
        print(f"[INFO] Respondiendo con {len(video_data['formats'])} formatos")
        return jsonify(video_data), 200
    
    except Exception as e:
        print(f"[ERROR en /info] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api_bp.post("/download")
def download():
    """Descarga un video de YouTube con un formato específico."""
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({
                "error": "Falta parámetro 'url' en el JSON"
            }), 400
        
        url = data["url"]
        format_id = data.get("format_id", "best")
        
        if "youtube.com" not in url and "youtu.be" not in url:
            return jsonify({
                "error": "URL inválida. Solo URLs de YouTube."
            }), 400
        
        unique_id = str(uuid.uuid4())[:8]
        output_template = os.path.join(DOWNLOADS_DIR, f"{unique_id}.%(ext)s")
        
        print(f"[DOWNLOAD] Descargando formato: {format_id}")
        print(f"[DOWNLOAD] Output template: {output_template}")
        
        ydl_opts = {
            'format': format_id,
            'outtmpl': output_template,
            'quiet': False,
            'no_warnings': False,
            'restrictfilenames': True,
        }
        
        # Descargar
        filename = None
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
        
        print(f"[DOWNLOAD] Archivo descargado: {filename}")
        print(f"[DOWNLOAD] Existe: {os.path.exists(filename)}")
        
        if not os.path.exists(filename):
            print(f"[ERROR] No encontrado en: {filename}")
            return jsonify({
                "error": f"Archivo no encontrado: {filename}"
            }), 500
        
        # Obtener solo el nombre del archivo
        basename = os.path.basename(filename)
        
        print(f"[DOWNLOAD] Enviando: {basename}")
        
        # Usar send_from_directory
        return send_from_directory(
            DOWNLOADS_DIR,
            basename,
            as_attachment=True
        )
    
    except Exception as e:
        print(f"[ERROR en /download] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
