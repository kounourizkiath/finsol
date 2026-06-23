import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Navbar = ({ activeSection, onNavClick, onExportPDF, isLive = false }) => {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "accueil", label: "Accueil" },
    { id: "marche", label: "Marché" },
    { id: "analyse", label: "Analyse" },
    { id: "decision", label: "Décision" },
    { id: "docs", label: "📚 Docs" }
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, background: "rgba(26, 31, 58, 0.95)",
        backdropFilter: "blur(10px)", borderBottom: "1px solid #3a4458",
        height: "64px", padding: "0 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 50, gap: "24px"
      }}>
        <div onClick={() => onNavClick("accueil")} style={{
          fontSize: "18px", fontWeight: "bold",
          background: "linear-gradient(to right, #00d4aa, #00a878)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          cursor: "pointer", minWidth: "140px", whiteSpace: "nowrap"
        }}>MarketSync Pro</div>

        <div style={{
          display: "flex", gap: "32px", alignItems: "center",
          flex: 1, justifyContent: "center"
        }} className="nav-links-desktop">
          {navItems.map(item => (
            <button key={item.id} onClick={() => onNavClick(item.id)} style={{
              background: "none", border: "none",
              color: activeSection === item.id ? "#00d4aa" : "#a8b2c7",
              fontSize: "14px", fontWeight: activeSection === item.id ? "600" : "400",
              cursor: "pointer", padding: "8px 0",
              borderBottom: activeSection === item.id ? "2px solid #00d4aa" : "2px solid transparent",
              transition: "all 0.3s"
            }}>{item.label}</button>
          ))}
        </div>

        <div style={{
          display: "flex", gap: "16px", alignItems: "center", minWidth: "fit-content"
        }} className="nav-right-desktop">
          {activeSection !== "docs" && isLive && (
            <div style={{ fontSize: "11px", color: "#10b981", display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%", animation: "pulse 2s infinite" }}></span>
              LIVE
            </div>
          )}
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
            background: "#242d4a", border: "1px solid #3a4458", color: "#f5f7fa",
            padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer"
          }}>
            <option value="FR">🇫🇷 FR</option>
            <option value="EN">🇬🇧 EN</option>
          </select>
          {activeSection !== "docs" && (
            <button onClick={onExportPDF} style={{
              background: "#00d4aa", color: "#0a0e27", fontWeight: "bold",
              padding: "8px 16px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontSize: "12px"
            }}>{t.exportPdf}</button>
          )}
        </div>
      </nav>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
};
