import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { AuthProvider } from "./Components/AuthContext.jsx";
import { SiteProvider } from "./Components/SiteContext.jsx";
import { CartProvider } from "./Components/CartContext.jsx";
import "./index.css";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SiteProvider>
      <AuthProvider>
        <CartProvider>
          <App />
          <ToastContainer position="bottom-right" autoClose={2500} />
        </CartProvider>
      </AuthProvider>
    </SiteProvider>
  </BrowserRouter>
);
