import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";

const Welcome = () => {
  return (
    <View style={styles.container}>
      {/* Логотип */}
      <Image source={require("../assets/Group_20.png")} style={styles.logo} />

      {/* Основной текст */}
      <Text style={styles.text}>фестиваль breakfast в Алматы</Text>
      <Text style={styles.text}>11.01.2025 - 02.02.2025</Text>
      <Text style={styles.text}>завтраки целый день за 3500 тенге</Text>

      {/* Информация */}
      <Text style={styles.description}>
        KUDAFEST — это гастрономический фестиваль, который обязательно порадует любителей вкусных блюд и качественных напитков.
      </Text>

      {/* Ссылки */}
      <View style={styles.links}>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com/kudafest")}>
          <Image source={require("../assets/inst-logo.png")} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL("https://t.me/kudafest")}>
          <Image source={require("../assets/tg-logo.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "gray",
  },
  links: {
    flexDirection: "row",
    marginTop: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginHorizontal: 10,
  },
});

export default Welcome;
