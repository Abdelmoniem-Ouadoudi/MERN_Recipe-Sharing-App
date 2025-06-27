import React, { useEffect, useState } from "react";
import "../styles/ModernRecipes.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInstructions, setExpandedInstructions] = useState({});

  useEffect(() => {
    // Test backend connection first
    testConnection();
    getRecipes();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch("http://localhost:2000/auth/", {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("token") || 'test'}`,
        },
      });
      console.log("Backend connection test:", response.status);
    } catch (error) {
      console.error("Backend connection failed:", error);
    }
  };

  const getRecipes = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No token found - user needs to login");
      toast.warn("Please login to view recipes");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/auth/recipe", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recipes loaded successfully:", data.length);
      setRecipes(data);
    } catch (error) {
      console.error("Error loading recipes:", error);
      if (error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please check if the backend is running.");
      } else {
        toast.error("Failed to load recipes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    if (window.confirm(`Are you sure you want to delete "${recipeTitle}"?`)) {
      try {
        const response = await fetch(
          `http://localhost:2000/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        } else {
          toast.error("Failed to delete recipe");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the recipe");
        console.error(error);
      }
    }
  };

  const handleAddToFavorites = async (recipeId, recipeTitle) => {
    try {
      const response = await fetch(
        `http://localhost:2000/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
          headers: {
            "Authorization": localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        toast.success(`"${recipeTitle}" added to favorites!`);
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already in your favorites");
        } else {
          toast.error(data.error || "Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const SearchRecipes = async (searchValue) => {
    try {
      if (searchValue.trim()) {
        const response = await fetch(
          `http://localhost:2000/auth/searchRecipes/${searchValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.getItem("token"),
            },
          }
        );

        const searchedRecipes = await response.json();

        if (!searchedRecipes.message) {
          setRecipes(searchedRecipes);
        } else {
          setRecipes([]);
        }
      } else {
        getRecipes();
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    SearchRecipes(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    getRecipes();
  };

  const toggleInstructions = (recipeId) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return "";
    
    if (instructions.match(/^\d+\./)) {
      return instructions.split("\n").filter(step => step.trim()).join(" ");
    }
    return instructions.split("\n").filter(step => step.trim()).join(" ");
  };

  const SkeletonCard = () => (
    <div className="recipe-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-icon">🍽️</div>
      <h2 className="empty-state-title">
        {searchTerm ? "No recipes found" : "No recipes yet"}
      </h2>
      <p className="empty-state-text">
        {searchTerm 
          ? `No recipes match "${searchTerm}". Try a different search term.`
          : "Start sharing your favorite recipes with the community!"
        }
      </p>
      {!searchTerm && (
        <Link to="/addRecipe" className="empty-state-btn">
          ➕ Add Your First Recipe
        </Link>
      )}
    </div>
  );

  return (
    <div className="recipes-container">
      {/* Header Section */}
      <div className="recipes-header">
        <h1 className="recipes-title">Discover Amazing Recipes</h1>
        <p className="recipes-subtitle">
          Explore our collection of delicious recipes shared by our community
        </p>
      </div>

      {/* Search Section */}
      <div className="search-container">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes by name, ingredient, or cuisine..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="recipes-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <div className="recipe-image-container">
                <img 
                  src={recipe.imageUrl || "/api/placeholder/350/200"} 
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg width='350' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial, sans-serif' font-size='16'%3E🍽️ Recipe Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="recipe-image-overlay"></div>
              </div>

              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.title}</h2>

                <div className="recipe-meta">
                  <div className="recipe-meta-item">
                    <span>🥘</span>
                    <span>{recipe.ingredients?.length || 0} ingredients</span>
                  </div>
                  <div className="recipe-meta-item">
                    <span>⏱️</span>
                    <span>Easy to make</span>
                  </div>
                </div>

                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div className="recipe-ingredients-section">
                    <h3 className="recipe-section-title">Ingredients</h3>
                    <ul className="recipe-ingredients-list">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <li key={index} className="recipe-ingredient">
                          {ingredient}
                        </li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li className="recipe-ingredient">
                          +{recipe.ingredients.length - 3} more ingredients
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {recipe.instructions && (
                  <div className="recipe-instructions-section">
                    <h3 className="recipe-section-title">Instructions</h3>
                    <div className={`recipe-instructions ${expandedInstructions[recipe._id] ? 'expanded' : ''}`}>
                      {expandedInstructions[recipe._id] 
                        ? formatInstructions(recipe.instructions)
                        : truncateText(formatInstructions(recipe.instructions))
                      }
                    </div>
                    {formatInstructions(recipe.instructions).length > 150 && (
                      <button 
                        className="read-more-btn"
                        onClick={() => toggleInstructions(recipe._id)}
                      >
                        {expandedInstructions[recipe._id] ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                <div className="recipe-actions">
                  <button
                    className="recipe-btn recipe-btn-favorite"
                    onClick={() => handleAddToFavorites(recipe._id, recipe.title)}
                  >
                    <span>❤️</span>
                    Add to Favorites
                  </button>
                  <button
                    className="recipe-btn recipe-btn-delete"
                    onClick={() => handleDeleteRecipe(recipe._id, recipe.title)}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>

                <Link to="/addRecipe" className="add-recipe-link">
                  <span>➕</span>
                  Add more recipes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState />
          </div>
        )}
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Recipes;
