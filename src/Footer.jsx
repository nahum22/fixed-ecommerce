import React from "react";

import "./styles/footer.css";
import { useGlobalContext } from "./Context";
const Footer = () => {
  const { user, loginWithGoogle, logout } = useGlobalContext();
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

      {user ? (
        <>
          <span>Logged in as {user.displayName}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}

      <div className="footer-item">
        <img src="./navBarIcons/person.png" alt="Description of the image" />
        <div>התחברות משתמש </div>
      </div>
    </div>
  );
};

export default Footer;
