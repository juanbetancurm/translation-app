//
//
// The ribosome sprite: 60S large subunit on top, E/P/A site labels in the
// middle, 40S small subunit on the bottom. Positioned absolutely within
// its parent .ribo-zone container; the parent supplies the horizontal
// `left` pixel coordinate.
//
// Visual states are controlled entirely through props. The CSS handles
// transitions; the JS does not animate anything imperatively.
//
// Props:
//   left           pixel position from the left edge of the parent
//                  .ribo-zone, used to center the ribosome over a codon.
//                  In Phase 3 you pass this manually; in Phase 4 a helper
//                  computes it from a codon ref.
//   visible        whether the entire ribosome is rendered (default true).
//                  We use the `hidden` CSS class to remove it from layout
//                  flow without unmounting, preserving any transitions.
//   largeVisible   whether the 60S subunit and E/P/A site labels are
//                  visible (default true). False during the brief window
//                  in initiation where only the 40S has landed.
//   fadingOut      whether the ribosome is mid-disassembly. Triggers an
//                  opacity transition to 0 (default false).

import "./Ribosome.css";

export default function Ribosome({
  left = 0,
  visible = true,
  largeVisible = true,
  fadingOut = false,
}) {
  const wrapperClass = `ribo${visible ? "" : " hidden"}${
    fadingOut ? " ribo-fading" : ""
  }`;

  // The "subunits dim" state is when only the 40S is meant to show.
  // We apply opacity 0 to the 60S element and the sites row inline,
  // because that toggle is data-driven, not a static CSS rule.
  const largeStyle = largeVisible ? undefined : { opacity: 0 };
  const sitesStyle = largeVisible ? undefined : { opacity: 0 };

  return (
    <div className={wrapperClass} style={{ left: `${left}px` }}>
      <div className="ribo-lg" style={largeStyle}>
        <span>60S — large subunit</span>
      </div>
      <div className="sites" style={sitesStyle}>
        <span className="site-e">E</span>
        <span className="site-p">P</span>
        <span className="site-a">A</span>
      </div>
      <div className="ribo-sm">
        <span>40S — small subunit</span>
      </div>
    </div>
  );
}