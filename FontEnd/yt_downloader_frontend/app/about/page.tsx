import Image from "next/image";

export default function About() {
  return (
    <main className="bg-slate-950 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-800">
          <div className="text-center mb-8">
            <Image
              src="https://github.com/Rodkaaaa.png"
              alt="Frederick Cid"
              width={128}
              height={128}
              className="rounded-full mx-auto shadow-lg mb-4"
            />
            <h2 className="text-3xl font-bold text-blue-400">Frederick Cid</h2>
            <p className="text-gray-400 text-lg mt-2">Programador Full Stack</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Sobre mí</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Soy un desarrollador apasionado por crear aplicaciones web modernas y funcionales.
              Me especializo en desarrollo full stack con experiencia en múltiples tecnologías.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-900 rounded-lg p-4 border border-blue-800">
              <h4 className="font-bold text-blue-400 mb-2">Backend</h4>
              <p className="text-gray-300 text-sm">Java, JavaScript, Python, C#</p>
            </div>
            <div className="bg-purple-900 rounded-lg p-4 border border-purple-800">
              <h4 className="font-bold text-purple-400 mb-2">Frontend</h4>
              <p className="text-gray-300 text-sm">HTML5, CSS3, TypeScript, Next.js, Blazor</p>
            </div>
            <div className="bg-pink-900 rounded-lg p-4 border border-pink-800">
              <h4 className="font-bold text-pink-400 mb-2">Base de Datos</h4>
              <p className="text-gray-300 text-sm">SQL, NoSQL, MongoDB</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/Rodkaaaa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition border border-slate-700"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/fcidg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
