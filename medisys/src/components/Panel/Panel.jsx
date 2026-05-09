import './Panel.css';

/**
 * Props:
 *   title      – panel header text
 *   headerRight – JSX to render on the right side of the header
 *   wide       – spans 2 grid columns
 *   bodyStyle  – inline style for the panel-body
 */
export default function Panel({ title, headerRight, wide, bodyStyle, children }) {
  return (
    <div className={`panel${wide ? ' wide' : ''}`}>
      {title && (
        <div className="panel-head">
          <span className="panel-title">{title}</span>
          {headerRight}
        </div>
      )}
      <div className="panel-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}
