import DownloadForm from "./components/DownloadForm";

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <DownloadForm />
      </div>
    </main>
  );
}
