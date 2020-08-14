import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

const Clear = () => {
  const { container, button, buttonLabel } = styles;
  const resetImages = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from images`);
      },
      (err) => console.error(`Failed to delete: ${err.message}`),
      () => console.info("Successful clear!")
    );
    Alert.alert("Successfully cleared!");
  };

  return (
    <View style={container}>
      <TouchableOpacity onPress={resetImages} style={button}>
        <Text style={buttonLabel}>Clear Stored Images</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "blue",
    padding: 10,
  },
  buttonLabel: {
    color: "blue",
    fontWeight: "700",
    textAlign: "center",
  },
});

export { Clear };
