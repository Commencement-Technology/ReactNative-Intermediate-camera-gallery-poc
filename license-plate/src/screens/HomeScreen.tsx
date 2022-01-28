import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DARKPURPLE, GREY, WHITE } from "../utils/constants";

import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Navigation/RootNavigator";

function Home() {
  //navigation state
  const navigation: StackNavigationProp<StackNavigatorParams, "HomeScreen"> =
    useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.navigate("CameraScreen");
        }}
      >
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.navigate("CategoriesScreen");
        }}
      >
        <Text style={styles.buttonText}>View my Pictures</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: GREY,
    paddingTop: 70,
  },
  buttonContainer: {
    backgroundColor: DARKPURPLE,
    width: "60%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: WHITE,
    textAlign: "center",
  },
});

export default Home;
