import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import firebase from "firebase/compat/app";
import "firebase/compat/database"; // Ensure the database is imported

const url = "https://6666aa30a2f8516ff7a44b9d.mockapi.io/Products";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = (userId) => {
    if (!user) return; // Ensure the user is authenticated
    const db = firebase.database();
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

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null); // Assuming setUser is defined somewhere in your context or component
        setFavorites([]);
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  };

  useEffect(() => {
    const dbRef = firebase.database().ref("products");
    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.entries(data || {}).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      setProducts(dataArray);
      getCategories();
    });

    // Cleanup function to disconnect listener when the component unmounts
    return () => dbRef.off("value");
  }, []);

  useEffect(() => {
    console.log(products);
    getCategories();
  }, [products]);

  const handleAddProduct = async (product) => {
    setLoading(true);
    try {
      const response = await axios.post(url, product);
      toast.success("Successfully created!", {
        position: "top-center",
      });
    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (itemId, updatedValues) => {
    try {
      const dbRef = firebase.database().ref("products");
      const itemRef = dbRef.child(itemId);

      await itemRef.update(updatedValues);
      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const dbRef = firebase.database().ref("products");
      const itemRef = dbRef.child(itemId);

      await itemRef.remove();
      console.log("Item removed successfully");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addProduct = (product) => {
    const newProduct = {
      id: createProductId(),
      ...product,
    };
    handleAddProduct(newProduct);
  };

  const getCategories = () => {
    const result = {};
    products.forEach((item) => {
      if (result[item.categoryName]) {
      } else {
        result[item.categoryName] = 1;
      }
    });
    console.log(Object.keys(result));
    setCategories(Object.keys(result));
  };

  return (
    <AppContext.Provider
      value={{
        error,
        loading,
        user,
        addProduct,
        handleAddProduct,
        handleUpdate,
        handleDelete,
        loginWithGoogle,
        products,
        categories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
