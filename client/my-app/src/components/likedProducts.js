import React, { useState, useEffect } from "react";
import "../styles/ModernFavorites.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInstructions, setExpandedInstructions] = useState({});

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:2000/auth/likedRecipes", {
        method: "GET",
        headers: {
          "Authorization": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch liked products");
        return;
      }

      const data = await response.json();
      setLikedProducts(data);
    } catch (error) {
      toast.error("Error fetching liked products");
      console.error("Error fetching liked products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (recipeId, recipeTitle) => {
    if (window.confirm(`Remove "${recipeTitle}" from your favorites?`)) {
      try {
        const response = await fetch(
          `http://localhost:2000/auth/removeLiked/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe removed from favorites");
          setLikedProducts(likedProducts.filter(product => product._id !== recipeId));
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to remove recipe");
        }
      } catch (error) {
        toast.error("Error removing recipe from favorites");
        console.error("Error removing item from liked products:", error);
      }
    }
  };

  const toggleInstructions = (recipeId) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    
    return instructions.split("\n").filter(step => step.trim() !== "");
  };

  const shareRecipe = async (recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this delicious recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(recipe);
        }
      }
    } else {
      fallbackShare(recipe);
    }
  };

  const fallbackShare = (recipe) => {
    const text = `Check out this delicious recipe: ${recipe.title} - ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Recipe link copied to clipboard!");
    }).catch(() => {
      toast.info("Share this recipe with friends!");
    });
  };

  const SkeletonCard = () => (
    <div className="favorites-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="favorites-empty">
      <div className="favorites-empty-icon">💔</div>
      <h2 className="favorites-empty-title">No Favorite Recipes Yet</h2>
      <p className="favorites-empty-text">
        You haven't added any recipes to your favorites yet. 
        Browse through our delicious recipes and save the ones you love!
      </p>
      <Link to="/recipes" className="favorites-empty-btn">
        <span>🍽️</span>
        Discover Recipes
      </Link>
    </div>
  );

  return (
    <div className="favorites-container">
      {/* Header */}
      <div className="favorites-header">
        <h1 className="favorites-title">
          Your Favorite Recipes
        </h1>
        <p className="favorites-subtitle">
          All your saved recipes in one delicious place
        </p>
        {!isLoading && likedProducts.length > 0 && (
          <div className="favorites-count">
            <span>📊</span>
            {likedProducts.length} favorite{likedProducts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="favorites-grid">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : likedProducts.length > 0 ? (
          likedProducts.map((product) => (
            <div key={product._id} className="favorite-card">
              <div className="favorite-badge">❤️ Favorite</div>
              
              <div className="favorite-image-container">
                <img 
                  src={product.imageUrl || "/api/placeholder/400/250"} 
                  alt={product.title}
                  className="favorite-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg width='400' height='250' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial, sans-serif' font-size='18'%3E❤️ Favorite Recipe%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="favorite-image-overlay"></div>
              </div>

              <div className="favorite-content">
                <h2 className="favorite-title">{product.title}</h2>

                <div className="favorite-meta">
                  <div className="favorite-meta-item">
                    <span>🥘</span>
                    <span>{product.ingredients?.length || 0} ingredients</span>
                  </div>
                  <div className="favorite-meta-item">
                    <span>⏱️</span>
                    <span>Easy to make</span>
                  </div>
                  <div className="favorite-meta-item">
                    <span>❤️</span>
                    <span>Favorited</span>
                  </div>
                </div>

                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="favorite-ingredients">
                    <h3 className="favorite-section-title">
                      <span>🛒</span>
                      Ingredients
                    </h3>
                    <ul className="favorite-ingredients-list">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className="favorite-ingredient">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.instructions && (
                  <div className="favorite-instructions">
                    <h3 className="favorite-section-title">
                      <span>👨‍🍳</span>
                      Instructions
                    </h3>
                    <div className={`favorite-instructions-content ${expandedInstructions[product._id] ? 'expanded' : ''}`}>
                      {formatInstructions(product.instructions).map((step, index) => (
                        <div key={index} className="favorite-instructions-step">
                          {step}
                        </div>
                      ))}
                    </div>
                    {formatInstructions(product.instructions).length > 3 && (
                      <button 
                        className="expand-btn"
                        onClick={() => toggleInstructions(product._id)}
                      >
                        {expandedInstructions[product._id] ? 'Show less' : 'Show all steps'}
                      </button>
                    )}
                  </div>
                )}

                <div className="favorite-actions">
                  <button
                    className="favorite-btn favorite-btn-share"
                    onClick={() => shareRecipe(product)}
                  >
                    <span>📤</span>
                    Share
                  </button>
                  <button
                    className="favorite-btn favorite-btn-remove"
                    onClick={() => handleRemoveItem(product._id, product.title)}
                  >
                    <span>💔</span>
                    Remove
                  </button>
                </div>
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

export default LikedProducts;
