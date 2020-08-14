import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const Home = (props: any) => {
  const { navigation } = props;
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      db.transaction((tx) => {
        tx.executeSql("select * from images", [], (_, res) => {
          let rows: any = res.rows;
          setCount(rows.length)
        });
      });
    }, 1000);
    return () => clearInterval(interval);
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Number of Images stored: {count}</Text>
      <View style={{padding: 10}} />
      <TouchableOpacity onPress={() => navigation.navigate("View")} style={{
        borderColor: "blue", borderWidth: 2, borderRadius: 10, padding: 10
      }}>
      <Text style={{color: "blue"}}>View All</Text>
      </TouchableOpacity>
      <View style={{padding: 10}} />
      
      <TouchableOpacity onPress={() => navigation.navigate("Clear")} style={{borderColor: "red", borderWidth: 2, borderRadius: 10, padding: 10}}>
        <Text style={{color: "red"}}>Go To Clear Page</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {},
});

export { Home };
