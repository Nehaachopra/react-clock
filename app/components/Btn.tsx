export default function Btn({ children, onClick, accent, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 18px", border: "0.5px solid",
        borderColor: danger ? "#fca5a5" : accent ? "#1a6b3c" : "#ccc",
        borderRadius: "8px", cursor: disabled ? "default" : "pointer",
        background: danger ? "#fef2f2" : accent ? "#1a6b3c" : "transparent",
        color: danger ? "#c0392b" : accent ? "#fff" : "#444",
        fontSize: "13px", fontFamily: "sans-serif", fontWeight: "500",
        opacity: disabled ? 0.4 : 1, transition: "all 0.15s"
      }}
    >
      {children}
    </button>
  );
}