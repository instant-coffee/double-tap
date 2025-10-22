import React, { createContext, useContext, useMemo, useReducer } from "react";

type CartState = { items: Record<string, number> };
type Action = { type: "add"; id: string } | { type: "remove"; id: string } | { type: "clear" };

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "add": {
      const qty = (state.items[action.id] ?? 0) + 1;
      return { items: { ...state.items, [action.id]: qty } };
    }
    case "remove": {
      const next = { ...state.items };
      if (next[action.id]) {
        next[action.id] = next[action.id] - 1;
        if (next[action.id] <= 0) delete next[action.id];
      }
      return { items: next };
    }
    case "clear":
      return { items: {} };
  }
}

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<Action> } | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: {} });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}