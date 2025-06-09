import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./NavigationBar.module.css";

/*
  Props: none (could accept props in future for dynamic user etc.)
  The nav bar is fixed at the top, spanning the page width, using dark background and CityFix palette.
*/
const navItems = [
  { label: "Report Issue", path: "/report" },
  { label: "Check", path: "/check" },
  { label: "Issue Status", path: "/status" },
  { label: "Contact Us", path: "/contact" },
  { label: "About", path: "/about" },
];

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="CityFix Hub Home">
          <span className={styles.logoSymbol} role="img" aria-label="planet">🌎</span>
          <span className={styles.logoText}>
            <span className={styles.logoCity}>CityFix</span>
            <span className={styles.logoHub}>Hub</span>
          </span>
        </Link>
        <ul className={styles.linkList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ""}`}
                tabIndex={0}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
