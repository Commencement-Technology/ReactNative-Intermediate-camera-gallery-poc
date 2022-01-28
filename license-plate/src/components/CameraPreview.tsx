import React, { ReactElement, useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import { BLACK, DARKPURPLE, WHITE } from "../utils/constants";

import { CapturedImageType } from "../utils/type";
import { CommonModal } from "./CommonComponents";
import { useAppDispatch } from "../config/store";
import { addCategory, addPicture } from "../slices/picture";
import { useSelector } from "react-redux";
import { RootState } from "../slices";

type CameraPreviewProps = {
  photo: CapturedImageType;
  retakePicture: () => void;
  savePicture: () => Promise<void>;
  showCategoryModal: boolean;
  setShowCategoryModal: (arg: boolean) => void;
  savedPicture: CapturedImageType | null;
};

const CameraPreview = ({
  photo,
  retakePicture,
  savePicture,
  showCategoryModal,
  setShowCategoryModal,
  savedPicture,
}: CameraPreviewProps): ReactElement => {
  //state for dispatch and useselector
  const dispatch = useAppDispatch();
  const categories = useSelector(
    (state: RootState) => state.picture.categories
  );

  //state for add category modal
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCategory, setNewCategory] = useState("");

  //save the picture to selected category and close modal
  const savePictureToCategory = (categoryId: string) => {
    if (savedPicture)
      dispatch(
        addPicture({
          categoryId,
          url: savedPicture?.uri,
          height: savedPicture?.height,
          width: savedPicture?.width,
        })
      );
    setShowCategoryModal(false);
    retakePicture();
    Alert.alert(`Saved the picture successfully to selected category`);
  };
  const categoryModalContent = () => {
    return (
      <View>
        <Text style={styles.modalText}>
          Your picture was saved to your mobile gallery successFully.Choose a
          category to save the picture in this app.
        </Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.eachSubCategoryContainer}
            onPress={() => {
              setShowAddCategoryModal(true);
            }}
          >
            <Text style={styles.eachCategoryHeading}>Add new Category</Text>
          </TouchableOpacity>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => savePictureToCategory(item.id)}
                style={styles.eachSubCategoryContainer}
              >
                <Text style={styles.eachCategoryText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  };
  const categoryAddModalContent = () => {
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
          <Text style={styles.buttonText}>Create new category</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.imageContainer}>
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={styles.image}
      >
        <CommonModal
          modalContent={categoryModalContent()}
          showModal={showCategoryModal}
          setShowModal={setShowCategoryModal}
          heightOfModal={400}
        />
        <CommonModal
          modalContent={categoryAddModalContent()}
          showModal={showAddCategoryModal}
          setShowModal={setShowAddCategoryModal}
        />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonSubContainer}>
            <TouchableOpacity
              onPress={retakePicture}
              style={styles.retakeButton}
            >
              <Text style={styles.retakeText}> Re-take </Text>
            </TouchableOpacity>
            {!showCategoryModal ? (
              <TouchableOpacity
                style={styles.savePhotoButton}
                onPress={savePicture}
              >
                <Text style={styles.savePhotoText}> Save </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CameraPreview;

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: BLACK,
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  image: {
    resizeMode: "contain",
    flex: 1,
    width: "100%",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    justifyContent: "flex-end",
  },
  buttonSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  retakeButton: {
    width: 130,
    height: 40,
    alignItems: "center",
    borderRadius: 4,
  },
  retakeText: {
    color: WHITE,
    fontSize: 20,
  },
  savePhotoButton: {
    width: 130,
    height: 40,
    alignItems: "center",
    borderRadius: 4,
  },
  savePhotoText: {
    color: "#fff",
    fontSize: 20,
  },
  modalText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  categoryContainer: {
    backgroundColor: DARKPURPLE,
    borderWidth: 1,
    borderRadius: 15,
    height: 270,
  },
  eachSubCategoryContainer: {
    paddingVertical: 18,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  eachCategoryText: {
    color: WHITE,
    fontWeight: "200",
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
  eachCategoryHeading: {
    color: WHITE,
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
