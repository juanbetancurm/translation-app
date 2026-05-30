//
// The three editor tool buttons. The active tool is highlighted, and
// selecting a tool sends the new tool id back to the parent reducer.

import "./ToolPicker.css";
import { useTranslation } from "../../../i18n/i18nContext.js";

const TOOLS = [
  { id: "change", labelKey: "mutation.tools.change" },
  { id: "delete", labelKey: "mutation.tools.delete" },
  { id: "insert", labelKey: "mutation.tools.insert" },
];

export default function ToolPicker({ activeTool, onToolChange }) {
  const { t } = useTranslation();

  return (
    <div className="tool-picker">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={`mut-btn${activeTool === tool.id ? " mut-btn-active" : ""}`}
          onClick={() => onToolChange(tool.id)}
        >
          {t(tool.labelKey)}
        </button>
      ))}
    </div>
  );
}
