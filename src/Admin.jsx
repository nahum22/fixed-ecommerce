import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "./firebase_setup/firebase.js";
import "./styles/LandingPage.css";
import { useGlobalContext } from "./Context";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { Edit, Delete, AddPhotoAlternate } from "@mui/icons-material";

// Create a custom theme with the primary color set to #feab00, dark grey background, and white text
const theme = createTheme({
  palette: {
    primary: {
      main: "#FAC898",
    },
    background: {
      default: "#303030", // Dark grey background
      paper: "#424242", // Slightly lighter grey for paper components
    },
    text: {
      primary: "#ffffff", // White text
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif", // Set the custom font
  },
});

const Admin = () => {
  const { handleDelete, handleUpdate } = useGlobalContext();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); // Store existing image URL
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const dbRef = firebase.database().ref("products");
    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.entries(data || {}).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      setProducts(dataArray);
    });

    // Cleanup function to disconnect listener when the component unmounts
    return () => dbRef.off("value");
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please sign in to add or update products");
      return;
    }

    try {
      const dbRef = firebase.database().ref("products");
      let imageUrl = existingImageUrl; // Use existing image URL by default

      if (image) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${image.name}`);
        await imageRef.put(image);
        imageUrl = await imageRef.getDownloadURL();
      }

      if (isEditing) {
        await dbRef.child(editProductId).update({
          categoryId,
          categoryName,
          name,
          imageUrl,
        });
        alert("Product updated successfully");
      } else {
        const newProductRef = dbRef.push();
        await newProductRef.set({
          categoryId,
          categoryName,
          name,
          imageUrl,
        });
        alert("Product added successfully");
      }
      // Reset form fields and editing state
      setCategoryId("");
      setCategoryName("");
      setName("");
      setImage(null);
      setExistingImageUrl(""); // Reset existing image URL
      setIsEditing(false);
      setEditProductId(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to submit product. Please try again later.");
    }
  };

  const handleEdit = (product) => {
    setCategoryId(product.categoryId);
    setCategoryName(product.categoryName);
    setName(product.name);
    setExistingImageUrl(product.imageUrl); // Set existing image URL
    setEditProductId(product.id);
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageDelete = async (product) => {
    if (product.imageUrl) {
      const storageRef = firebase.storage().refFromURL(product.imageUrl);
      await storageRef.delete();
      await firebase.database().ref(`products/${product.id}/imageUrl`).remove();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <Typography variant="h6" style={{ marginRight: "20px" }}>
            <a href="/store"> Back To Store</a>
          </Typography>

          {user ? (
            <>
              <Typography variant="h6" style={{ marginRight: "20px" }}>
                Welcome, {user.displayName}
              </Typography>

              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleGoogleSignIn}>
              Sign In with Google
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" style={{ margin: "20px 0" }}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Category ID"
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                InputProps={{
                  style: { color: "#ffffff" },
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Category Name"
                id="categoryName"
                name="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                InputProps={{
                  style: { color: "#ffffff" },
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  style: { color: "#ffffff" },
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternate />}
                color="primary"
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Paper style={{ backgroundColor: "#424242", color: "#ffffff" }}>
          <Typography variant="h5" style={{ padding: "20px 0" }}>
            Products List
          </Typography>
          <List>
            {products.map((product) => (
              <ListItem key={product.id}>
                <ListItemText
                  primary={`Category ID: ${product.categoryId}, Category Name: ${product.categoryName}, Name: ${product.name}`}
                  primaryTypographyProps={{ style: { color: "#ffffff" } }}
                />
                {product.imageUrl && (
                  <div>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width="100"
                      style={{ marginRight: "10px" }}
                    />
                  </div>
                )}
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(product)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(product.id)}
                    color="primary"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Admin;
