import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";

const db = SQLite.openDatabase("db.db");

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState<null | any>(null);
  const [imageUri, setImageUri] = useState("");
  const [description, setDescription] = useState("");
  const [imageObjects, setImageObjects] = useState<null | []>(null);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists images (id integer primary key not null, image blob not null, description text)`
      );
    });
  }, []);

  const pullFromDB = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from images", [], (_, res) => {
        let rows: any = res.rows;
        setImageObjects(rows["_array"]);
      });
    });
  };

  const save = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(`insert into images (image, description) values (?, ?)`, [
          imageUri,
          description,
        ]);
      },
      (err) => console.error(`Error in inserting: ${err.message}`),
      () => console.log("Successful save!")
    );
    setDescription("");
  };

  const clearDB = () => {
    db.transaction((tx) => {
      tx.executeSql(`delete from images`);
    });
  };

  const renderImages = () => {
    if (imageObjects !== null && imageObjects.length !== 0) {
      return imageObjects.map((obj: any) => {
        return (
          <View>
            <Image source={{uri: obj.image}} style={styles.thumbnail} />
            <Text>{obj.description}</Text>
          </View>
        );
      });
    }
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    if (pickerResult != null) {
      setSelectedImage({
        localUri: pickerResult.uri,
        base64: pickerResult.base64,
      });
      setImageUri(`data:image/png;base64,${pickerResult.base64}`);
    }
  };

  if (imageObjects !== null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setImageObjects(null)}>
          <Text>Reset</Text>
        </TouchableOpacity>
        {renderImages()}
        <TouchableOpacity onPress={clearDB}>
          <Text>Clear DB</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedImage(null)}>
          <Text>Reset</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TextInput
          onChangeText={(val) => setDescription(val)}
          value={description}
          placeholder="Description"
        />
        <TouchableOpacity onPress={() => save()}>
          <Text>Save Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.imgur.com/TkIrScD.png" }}
        style={styles.logo}
      />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button
        below!
      </Text>

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => pullFromDB()} style={styles.button}>
        <Text style={styles.buttonText}>Pull from Database</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearDB}>
        <Text>Clear DB</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {},
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  instructions: {
    color: "#000",
  },
  button: {},
  buttonText: {},
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
