import React, { useState } from "react";
import "../styles/ModernAddRecipe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleAddIngredient = () => {
    const lastIngredient = recipe.ingredients[recipe.ingredients.length - 1];
    if (lastIngredient.trim() !== "") {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ""],
      });
    } else {
      toast.warn("Please fill the current ingredient before adding a new one");
    }
  };

  const handleRemoveIngredient = (index) => {
    if (recipe.ingredients.length > 1) {
      const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
      setRecipe({
        ...recipe,
        ingredients: updatedIngredients,
      });
    }
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!recipe.title.trim()) {
      newErrors.title = "Recipe title is required";
    }

    const nonEmptyIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (nonEmptyIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (!recipe.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }

    if (recipe.imageUrl && !isValidUrl(recipe.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    const nonEmptyIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    const recipeData = {
      ...recipe,
      ingredients: nonEmptyIngredients,
    };

    try {
      const response = await fetch("http://localhost:2000/auth/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        toast.success("Recipe added successfully! 🎉");
        
        // Reset form
        setRecipe({
          title: "",
          ingredients: [""],
          instructions: "",
          imageUrl: "",
        });

        setTimeout(() => {
          window.location.href = "/recipes";
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to add recipe. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred while adding the recipe:", error);
      toast.error("An error occurred while adding the recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      window.location.href = "/recipes";
    }
  };

  return (
    <div className="add-recipe-container">
      <div className="add-recipe-header">
        <h1 className="add-recipe-title">Share Your Recipe</h1>
        <p className="add-recipe-subtitle">
          Add your favorite recipe to our community cookbook and inspire others to cook!
        </p>
      </div>

      <div className="add-recipe-form-container">
        <div className="add-recipe-card">
          <form className="add-recipe-form" onSubmit={handleSubmit}>
            {/* Recipe Title Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📝</span>
                Recipe Details
              </h2>
              
              <div className="form-field">
                <label htmlFor="title" className="form-label">
                  Recipe Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Enter a catchy name for your recipe"
                  value={recipe.title}
                  onChange={handleInputChange}
                />
                {errors.title && <div className="error-text">{errors.title}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="imageUrl" className="form-label">
                  Image URL (Optional)
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://example.com/your-recipe-image.jpg"
                  value={recipe.imageUrl}
                  onChange={handleInputChange}
                />
                {errors.imageUrl && <div className="error-text">{errors.imageUrl}</div>}
                <div className="helper-text">
                  Add a beautiful image to make your recipe more appealing
                </div>
                
                {recipe.imageUrl && (
                  <div className="image-preview-container">
                    {isValidUrl(recipe.imageUrl) ? (
                      <img 
                        src={recipe.imageUrl} 
                        alt="Recipe preview" 
                        className="image-preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="image-preview-placeholder">
                        <div className="image-placeholder-icon">🖼️</div>
                        <div>Invalid image URL</div>
                      </div>
                    )}
                  </div>
                )}
                
                {!recipe.imageUrl && (
                  <div className="image-preview-container">
                    <div className="image-preview-placeholder">
                      <div className="image-placeholder-icon">📸</div>
                      <div>No image added yet</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        Your recipe will still look great!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">🥘</span>
                Ingredients
              </h2>
              
              <div className="ingredients-section">
                <div className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item">
                      <div className="ingredient-number">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        className="ingredient-input"
                        placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour)`}
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                      />
                      {recipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          className="remove-ingredient-btn"
                          onClick={() => handleRemoveIngredient(index)}
                          title="Remove ingredient"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  className="add-ingredient-btn"
                  onClick={handleAddIngredient}
                  disabled={recipe.ingredients[recipe.ingredients.length - 1]?.trim() === ""}
                >
                  <span>➕</span>
                  Add Another Ingredient
                </button>
                
                {errors.ingredients && <div className="error-text">{errors.ingredients}</div>}
                
                <div className="helper-text">
                  Include quantities and measurements (e.g., "2 cups flour", "1 tsp salt")
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">👨‍🍳</span>
                Cooking Instructions
              </h2>
              
              <div className="form-field">
                <label htmlFor="instructions" className="form-label">
                  Step-by-step Instructions *
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  className="form-textarea"
                  placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients in a large bowl&#10;3. Add wet ingredients and stir until combined&#10;4. Bake for 25-30 minutes..."
                  value={recipe.instructions}
                  onChange={handleInputChange}
                  rows={8}
                />
                {errors.instructions && <div className="error-text">{errors.instructions}</div>}
                <div className="helper-text">
                  Write clear, step-by-step instructions. You can number them or use separate lines for each step.
                </div>
              </div>
            </div>
          </form>

          <div className="form-actions">
            <button
              type="button"
              className="form-btn form-btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <span>❌</span>
              Cancel
            </button>
            
            <button
              type="submit"
              className="form-btn form-btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  Adding Recipe...
                </>
              ) : (
                <>
                  <span>🍳</span>
                  Add Recipe
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={4000}
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

export default AddRecipe;
