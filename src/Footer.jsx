import React from "react";

import "./styles/footer.css";
import { useGlobalContext } from "./Context";
const Footer = () => {
  const { user, loginWithGoogle, handleSignOut } = useGlobalContext();
  return (
    <div className="footer">
      <div className="footer-item">
        <img
          className="logo"
          src="./navBarIcons/GeneralBuisnessLogo.jpeg"
          alt="Description of the image"
        />
      </div>

      <div className="footer-item">
        <img src="./navBarIcons/tracking.png" alt="Description of the image" />
        <div>איתור הזמנה </div>
      </div>
      <div className="footer-item">
        <img src="./navBarIcons/message.png" alt="Description of the image" />
        <div>הודעות </div>
      </div>
      <div className="footer-item">
        <img
          src="./navBarIcons/shopping_cart.png"
          alt="Description of the image"
        />
        <div>עגלת קניות </div>
      </div>

      <div className="footer-item">
        {user ? (
          <>
            <span>Logged in as {user.displayName}</span>
            <button onClick={handleSignOut}>Logout</button>
          </>
        ) : (
          <>
            <img
              onClick={loginWithGoogle}
              src="./navBarIcons/person.png"
              alt="Description of the image"
            />

            <div onClick={loginWithGoogle}>התחברות משתמש </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Footer;
