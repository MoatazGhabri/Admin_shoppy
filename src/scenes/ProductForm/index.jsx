import React from "react";
import axios from "axios";
import { Box, Button, TextField ,MenuItem} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
const categories = ["Man", "Women"];

const ProductForm = () => {
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    image: yup.mixed().required("Image is required"),
    price: yup.string().required("Price is required"),
    quantity: yup.number().integer("Quantity").required("Quantity required"),
    category: yup.string().required("Category is required"), // Add validation for category

  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Perform image conversion to base64
      const base64Image = await convertImageToBase64(values.image);
      
      // Update the image field with the base64 data
      values.image = base64Image;

      // Make API call to post the hotel data
      await axios.post("http://localhost:5000/api/products", values);
  
      console.log("Product created successfully!", values);
      resetForm();
    } catch (error) {
      console.error("Error creating Product:", error);
    }
    setSubmitting(false);
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

  return (
    <Box m="20px">
      <Header title="CREATE Product" subtitle="Create a New Product" />
      <Formik
        initialValues={{
          name: "",
          image: null,
          price: "",
          quantity: "",
          category: "", 

        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Box display="grid" gap="30px">
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="text"
                label="Product Name"
                name="name"
              />
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) =>
                  setFieldValue("image", event.currentTarget.files[0])
                }
                style={{ display: "none" }}
              />
              <label htmlFor="image">
                <Button component="span" variant="contained">
                  Upload Image
                </Button>
              </label>
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="text"
                label="Prix"
                name="price"
              />
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="number"
                label="Quantity"
                name="quantity"
              />
               <Field
                as={TextField}
                select
                fullWidth
                variant="filled"
                label="Category"
                name="category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Field>
            </Box>
           
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New Product"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductForm;
