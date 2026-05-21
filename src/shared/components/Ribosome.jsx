//
// The ribosome sprite layer. The parent supplies the horizontal `left`
// coordinate; CSS handles the visual transition and sprite rendering.

import "./Ribosome.css";

export default function Ribosome({
  left = 0,
  visible = true,
  largeVisible = true,
  largePreview = false,
  fadingOut = false,
}) {
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
      aria-label="Ribosome"
    >
      <div
        className="ribo-lg"
        style={largeStyle}
        aria-label="60S large subunit"
      />
      <div className="sites" style={sitesStyle}>
        <span className="site-e">E</span>
        <span className="site-p">P</span>
        <span className="site-a">A</span>
      </div>
      <div className="ribo-sm" aria-label="40S small subunit" />
    </div>
  );
}
