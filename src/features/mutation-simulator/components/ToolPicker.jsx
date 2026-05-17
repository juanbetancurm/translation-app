//
// The three editor tool buttons. The active tool is highlighted, and
// selecting a tool sends the new tool id back to the parent reducer.

import "./ToolPicker.css";

const TOOLS = [
  { id: "change", label: "Change base" },
  { id: "delete", label: "Delete base" },
  { id: "insert", label: "Insert after" },
];

export default function ToolPicker({ activeTool, onToolChange }) {
  return (
    <div className="tool-picker">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={`mut-btn${activeTool === tool.id ? " mut-btn-active" : ""}`}
          onClick={() => onToolChange(tool.id)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
