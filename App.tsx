import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Home, Add, ViewAll, Clear } from "./views";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => {
            return {
              headerTitleAlign: "center",
              headerRight: () => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Add")}
                    style={{ padding: 10 }}
                  >
                    <FontAwesome5 name="plus" size={30} />
                  </TouchableOpacity>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          options={({ navigation }) => {
            return {
              headerTitleAlign: "center",
            };
          }}
        />

        <Stack.Screen
          name="View"
          component={ViewAll}
          options={({ navigation }) => {
            return {
              headerTitleAlign: "center",
            };
          }}
        />
        <Stack.Screen
          name="Clear"
          component={Clear}
          options={({ navigation }) => {
            return {
              headerTitleAlign: "center",
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRightStyle: {
    padding: 10,
  },
  headerTitleStyle: {
    textAlign: "center",
  },
  headerStyle: {},
});
