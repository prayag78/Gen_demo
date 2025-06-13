'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [latex, setLatex] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleCompile = async () => {
    setLoading(true);
    setPdfUrl(null);

    try {
      const res = await fetch(`${backendUrl}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex }),
      });

      if (!res.ok) throw new Error('Compilation failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (pdfUrl) window.open(pdfUrl, '_blank');
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'resume.pdf';
      a.click();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 shadow-xl border border-white/20 rounded-2xl p-8 w-full max-w-4xl transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-white dark:text-white text-center mb-4 tracking-tight">
          LaTeX → PDF Compiler
        </h1>
        <p className="text-white/90 text-center mb-8 text-lg">
          Paste your LaTeX code below and generate a clean PDF.
        </p>

        <textarea
          className="w-full h-72 rounded-xl p-4 bg-white/70 text-gray-800 font-mono shadow-inner border border-white/20 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
          placeholder="Paste your LaTeX code here..."
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
        />

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handleCompile}
            disabled={loading}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Compiling...' : 'Compile to PDF'}
          </Button>

          {pdfUrl && (
            <>
              <button
                onClick={handlePreview}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200"
              >
                Preview PDF
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-white text-green-600 font-semibold rounded-full shadow-md hover:bg-green-100 transition duration-200"
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
