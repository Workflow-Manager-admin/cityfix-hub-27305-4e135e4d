import React from "react";
import styles from "./HomePage.module.css";

// SVG Logo for "Save Earth"
const Logo = () => (
  <span className={styles.logoIcon} aria-label="Save Earth Logo">
    {/* A stylized planet/leaf SVG, green/blue/white for accent */}
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={styles.logoSvg}
    >
      <defs>
        <radialGradient id="earth-gradient" cx="50%" cy="45%" r="85%">
          <stop offset="0%" stopColor="#27fa76" />
          <stop offset="72%" stopColor="#0cd7fa" />
          <stop offset="100%" stopColor="#eaf8f9" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#earth-gradient)" stroke="#fff" strokeWidth="2" />
      <path
        d="M23.9 19.2c-1.1-3.4-6.1-2.9-7.7-.2-1.1 2 0.5 4.6 2.9 4.8 1.7 0.2 2.8-0.6 4.1-1.4"
        fill="none"
        stroke="#112629"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse
        cx="13"
        cy="13"
        rx="3"
        ry="1.8"
        fill="#fff"
        fillOpacity="0.22"
      />
    </svg>
  </span>
);

// Neon Arrow Icon (for CTA and card button)
const NeonArrow = () => (
  <span className={styles.neonArrow}>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <path
        d="M7 4L13 9.5L7 15"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow" x="-2" y="0" width="22" height="20" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </span>
);

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Articles", href: "#articles" },
  { label: "For Business", href: "#business" },
  { label: "Discover", href: "#discover" },
];

// Hero "Mother Earth" bust illustration (SVG - decorative)
const HeroImage = () => (
  <div className={styles.heroImgWrapper} aria-hidden="true">
    {/* Stylized bust/statue, organic foliage accent, soft colored lights */}
    <svg
      viewBox="0 0 330 355"
      width="266"
      height="320"
      className={styles.heroImgSvg}
      style={{ opacity: 0.94 }}
    >
      <defs>
        <radialGradient id="skin" cx="60%" cy="45%" r="66%">
          <stop offset="0%" stopColor="#1e2931" />
          <stop offset="95%" stopColor="#264335" />
        </radialGradient>
        <radialGradient id="glowGreen" cx="48%" cy="50%" r="67%">
          <stop offset="10%" stopColor="#27fa76" stopOpacity="0.25"/>
          <stop offset="80%" stopColor="#112629" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="120%">
          <stop offset="0%" stopColor="#081518" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#0e2119" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Geometric/organic depth behind */}
      <ellipse cx="160" cy="170" rx="149" ry="121" fill="url(#glowGreen)" opacity="0.55"/>
      {/* Statue bust shape */}
      <ellipse cx="160" cy="171" rx="95" ry="132" fill="url(#skin)" />
      <ellipse cx="160" cy="193" rx="60" ry="30" fill="#1e2931" opacity="0.92"/>
      {/* Facial accents */}
      <ellipse cx="145" cy="150" rx="16" ry="9" fill="#203b2f" opacity="0.34"/>
      <ellipse cx="175" cy="150" rx="16" ry="9" fill="#203b2f" opacity="0.39"/>
      {/* Glow effect */}
      <ellipse cx="160" cy="145" rx="33" ry="15" fill="#27fa76" opacity="0.1"/>
      {/* Foliage (organic decorative, right/top) */}
      <path d="M270 80c-17 17-34-10-36 24 8-5 28 1 36-24z" fill="#27fa76" opacity="0.39"/>
      <path d="M236 95c7 13-14 24 18 30 1-12-4-20-18-30z" fill="#2cfb72" opacity="0.32"/>
      {/* Additional light spot */}
      <circle cx="230" cy="50" r="13" fill="#2cfb72" opacity="0.25"/>
      {/* Chin, shadow */}
      <ellipse cx="160" cy="205" rx="25" ry="11" fill="url(#shadow)" />
    </svg>
  </div>
);

const FeatureCard = ({
  title,
  subtitle,
  icon,
  onClick,
}) => (
  <div className={styles.card}>
    <div className={styles.cardBody}>
      <div className={styles.cardHeadline}>
        {title}
      </div>
      <div className={styles.cardSubtext}>
        {subtitle}
      </div>
      <button className={styles.cardBtn} tabIndex={0} type="button" onClick={onClick}>
        Discover More <NeonArrow />
      </button>
    </div>
    {icon && <div className={styles.cardIcon}>{icon}</div>}
  </div>
);

// PUBLIC_INTERFACE
function HomePage() {
  return (
    <div className={styles.homeRoot}>
      {/* Header/Nav */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <Logo />
            <span className={styles.logoText}>Save Earth</span>
          </div>
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <a href={link.href} className={styles.navLink} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>
      {/* Main content */}
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <h1 className={styles.heroHeadline}>
              <span className={styles.heroMother}>Mother</span>
              <span className={styles.heroEarth}>Earth</span>
            </h1>
            <div className={styles.heroSubhead}>
              We help you live carbon neutral.
            </div>
            <a
              href="#calculate"
              className={styles.ctaBtn}
              tabIndex={0}
            >
              Calculate Impact <NeonArrow />
            </a>
          </div>
          <HeroImage />
          {/* Decorative accent shape layered behind */}
          <div className={styles.heroAccent}></div>
        </section>
        <section className={styles.featuresSection}>
          <FeatureCard
            title="Understand Emission"
            subtitle="Use our calculator powered by better data to know your CO₂ footprint."
            onClick={() => window.location.hash = "#calculator"}
            icon={<span role="img" aria-label="calculator">🧮</span>}
          />
          <FeatureCard
            title="Support Climate Projects"
            subtitle="Sign up and fund high-impact carbon offsets tackling nature, clean air, and more."
            onClick={() => window.location.hash = "#projects"}
            icon={<span role="img" aria-label="leaf">🌱</span>}
          />
        </section>
      </main>
    </div>
  );
}

export default HomePage;
