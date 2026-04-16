const riskColour = { Low:"bg-green-900 text-green-300", Medium:"bg-yellow-900 text-yellow-300", High:"bg-orange-900 text-orange-300", Critical:"bg-red-900 text-red-300" };
const sophColour = { Low:"text-green-400", Medium:"text-yellow-400", High:"text-orange-400","Very High":"text-red-400" };

export default function ResultCard({ result }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{result.attack_type}</h2>
          <p className="text-slate-400">{result.subtype}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskColour[result.risk_level] || "bg-slate-700 text-slate-300"}`}>
          {result.risk_level} Risk
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[["Channel", result.channel], ["Sophistication", result.sophistication], ["Era", result.era]].map(([k,v]) => (
          <div key={k} className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">{k}</p>
            <p className={`font-medium ${k==="Sophistication" ? sophColour[v] : "text-slate-100"}`}>{v}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-slate-400 text-sm mb-2">Technique</h3>
        <p className="text-slate-200 text-sm leading-relaxed">{result.technique_description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-slate-400 text-sm mb-2">Indicators detected</h3>
        <div className="flex flex-wrap gap-2">
          {result.indicators?.map((ind, i) => (
            <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{ind}</span>
          ))}
        </div>
      </div>

      <div className="bg-blue-950 border border-blue-800 rounded-xl p-4">
        <h3 className="text-blue-300 text-sm font-medium mb-1">Recommendation</h3>
        <p className="text-blue-100 text-sm">{result.recommendation}</p>
      </div>

      <p className="text-slate-600 text-xs mt-4">Target sector: {result.target_sector} · Method: {result.input_method} · Saved to MongoDB</p>
    </div>
  );
}