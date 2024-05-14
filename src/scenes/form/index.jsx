import { Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import React from 'react';
import axios from 'axios';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const FormComponent = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const phoneRegExp =
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

    const validationSchema = yup.object().shape({
      firstName: yup.string().required("required"),
      lastName: yup.string().required("required"),
      email: yup.string().email("invalid email").required("required"),
      contact: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
      address1: yup.string().required("required"),
      address2: yup.string().required("required"),
      password: yup.string().required("required").min(6, "Password must be at least 6 characters"),

    });

    const handleSubmit = async (values, { setSubmitting , resetForm }) => {
      try {
        await axios.post('http://localhost:5000/api/Admins', values);
        console.log('Admin created successfully!', values);
        resetForm();
      } catch (error) {
        console.error('Error creating Admin:', error);
      }
      setSubmitting(false);
    };

    return (
      <Box m="20px">
        <Header title="CREATE ADMIN" subtitle="Create a New Admin Profile" />
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            address1: '',
            address2: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  name="firstName"
                  sx={{ gridColumn: "span 2" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  name="lastName"
                  sx={{ gridColumn: "span 2" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  name="email"
                  sx={{ gridColumn: "span 4" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Contact Number"
                  name="contact"
                  sx={{ gridColumn: "span 4" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address 1"
                  name="address1"
                  sx={{ gridColumn: "span 4" }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address 2"
                  name="address2"
                  sx={{ gridColumn: "span 4" }}
                />
                <Field
              as={TextField}
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              name="password"
              sx={{ gridColumn: "span 4" }}
            />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create New User'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
};

export default FormComponent;
