import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [set, onSet] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [temp, setTemp] = useState(0.0);
  var ws = new WebSocket("ws://192.168.0.41:5000");

  ws.onopen = () => {
    // connection opened
    ws.send("something"); // send a message
  };

  ws.onerror = (e) => {
    // an error occurred
    console.log("erroris", e.message);
  };

  ws.onclose = (e) => {
    // connection closed
    console.log(e.code, e.reason);
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  useEffect(() => {
    ws.onmessage = (e) => {
      // a message was received
      setTemp(Math.floor(e.data * 100) / 100);
    };
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
              console.log("hihi");
              ws.onopen = () => {
                // connection opened
                ws.send("something"); // send a message
                console.log("hihi");
              };
            }}
          >
            <View style={styles.Circle}></View>
          </TouchableOpacity>
          {temp < 37.0 ? (
            <View style={styles.normalContainer}>
              <Text style={styles.subText}>온도는 {temp} 입니다.</Text>
              <Text style={styles.subText}>정상입니다.</Text>
            </View>
          ) : (
            <View style={styles.redContainer}>
              <Text style={styles.subText}>온도는 {temp} 입니다.</Text>
              <Text style={styles.subText}>증상이 의심됩니다.</Text>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  Circle: {
    marginTop: 240,
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 150,
  },
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
  normalContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "green",
    alignContent: "center",
    justifyContent: "center",
  },
  redContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "red",
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
