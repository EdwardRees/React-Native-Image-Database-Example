import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const ViewAll = () => {
  const [imageObjects, setImageObjects] = useState<null | []>(null);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select * from images`, [], (_, res) => {
        const rows: any = res.rows;
        setImageObjects(rows["_array"]);
      });
    });
  });

  const renderImages = () => {
    if (imageObjects !== null && imageObjects.length !== 0) {
      return imageObjects.map((obj: any) => {
        return (
          <View style={styles.group}>
            <Image source={{ uri: obj.image }} style={styles.image} />
            <Text style={styles.caption}>{obj.description}</Text>
          </View>
        );
      });
    }
  };
  if (imageObjects !== null && imageObjects.length > 0) {
    return (
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.container}>{renderImages()}</View>
      </ScrollView>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Images to display!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  text: {
    color: "#000",
  },
  group: {
    padding: 20
  },
  image: {
    height: 500,
    width: 500,
    resizeMode: "contain",
  },
  caption: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10
  },
});

export { ViewAll };
