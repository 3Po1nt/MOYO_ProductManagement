import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import moyoLogo from '../assets/moyo-logo.webp';

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  // --------------------------------------------------------
  // 0. THEME COLORS & CONSTANTS (Refined for a Sleek Look)
  // --------------------------------------------------------
  const THEME_COLORS = {
    background: "#0d0d0d", // Extremely dark, nearly black background
    primaryAccent: "#007acc", // A professional, deep electric blue (more corporate than cyan)
    secondaryAccent: "#dc3545", // A standard, recognizable red for 'Logout'
    lightText: "#f8f9fa", // Near-white for primary text
    subtleText: "#adb5bd", // Soft gray for navigation links and subtle info
    separator: "rgba(173, 181, 189, 0.15)", // Very subtle separator
  };

  const TRANSITION_TIME = "0.25s ease-in-out"; // Standardized transition time

  // --------------------------------------------------------
  // 1. GLOBAL NAVBAR AND CONTAINER STYLES
  // --------------------------------------------------------
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // Increased padding for visual weight
    padding: "18px 50px", 
    background: THEME_COLORS.background,
    color: THEME_COLORS.lightText,
    // A more subtle and professional border-bottom
    borderBottom: `1px solid ${THEME_COLORS.separator}`, 
    position: "sticky", 
    top: 0,
    zIndex: 1000,
  };

  const brandContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  // --------------------------------------------------------
  // 2. BRANDING (LOGO & TITLE) STYLES
  // --------------------------------------------------------

  const logoLinkStyle = {
  // We remove font styling and keep the display flex/align items
  display: "flex",
  alignItems: "center",
  marginRight: "40px",
  textDecoration: "none",
};

const logoImageStyle = {
  // Use 'height' to scale the logo cleanly. 
  height: "50px", // Adjust this value to set the height of your logo (e.g., 30px-40px)
  width: "auto", 
  transition: "opacity 0.3s ease",
};

  // --------------------------------------------------------
  // 3. NAVIGATION LINK STYLES
  // --------------------------------------------------------
  const baseLinkStyle = {
    color: THEME_COLORS.subtleText,
    textDecoration: "none",
    marginRight: "30px", // Increased spacing between links
    fontWeight: "500",
    fontSize: "0.95em", // Slightly smaller for professional look
    padding: "5px 0", 
    transition: `color ${TRANSITION_TIME}`, // Only transition color
    position: 'relative', // Necessary for the bottom-bar pseudo-element effect
  };

  // Hover Effect: Text brightens and a blue line appears below
  const handleLinkHover = (e) => {
    e.currentTarget.style.color = THEME_COLORS.lightText;
    // For a cleaner look, instead of changing borderBottom, we'll use a data-attribute trick
    // to simulate a CSS pseudo-element border/underline.
    // However, since inline styles don't support pseudo-elements, 
    // we'll stick to a slightly modified border-bottom approach for simplicity.
    e.currentTarget.style.borderBottom = `2px solid ${THEME_COLORS.primaryAccent}`;
    e.currentTarget.style.paddingBottom = "3px"; // Adjust padding to center line
    e.currentTarget.style.transition = `all ${TRANSITION_TIME}`;
  };

  const handleLinkLeave = (e) => {
    e.currentTarget.style.color = THEME_COLORS.subtleText;
    e.currentTarget.style.borderBottom = "none";
    e.currentTarget.style.paddingBottom = "5px";
  };

  // --------------------------------------------------------
  // 4. AUTHENTICATION (BUTTONS & INFO) STYLES
  // --------------------------------------------------------
  const buttonStyle = {
    // Tighter button padding for a more compact, professional look
    padding: "8px 16px", 
    borderRadius: "4px", // Square corners are often sleeker than pill-shaped
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9em",
    marginLeft: "20px",
    transition: `all ${TRANSITION_TIME}`,
    // Softer shadow for a flatter, modern design
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", 
  };

  // Styles for the main action button (Login)
  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: THEME_COLORS.primaryAccent,
    color: THEME_COLORS.lightText, // Light text on dark blue button
  };

  // Styles for the secondary action button (Logout)
  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: THEME_COLORS.secondaryAccent,
    color: THEME_COLORS.lightText, // Light text on red button
  };

  const userInfoStyle = {
    color: THEME_COLORS.subtleText,
    fontSize: "0.9em",
    marginRight: "20px",
    paddingRight: "20px",
    // Clearer separator using the standardized separator color
    borderRight: `1px solid ${THEME_COLORS.separator}`, 
    // Tighter text for consistency
    letterSpacing: "0.5px", 
  };
  
  // Define button hover handlers: Slight background change and lift
  const handleButtonHover = (e) => {
    // Slight shift in color for primary/login button
    if (e.currentTarget === document.getElementById('login-btn')) {
        e.currentTarget.style.backgroundColor = '#005f99'; // Darker shade of blue
    }
    e.currentTarget.style.transform = "translateY(-2px)"; // A more noticeable lift
    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
  };

  const handleButtonLeave = (e) => {
    // Reset background color for primary/login button
    if (e.currentTarget === document.getElementById('login-btn')) {
        e.currentTarget.style.backgroundColor = THEME_COLORS.primaryAccent;
    }
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.5)";
  };

  // --- RENDERING THE COMPONENT ---
return (
  <nav style={navbarStyle}>
    <div style={brandContainerStyle}>
      {/* 1. BRANDING (Logo and Title) - MODIFIED */}
      <Link to="/" style={logoLinkStyle}>
        <img 
          src={moyoLogo} 
          alt="MOYO Product Management Logo" 
          style={logoImageStyle} 
        />
      </Link>
        
        {/* 2. NAVIGATION LINKS */}
        <Link 
          to="/" 
          style={baseLinkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Products
        </Link>
        <Link 
          to="/add" 
          style={baseLinkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Add Product
        </Link>
        <Link 
          to="/approvals" 
          style={baseLinkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Approvals
        </Link>
      </div>

      {/* Right-aligned authentication section (UNCHANGED LOGIC) */}
      <div style={brandContainerStyle}> 
        {!isAuthenticated && (
          <button 
            id="login-btn" // Added ID for specific hover logic
            style={loginButtonStyle} 
            onClick={() => loginWithRedirect()}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Login
          </button>
        )}
        {isAuthenticated && (
          <>
            <span style={userInfoStyle}>Logged in as: <strong style={{color: THEME_COLORS.lightText}}>{user?.email}</strong></span>
            <button
              style={logoutButtonStyle}
              onClick={() => logout({federated: true,logoutParams: { returnTo: window.location.origin },})}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}