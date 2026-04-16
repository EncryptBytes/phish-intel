import { useEffect, useState } from "react";
import { getTaxonomy } from "../api/client";

const sophColour = { Low:"text-green-400", Medium:"text-yellow-400", High:"text-orange-400","Very High":"text-red-400" };

export default function TaxonomyPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => { getTaxonomy().then(r => setData(r.data)); }, []);

  const filtered = data.filter(d =>
    d.type.toLowerCase().includes(filter.toLowerCase()) ||
    d.channel.toLowerCase().includes(filter.toLowerCase()) ||
    d.subtype.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Phishing Taxonomy Database</h1>
      <p className="text-slate-400 mb-6">{data.length} pre-seeded attack records from the literature review.</p>

      <input value={filter} onChange={e=>setFilter(e.target.value)}
        placeholder="Filter by type, channel, or subtype..."
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 mb-6 focus:outline-none focus:border-blue-500" />

      <div className="space-y-4">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-blue-400 font-medium">{entry.type}</span>
                <span className="text-slate-400 mx-2">—</span>
                <span className="text-slate-300">{entry.subtype}</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">{entry.channel}</span>
                <span className={`text-xs px-2 py-1 rounded bg-slate-800 ${sophColour[entry.sophistication]}`}>{entry.sophistication}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-2">{entry.technique}</p>
            <div className="flex flex-wrap gap-2">
              {entry.indicators?.map((ind,i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{ind}</span>
              ))}
            </div>
            <p className="text-slate-600 text-xs mt-2">Era: {entry.era} · Target: {entry.target_sector}</p>
          </div>
        ))}
      </div>
    </div>
  );
}