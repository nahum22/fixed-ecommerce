import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import Footer from "./Footer";
import CarouselPage from "./CarouselPage";
import FirstNavbar from "./FirstNavbar";
import { useGlobalContext } from "./Context";
import filledHeart from "./images/filledHeart.png";
import emptyHeart from "./images/emptyHeart.png";

const LandingPage = () => {
  const [data, setData] = useState([]);
  const { products, categories, loginWithGoogle, user, logout } =
    useGlobalContext();
  const [favorites, setFavorites] = useState([]);

  const db = firebase.database();

  const fetchFavorites = (userId) => {
    if (!user) return; // Ensure the user is authenticated

    db.ref(`favorites/${userId}`)
      .once("value") // Use once instead of on to avoid memory leaks
      .then((snapshot) => {
        const favs = [];
        snapshot.forEach((childSnapshot) => {
          favs.push({
            id: childSnapshot.key,
            productId: childSnapshot.val().productId,
            ...childSnapshot.val(),
          });
        });
        setFavorites(favs);
      })
      .catch((error) => {
        console.error("Failed to fetch favorites:", error);
      });
  };

  const addToFavorite = (productId) => {
    if (!user) return;

    const product = products.find((product) => product.id === productId);
    if (!product) return;

    const newFavorite = {
      productId,
      name: product.name,
      imageUrl: product.imageUrl,
    };

    const newFavoriteRef = db.ref(`favorites/${user.uid}`).push(newFavorite);

    setFavorites([
      ...favorites,
      {
        id: newFavoriteRef.key,
        ...newFavorite,
      },
    ]);
  };

  const removeFromFavorite = (productId) => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const favToRemove = favorites.find((fav) => fav.productId === productId);
    if (!favToRemove) {
      console.error("Favorite item not found.");
      return;
    }

    console.log("Attempting to remove favorite:", productId);

    db.ref(`favorites/${user.uid}`)
      .child(favToRemove.id)
      .remove()
      .then(() => {
        console.log("Successfully removed favorite:", productId);
        setFavorites(favorites.filter((fav) => fav.productId !== productId));
      })
      .catch((error) => {
        console.error("Error removing favorite:", error);
      });
  };

  const toggleFavorite = (productId) => {
    if (isFavorite(productId)) {
      removeFromFavorite(productId);
    } else {
      addToFavorite(productId);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.productId === productId);
  };

  useEffect(() => {
    if (user) {
      fetchFavorites(user.uid);
    }
  }, [user]);

  return (
    <>
      <FirstNavbar />
      <main className="content">
        <CarouselPage />
        <h2>Data from Firebase Realtime Database:</h2>
        <div>
          {user ? (
            <>
              <span>Logged in as {user.displayName}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={loginWithGoogle}>Login with Google</button>
          )}
        </div>
        <div className="productsContainer">
          {products.map((item) => (
            <div className="productCard" key={item.id}>
              <div>
                <img src={item.imageUrl} alt={item.name} />
                <h2>{item.name}</h2>
                <p>Product Description</p>
              </div>
              <img
                src={isFavorite(item.id) ? filledHeart : emptyHeart}
                alt={
                  isFavorite(item.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                onClick={() => toggleFavorite(item.id)}
                className="heartIcon"
              />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
