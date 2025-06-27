import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../App.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = localStorage.getItem("token");

  const LogoutUser = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          Recipe Sharing App
        </NavLink>
        
        <ul className="navbar-menu">
          {auth ? (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/recipes" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Recipes
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/addRecipe" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Add Recipe
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/favouriteRecipes" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Favourites
                </NavLink>
              </li>
              <li className="navbar-item">
                <button 
                  className="navbar-link logout-btn" 
                  onClick={LogoutUser}
                  title="Logout"
                  aria-label="Logout"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                >
                  Login
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                >
                  Sign Up
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/forgotPassword" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                >
                  Forgot Password
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-actions">
          <ThemeToggle />
          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-list">
          {auth ? (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/recipes" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Recipes
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/addRecipe" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Add Recipe
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/favouriteRecipes" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Favourites
                </NavLink>
              </li>
              <li className="navbar-item">
                <button 
                  className="navbar-link logout-btn mobile-logout" 
                  onClick={LogoutUser}
                  title="Logout"
                  aria-label="Logout"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/forgotPassword" 
                  className={({ isActive }) => 
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Forgot Password
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
