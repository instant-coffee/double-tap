import React, { useMemo } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useCart } from "../../cart/CartContext";
import { useMenu } from "../hooks/useMenu";
import { currency } from "../utils/currency";

export default function MenuScreen() {
  const { menuQuery } = useMenu();
  const { state, dispatch } = useCart();
  const [search, setSearch] = React.useState("");

  const filtered = useMemo(() => {
    const items = menuQuery.data?.items ?? [];
    const s = search.trim().toLowerCase();
    return s ? items.filter((i) => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s)) : items;
  }, [menuQuery.data, search]);

  if (menuQuery.isLoading) return <Text style={{ padding: 16 }}>Loading menu…</Text>;
  if (menuQuery.isError) return <Text style={{ padding: 16 }}>Failed to load menu.</Text>;

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        accessibilityLabel="Search menu"
        placeholder="Search drinks or food"
        value={search}
        onChangeText={setSearch}
        style={{ margin: 12, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const qty = state.items[item.id] ?? 0;
          return (
            <View style={{ padding: 12, marginHorizontal: 12, marginBottom: 8, borderRadius: 12, backgroundColor: "#fafafa" }}>
              <Text accessibilityRole="header" style={{ fontWeight: "600" }}>{item.name}</Text>
              <Text>{item.category} · {currency(item.priceCents)}</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${item.name} to cart`}
                  onPress={() => dispatch({ type: "add", id: item.id })}
                  style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#111", borderRadius: 8 }}
                >
                  <Text style={{ color: "#fff" }}>Add</Text>
                </Pressable>
                {qty > 0 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove one ${item.name} from cart`}
                    onPress={() => dispatch({ type: "remove", id: item.id })}
                    style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#e5e7eb", borderRadius: 8 }}
                  >
                    <Text>Remove (x{qty})</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </View>
  );
}