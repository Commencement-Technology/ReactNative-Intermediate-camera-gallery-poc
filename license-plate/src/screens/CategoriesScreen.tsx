import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, ReactElement } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { CommonModal } from "../components/CommonComponents";
import { useAppDispatch } from "../config/store";
import { StackNavigatorParams } from "../Navigation/RootNavigator";
import { RootState } from "../slices";
import { addCategory } from "../slices/picture";
import { DARKPURPLE, GREY, WHITE, windowWidth } from "../utils/constants";

const CategoriesScreen = (): ReactElement => {
  //state for navigation
  const navigation: StackNavigationProp<
    StackNavigatorParams,
    "CategoriesScreen"
  > = useNavigation();

  //state for dispatch and useselector
  const dispatch = useAppDispatch();
  const categories = useSelector(
    (state: RootState) => state.picture.categories
  );

  //state for modal for adding category
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCategory, setNewCategory] = useState("");

  //navigate to perticular category screen after selecting it.
  const onEachCategoryPress = (selectedCategoryId: string) => {
    const foundCategory = categories.find(
      (eachCategory) => eachCategory.id === selectedCategoryId
    );
    if (foundCategory)
      navigation.navigate("EachCategoriesPictureScreen", {
        selectedCategory: foundCategory,
      });
  };

  const categoryModalContent = () => {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.modalText}>Add New Category</Text>
        <View style={styles.modalTextInputContainer}>
          <TextInput
            placeholder="Category name..."
            value={newCategory}
            onChangeText={(text) => setNewCategory(text)}
            style={styles.modalTextInput}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (newCategory) {
              dispatch(addCategory({ newCategory }));
              setShowAddCategoryModal(false);
            } else Alert.alert("Category name required!");
          }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Create a new category</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <CommonModal
        modalContent={categoryModalContent()}
        showModal={showAddCategoryModal}
        setShowModal={setShowAddCategoryModal}
      />
      <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
        Tap on each Category to see category wise photos.
      </Text>
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.eachCategoryContainer}
          onPress={() => {
            navigation.navigate("EachCategoriesPictureScreen");
          }}
        >
          <Text style={styles.eachCategoryHeading}>View All Pictures</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.eachCategoryContainer}
          onPress={() => {
            setShowAddCategoryModal(true);
          }}
        >
          <Text style={styles.eachCategoryHeading}>Add new Category</Text>
        </TouchableOpacity>
        {categories.map((eachCategory, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              key={index}
              style={styles.eachCategoryContainer}
              onPress={() => onEachCategoryPress(eachCategory.id)}
            >
              <Text style={styles.eachCategoryHeading}>
                {eachCategory.label.charAt(0).toUpperCase() +
                  eachCategory.label.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: GREY,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  eachCategoryContainer: {
    width: windowWidth - 40,
    height: 100,
    backgroundColor: WHITE,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eachCategoryHeading: {
    color: DARKPURPLE,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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
  textInputContainer: {
    width: "100%",
  },
  modalTextInputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTextInput: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 7,
    width: "80%",
  },
});
