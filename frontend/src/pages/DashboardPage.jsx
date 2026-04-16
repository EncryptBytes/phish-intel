import { useEffect, useState } from "react";
import { getStats } from "../api/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, CartesianGrid } from "recharts";

const COLOURS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => { getStats().then(r => setStats(r.data)); }, []);

  if (!stats) return <p className="text-slate-400">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Phishing Evolution Dashboard</h1>
      <p className="text-slate-400 mb-8">Live stats from the findings database — updates with every new submission.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[["Total Findings", stats.total], ["Attack Types", stats.by_type.length], ["Channels", stats.by_channel.length]].map(([k,v]) => (
          <div key={k} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1">{k}</p>
            <p className="text-3xl font-bold text-blue-400">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Findings by attack type</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.by_type.map(d => ({name:d._id, count:d.count}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{fill:"#94a3b8", fontSize:10}} />
              <YAxis tick={{fill:"#94a3b8", fontSize:11}} />
              <Tooltip contentStyle={{background:"#1e293b",border:"1px solid #334155"}} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Channel distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={stats.by_channel.map(d=>({name:d._id,value:d.count}))} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                {stats.by_channel.map((_,i) => <Cell key={i} fill={COLOURS[i%COLOURS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{background:"#1e293b",border:"1px solid #334155"}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Submissions over time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.by_month.map(d=>({month:d._id, count:d.count}))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{fill:"#94a3b8",fontSize:11}} />
            <YAxis tick={{fill:"#94a3b8",fontSize:11}} />
            <Tooltip contentStyle={{background:"#1e293b",border:"1px solid #334155"}} />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{fill:"#3b82f6"}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}