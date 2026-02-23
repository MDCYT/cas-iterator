// Trans flag SVG component
export function TransFlag({ className = "", style = {} }) {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect width="32" height="4" y="0" fill="#5BCEFA" />
      <rect width="32" height="4" y="4" fill="#F5A9B8" />
      <rect width="32" height="4" y="8" fill="#FFFFFF" />
      <rect width="32" height="4" y="12" fill="#F5A9B8" />
      <rect width="32" height="4" y="16" fill="#5BCEFA" />
    </svg>
  );
}
