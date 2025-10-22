import React from "react";
import { CartProvider } from "../cart/CartContext";
import { AppProviders } from "./AppProviders";
import MenuScreen from "./screens/MenuScreen";

export default function App() {
  return (
    <AppProviders>
      <CartProvider>
        <MenuScreen />
      </CartProvider>
    </AppProviders>
  );
}