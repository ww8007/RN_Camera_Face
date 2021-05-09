import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [set, onSet] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSet(!set);
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          {set ? (
            <View style={styles.TextContainer}>
              <Text style={styles.subText}>온도는 37도 입니다.</Text>
              <Text style={styles.subText}>정상입니다.</Text>
            </View>
          ) : null}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  TextContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "green",
    alignContent: "center",
    justifyContent: "center",
  },
  subText: {
    textAlign: "center",
    fontSize: 32,
    color: "white",
  },
  button: {
    flex: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
