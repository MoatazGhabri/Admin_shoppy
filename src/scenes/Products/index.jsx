import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Category } from "@mui/icons-material";

// Define the ImageCell component before Contacts component
const ImageCell = (params) => {
  return params.value ? <img src={params.value} alt="Room" style={{ width: 70, height: 70 }} /> : null;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleModify = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity, // Corrected property name
      category:product.category,
      image: product.image ? product.image : null,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Update image in formData
  };

  const handleFormSubmit = async () => {
    try {
      const formDataCopy = { ...formData };
      // Check if a new image is selected
      if (formDataCopy.image instanceof File) {
        // Convert image to base64 if it's updated
        const imageBase64 = await convertImageToBase64(formDataCopy.image);
        formDataCopy.image = imageBase64;
      } else {
        // Remove image field from formDataCopy if image is not updated
        delete formDataCopy.image;
      }
      const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, formDataCopy);
      console.log("Product modified successfully:", response.data.product);
      const updatedProduct = products.map(product =>product._id === selectedProduct._id ? { ...product, ...response.data.product } : product
      );
      setProducts(updatedProduct);
      handleCloseDialog();
    } catch (error) {
      console.error("Error modifying product:", error);
    }
  };
  
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        reject("Image file is missing");
      }
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const mappedProducts = products.map(product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    category: product.category,
    image: product.image ? `data:image/png;base64,${(product.image)}` : null,
  }));

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },

    { field: "image", headerName: "Image", flex: 1, renderCell: ImageCell },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button variant="outlined" color="success" onClick={() => handleModify(params.row)}>Modify</Button>
          <Button variant="outlined" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];
  const getRowHeight = () => 110; // Adjust the value as needed

  return (
    <Box m="20px">
      <Header title="Products" subtitle="List of products" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={mappedProducts} columns={columns} getRowHeight={getRowHeight}/>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modify Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price || ""}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Category"
            name="category"
            value={formData.category || ""}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          >
            {["Man", "Women"].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="image">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {/* Conditionally render the image */}
          {formData.image && (
            <Box mt={2}>
              <Typography variant="body1">Current Image:</Typography>
              <img src={formData.image} alt="Current Room" style={{ width: 100, height: 100, marginTop: 8 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">Cancel</Button>
          <Button onClick={handleFormSubmit} color="success">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
