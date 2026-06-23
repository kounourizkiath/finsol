import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = ({ currentStep, setStep, onExportPDF }) => {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 1, label: 'Marché', key: 'step1' },
    { id: 2, label: 'Analyse', key: 'step2' },
    { id: 3, label: 'Décision', key: 'step3' },
    { id: 4, label: '📚 Docs', key: 'docs' }
  ];

  const handleNavClick = (id) => {
    setStep(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(26, 31, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #3a4458',
        height: '64px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        gap: '24px'
      }}>
        {/* Logo */}
        <div
          onClick={() => setStep(1)}
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #00d4aa, #00a878)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            minWidth: '140px',
            whiteSpace: 'nowrap'
          }}
        >
          MarketSync Pro
        </div>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center'
        }} className="nav-links-desktop">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: currentStep === item.id ? '#00d4aa' : '#a8b2c7',
                fontSize: '14px',
                fontWeight: currentStep === item.id ? '600' : '400',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: currentStep === item.id ? '2px solid #00d4aa' : '2px solid transparent',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentStep !== item.id) {
                  e.target.style.color = '#00d4aa';
                }
              }}
              onMouseLeave={(e) => {
                if (currentStep !== item.id) {
                  e.target.style.color = '#a8b2c7';
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side: Live Badge + Language + Export */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          minWidth: 'fit-content'
        }} className="nav-right-desktop">
          {currentStep !== 4 && (
            <div style={{
              fontSize: '11px',
              color: '#a8b2c7',
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></span>
              LIVE
            </div>
          )}

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: '#242d4a',
              border: '1px solid #3a4458',
              color: '#f5f7fa',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#00d4aa'}
            onMouseLeave={(e) => e.target.style.borderColor = '#3a4458'}
          >
            <option value="FR">🇫🇷 FR</option>
            <option value="EN">🇬🇧 EN</option>
          </select>

          {currentStep !== 4 && (
            <button
              onClick={onExportPDF}
              style={{
                background: '#00d4aa',
                color: '#0a0e27',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#00c299'}
              onMouseLeave={(e) => e.target.style.background = '#00d4aa'}
            >
              {t.exportPdf}
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#a8b2c7',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'none'
          }}
          className="mobile-menu-toggle"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          background: 'rgba(26, 31, 58, 0.98)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #3a4458',
          padding: '16px',
          display: 'none',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 40
        }}
        className="mobile-menu"
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: currentStep === item.id ? '#242d4a' : 'none',
                border: 'none',
                color: currentStep === item.id ? '#00d4aa' : '#a8b2c7',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: '6px',
                textAlign: 'left',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00d4aa'}
              onMouseLeave={(e) => {
                if (currentStep !== item.id) {
                  e.target.style.color = '#a8b2c7';
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-right-desktop {
            display: flex !important;
            gap: 8px !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
