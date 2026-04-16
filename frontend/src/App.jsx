import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import SubmitPage from "./pages/SubmitPage";
import DashboardPage from "./pages/DashboardPage";
import TaxonomyPage from "./pages/TaxonomyPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <nav className="border-b border-slate-800 px-8 py-4 flex gap-8 items-center">
          <span className="font-bold text-blue-400 text-lg">PhishIntel</span>
          <NavLink to="/" className={({isActive}) => isActive ? "text-white" : "text-slate-400 hover:text-white"}>
            Analyse
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-white" : "text-slate-400 hover:text-white"}>
            Dashboard
          </NavLink>
          <NavLink to="/taxonomy" className={({isActive}) => isActive ? "text-white" : "text-slate-400 hover:text-white"}>
            Taxonomy DB
          </NavLink>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<SubmitPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/taxonomy" element={<TaxonomyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
