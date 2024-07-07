import React from "react";
import { useState } from "react";
import "./styles/mainHeader.css";
import "./styles/dropDown.css";
import { useGlobalContext } from "./Context";
const FirstNavbar = () => {
  //we use this to create a drop down menues
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    setIsOpen(false); // Close the dropdown after selection
  };

  const { products, categories, filterCategories, showOnlyFavorites } =
    useGlobalContext();

  return (
    <nav className="mainHeader">
      <ul>
        <li>איתור הזמנה |</li>
        <li>החשבון שלי |</li>
        <li onClick={showOnlyFavorites}> פריטים מועדפים |</li>
        <li onClick={toggleDropdown}>מוצרים |</li>
        {isOpen && (
          <div className="categoriesMenue">
            {categories.map((item) => (
              <div
                key={item}
                className="categorieMenue"
                onClick={filterCategories}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </ul>
    </nav>
  );
};

export default FirstNavbar;
