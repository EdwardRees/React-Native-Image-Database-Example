import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const db = SQLite.openDatabase("db.db");

const Add = () => {
  const [selectedImage, setSelectedImage] = React.useState<null | any>(null);
  const [imageUri, setImageUri] = useState("");
  const [description, setDescription] = useState("");

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
    setSelectedImage(null);
    setDescription("");
    Alert.alert("Successfully added!");
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

  const renderImage = () => {
    if (selectedImage === null) {
      return <View />;
    }
    return (
      <View style={{ padding: 10 }}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TextInput
          style={{ padding: 10, textAlign: "center" }}
          onChangeText={(val) => setDescription(val)}
          value={description}
          placeholder="Description"
        />
        <TouchableOpacity
          onPress={() => save()}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "blue",
            padding: 10,
          }}
        >
          <Text style={{ color: "blue", textAlign: "center" }}>Save Image</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      {renderImage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  instructions: {
    color: "#000",
    textAlign: "center",
  },
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "blue",
    padding: 10,
  },
  buttonText: {
    color: "blue",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export { Add };
