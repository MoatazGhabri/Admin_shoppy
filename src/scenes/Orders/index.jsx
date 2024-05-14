import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { number } from "yup";

const ImageCell = ({ value }) => {
  return value ? <img src={value} alt="product" style={{ width: 70, height: 70 }} /> : null;
};

const Orders = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/commande');
        setCommandes(response.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, []);

  const mappedCommande = commandes.map(commande => ({
    id: commande._id,
    name: commande.name,
    lastName: commande.lastName,
    address: commande.address,
    number: commande.number,
    productName: commande.productName,
    quantity: commande.quantity,
    image: commande.image ? `data:image/png;base64,${commande.image}` : null,
    price: commande.price
  }));

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Username", flex: 1 },
    { field: "lastName", headerName: "last Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },

    { field: "productName", headerName: "Product", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },

    { field: "image", headerName: "Image", flex: 1, renderCell: ImageCell },
    {
      field: "price",
      headerName: "Total Price",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {params.value} DT
        </Typography>
      ),
    },
  ];

  const getRowHeight = () => 110; 

  return (
    <Box m="20px">
      <Header title="Orders" subtitle="List of Orders" />
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography>Error: {error}</Typography>
      ) : (
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
          <DataGrid rows={mappedCommande} columns={columns} getRowHeight={getRowHeight} />
        </Box>
      )}
    </Box>
  );
};

export default Orders;
