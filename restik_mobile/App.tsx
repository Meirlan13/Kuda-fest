import React from "react";
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen"; // Импортируем HomeScreen

const App = () => {
  return (
    <View style={styles.container}>
      <HomeScreen />
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

export default App;
