//
// The ribosome sprite layer. The parent supplies the horizontal `left`
// coordinate; CSS handles the visual transition and sprite rendering.
// Optional dataGuide marks the sprite as a stable guided-tour target.

import "./Ribosome.css";
import { useTranslation } from "../../i18n/i18nContext.js";

export default function Ribosome({
  left = 0,
  visible = true,
  largeVisible = true,
  largePreview = false,
  fadingOut = false,
  dataGuide,
}) {
  const { t } = useTranslation();
  const wrapperClass = `ribo${visible ? "" : " hidden"}${
    fadingOut ? " ribo-fading" : ""
  }`;

  const largeStyle = largeVisible
    ? undefined
    : largePreview
      ? { opacity: 0.28, transform: "translateY(-10px)" }
      : { opacity: 0 };
  const sitesStyle = largeVisible ? undefined : { opacity: 0 };

  return (
    <div
      className={wrapperClass}
      style={{ left: `${left}px` }}
      aria-label={t("shared.ribosomeAria")}
      data-guide={dataGuide}
    >
      <div
        className="ribo-lg"
        style={largeStyle}
        aria-label={t("shared.largeSubunitAria")}
      />
      <div className="sites" style={sitesStyle}>
        <span className="site-e">E</span>
        <span className="site-p">P</span>
        <span className="site-a">A</span>
      </div>
      <div className="ribo-sm" aria-label={t("shared.smallSubunitAria")} />
    </div>
  );
}
