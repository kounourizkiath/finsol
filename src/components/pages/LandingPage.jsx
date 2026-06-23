import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

export const LandingPage = ({ onStartAnalysis }) => {
  const { t } = useLanguage();

  return (
    <div style={{ background: '#0a0e27', minHeight: '100vh', color: '#f5f7fa' }}>
      {/* HERO SECTION */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px'
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 170, 0.03) 0%, transparent 50%)',
          animation: 'gradient-shift 8s ease-in-out infinite'
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #00d4aa, #00a878)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            animation: 'fadeInDown 0.8s ease-out'
          }}>
            MarketSync Pro
          </h1>

          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#f5f7fa',
            marginBottom: '16px',
            lineHeight: '1.4',
            animation: 'fadeInUp 0.8s ease-out 0.15s both'
          }}>
            Analysez les ETF.<br />Simulez vos investissements.<br />Prenez de meilleures décisions.
          </h2>

          <p style={{
            fontSize: '16px',
            color: '#a8b2c7',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            animation: 'fadeInUp 0.8s ease-out 0.3s both'
          }}>
            Plateforme d'analyse quantitative ETF — données Yahoo Finance en temps réel, indicateurs techniques
            automatisés, simulateur DCA et optimisation de portefeuille par ratio de Sharpe.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            animation: 'fadeInUp 0.8s ease-out 0.45s both',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={onStartAnalysis}
              style={{
                background: 'linear-gradient(to right, #00d4aa, #00a878)',
                color: '#0a0e27',
                fontWeight: 'bold',
                padding: '14px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(0, 212, 170, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 30px rgba(0, 212, 170, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 212, 170, 0.3)';
              }}
            >
              → Commencer l'analyse
            </button>

            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: '#00d4aa',
                fontWeight: 'bold',
                padding: '14px 32px',
                borderRadius: '8px',
                border: '2px solid #00d4aa',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 212, 170, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              📚 Documentation
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section style={{
        padding: '80px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'start'
      }}>
        {/* Problem */}
        <div>
          <h3 style={{ fontSize: '28px', color: '#f5f7fa', marginBottom: '32px', animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
            Pourquoi MarketSync Pro ?
          </h3>
          {[
            { icon: '❌', title: 'Données fragmentées', desc: 'Prix ETF, indicateurs et simulateurs sont sur des plateformes différentes.' },
            { icon: '❌', title: 'Analyse manuelle chronophage', desc: 'Calculer RSI, moyennes mobiles et backtests DCA manuellement prend des heures.' },
            { icon: '❌', title: 'Outils pro inaccessibles', desc: 'Bloomberg Terminal coûte $24,000/an.' }
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: '#1a1f3a',
                border: '1px solid #ef4444',
                borderLeft: '3px solid #ef4444',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                animation: `fadeInUp 0.8s ease-out ${0.7 + i * 0.1}s both`
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>{card.title}</div>
              <div style={{ color: '#a8b2c7', fontSize: '14px' }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Solution */}
        <div>
          <h3 style={{ fontSize: '28px', color: '#f5f7fa', marginBottom: '32px', animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
            Notre approche
          </h3>
          {[
            { icon: '✅', title: 'Pipeline ETL automatisé', desc: '1 fetch = 1,260 points transformés en signaux actionnables en < 500ms.' },
            { icon: '✅', title: 'Indicateurs en temps réel', desc: 'RSI(14), MA20/50, momentum et Sharpe calculés automatiquement.' },
            { icon: '✅', title: 'Simulateur de décision', desc: 'Backtestez votre stratégie DCA sur l\'historique réel de 2 ans.' }
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: '#1a1f3a',
                border: '1px solid #10b981',
                borderLeft: '3px solid #10b981',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                animation: `fadeInUp 0.8s ease-out ${0.7 + i * 0.1}s both`
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>{card.title}</div>
              <div style={{ color: '#a8b2c7', fontSize: '14px' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* METRICS SECTION */}
      <section style={{
        padding: '80px 32px',
        background: 'rgba(26, 31, 58, 0.5)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '28px', color: '#f5f7fa', marginBottom: '48px', animation: 'fadeInUp 0.8s ease-out 0.9s both' }}>
          Capacités de la plateforme
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto',
          marginBottom: '48px'
        }}>
          {[
            { icon: '⚡', label: 'Latence pipeline', value: 500, unit: 'ms' },
            { icon: '📊', label: 'Points par session', value: 1260, unit: 'pts' },
            { icon: '🧮', label: 'Indicateurs', value: 3, unit: 'algos' },
            { icon: '🌍', label: 'Marchés couverts', value: 5, unit: 'ETFs' }
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                background: '#1a1f3a',
                border: '1px solid #3a4458',
                borderRadius: '8px',
                padding: '32px 24px',
                animation: `fadeInUp 0.8s ease-out ${0.9 + i * 0.1}s both`
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{metric.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00d4aa', marginBottom: '8px' }}>
                <Counter target={metric.value} duration={2000} />
                {metric.unit.charAt(0) !== ' ' ? metric.unit : ''}
              </div>
              <div style={{ color: '#a8b2c7', fontSize: '14px' }}>{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div style={{ animation: 'fadeInUp 0.8s ease-out 1.3s both' }}>
          <p style={{ color: '#a8b2c7', marginBottom: '16px', fontSize: '14px' }}>Idéal pour</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['📈 Investisseur particulier', '🏦 Analyste financier', '🎓 Étudiant en finance', '💼 Data Engineer'].map(use => (
              <span
                key={use}
                style={{
                  background: '#242d4a',
                  border: '1px solid #3a4458',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  color: '#a8b2c7'
                }}
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }
      `}</style>
    </div>
  );
};
