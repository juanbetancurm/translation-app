//
//
// The top-level layout shell: a row of tabs at the top, then a routed
// feature view below.

import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import TranslationWalkthrough from "./features/translation-walkthrough/TranslationWalkthrough";
import MutationSimulator from "./features/mutation-simulator/MutationSimulator";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <nav className="tabs">
        <NavLink
          to="/walkthrough"
          className={({ isActive }) => `tab${isActive ? " tab-active" : ""}`}
        >
          <span className="tab-icon" aria-hidden="true">🧬</span>
          Translation Walkthrough
        </NavLink>
        <NavLink
          to="/mutation"
          className={({ isActive }) => `tab${isActive ? " tab-active" : ""}`}
        >
          <span className="tab-icon" aria-hidden="true">🔬</span>
          Mutation Simulator
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/walkthrough" replace />} />
        <Route path="/walkthrough" element={<TranslationWalkthrough />} />
        <Route path="/mutation" element={<MutationSimulator />} />
        <Route path="*" element={<Navigate to="/walkthrough" replace />} />
      </Routes>
    </div>
  );
}