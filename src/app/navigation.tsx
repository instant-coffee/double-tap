import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MenuScreen from "./screens/MenuScreen";


const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: "Menu" }} />
      </Stack.Navigator>
    </>
  );
}