import React from "react";
import { View, StyleSheet } from "react-native";
import Welcome from "../components/Welcome"; // Импортируем компонент

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Welcome />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default HomeScreen;
