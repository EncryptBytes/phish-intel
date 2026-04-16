import { useState } from "react";
import { analyseSubmission } from "../api/client";
import ResultCard from "../components/ResultCard";

export default function SubmitPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    const fd = new FormData();
    if (mode === "text") fd.append("input_text", text);
    else if (mode === "url") fd.append("input_url", url);
    else if (mode === "screenshot" && file) fd.append("file", file);
    try {
      const res = await analyseSubmission(fd);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Analysis failed. Is Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Submit a Phishing Sample</h1>
      <p className="text-slate-400 mb-8">Upload a screenshot, paste a URL, or paste the raw email/SMS text.</p>

      <div className="flex gap-3 mb-6">
        {["text","url","screenshot"].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${mode===m ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
            {m === "text" ? "Paste Text" : m === "url" ? "Paste URL" : "Upload Screenshot"}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
        {mode === "text" && (
          <textarea value={text} onChange={e => setText(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 rounded-lg p-4 min-h-40 text-sm border border-slate-700 focus:outline-none focus:border-blue-500"
            placeholder="Paste the email or SMS body here..." />
        )}
        {mode === "url" && (
          <input value={url} onChange={e => setUrl(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 rounded-lg p-4 text-sm border border-slate-700 focus:outline-none focus:border-blue-500"
            placeholder="https://suspicious-link.com/verify" />
        )}
        {mode === "screenshot" && (
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
            className="text-slate-300 text-sm" />
        )}
      </div>

      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

      <button onClick={submit} disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium">
        {loading ? "Analysing with Ollama..." : "Analyse Sample"}
      </button>

      {result && <div className="mt-10"><ResultCard result={result} /></div>}
    </div>
  );
}