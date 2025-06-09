import React from "react";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
// PUBLIC_INTERFACE
function HomePage() {
  // Feature icons and feature content as before...
  const featureIcons = [
    (
      <svg width="39" height="39" fill="none" viewBox="0 0 39 39" aria-hidden="true">
        <circle cx="19.5" cy="19.5" r="16" stroke="#00ff00" strokeWidth="3" fill="none"/>
        <path d="M13 21l4 4 9-9" stroke="#00ff00" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    (
      <svg width="38" height="38" fill="none" viewBox="0 0 38 38">
        <rect x="7" y="13" width="24" height="18" rx="4" stroke="#0000ff" strokeWidth="2"/>
        <circle cx="19" cy="22" r="5" fill="#0000ff"/>
        <rect x="13" y="7" width="12" height="7" rx="2" stroke="#00ff00" strokeWidth="2"/>
      </svg>
    ),
    (
      <svg width="38" height="38" fill="none" viewBox="0 0 38 38">
        <rect x="6" y="9" width="26" height="19" rx="4" stroke="#00ff00" strokeWidth="2"/>
        <circle cx="19" cy="18.5" r="7" stroke="#0000ff" strokeWidth="2"/>
        <circle cx="19" cy="18.5" r="3" fill="#00ff00"/>
      </svg>
    ),
    (
      <svg width="38" height="38" fill="none" viewBox="0 0 38 38">
        <path d="M8 19h22M19 8v22" stroke="#00ff00" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="19" cy="19" r="17" stroke="#0000ff" strokeWidth="2"/>
      </svg>
    )
  ];

  const features = [
    {
      title: "Report Local Issues",
      desc: "Easily pinpoint problems—like potholes, hazards, waste, or more.",
      icon: featureIcons[0]
    },
    {
      title: "Photo/Location Upload",
      desc: "Snap a photo and capture GPS or enter the address for accuracy.",
      icon: featureIcons[1]
    },
    {
      title: "Track Your Reports",
      desc: "See all your submissions, and track progress as fixes happen.",
      icon: featureIcons[2]
    },
    {
      title: "Status Updates",
      desc: "Get notified as authorities mark your issue In Progress or Fixed.",
      icon: featureIcons[3]
    }
  ];

  return (
    <div className={styles.cfHome}>
      {/* The main content, visually shifted down for fixed nav */}
      <main className={styles.mainPanel}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.headline}>
              Public Issues. <span className={styles.accent}>Real Action.</span>
            </h1>
            <p className={styles.blurb}>
              CityFix Hub empowers you to report and track civic problems in your city. 
              Join us in making urban spaces safer, cleaner, and better—one report at a time.
            </p>
            {/* Use react-router-dom Link for native SPA navigation */}
            <Link
              to="/app"
              className={styles.ctaBtn}
              role="button"
              tabIndex={0}
              aria-label="Start Reporting an Issue"
            >
              Report an Issue
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 21 21">
                  <path d="M6.5 4.5l6 6-6 6" stroke="#fff" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <div className={styles.missionStatement}>
              <span className={styles.missionAccent}>Better Cities Start With You.</span>
            </div>
          </div>
        </section>
        {/* Features showcase */}
        <section className={styles.featuresSection} aria-label="App Features">
          <ul className={styles.featuresGrid}>
            {features.map((f, idx) => (
              <li className={styles.featureCard} key={idx}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>
          &copy; {new Date().getFullYear()} CityFix Hub. For vibrant, livable cities—powered by people.
        </span>
      </footer>
    </div>
  );
}

export default HomePage;
