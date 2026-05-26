export default function GuidedTourRing({ rect }) {
  if (!rect) return null;

  const left = Math.max(6, rect.left - 6);
  const top = Math.max(6, rect.top - 6);
  const right = Math.min(window.innerWidth - 6, rect.right + 6);
  const bottom = Math.min(window.innerHeight - 6, rect.bottom + 6);

  return (
    <div
      className="guided-tour-ring"
      style={{
        left,
        top,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
      }}
      aria-hidden="true"
    />
  );
}
