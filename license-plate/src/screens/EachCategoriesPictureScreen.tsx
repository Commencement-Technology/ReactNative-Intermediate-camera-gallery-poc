import { RouteProp, useRoute } from "@react-navigation/native";
import React, { ReactElement, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StackNavigatorParams } from "../Navigation/RootNavigator";
import { DARKPURPLE, GREY, WHITE, windowWidth } from "../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../slices";
import { addPicture, EachPictureType, removePicture } from "../slices/picture";
import { CommonModal, NoRecordsCard } from "../components/CommonComponents";
import { useAppDispatch } from "../config/store";
import { Entypo } from "@expo/vector-icons";

const EachCategoriesPictureScreen = (): ReactElement => {
  //state for route and navigation
  const route: RouteProp<StackNavigatorParams, "EachCategoriesPictureScreen"> =
    useRoute();
  const selectedCategory = route.params?.selectedCategory;

  //state for dispatch and useselector
  const dispatch = useAppDispatch();
  const pictures = useSelector((state: RootState) => state.picture.pictures);

  //state for delete picture modal
  const [showDeletePictureModal, setShowDeletePictureModal] =
    useState<boolean>(false);
  const [selectedPicture, setSelectedPicture] =
    useState<EachPictureType | null>(null);

  useEffect(() => {
    if (selectedPicture) setShowDeletePictureModal(true);
  }, [selectedPicture]);

  //if cross is clicked, clear the states and close modal
  const onCloseFunction = () => {
    setShowDeletePictureModal(false);
    setSelectedPicture(null);
  };

  const deleteModalContent = () => {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.modalText}>Delete this picture?</Text>
        <TouchableOpacity
          onPress={() => {
            if (selectedPicture)
              dispatch(
                removePicture({
                  id: selectedPicture?.id,
                })
              );
            onCloseFunction();
            alert("Picture deleted successfully");
          }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onCloseFunction();
          }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <CommonModal
        modalContent={deleteModalContent()}
        showModal={showDeletePictureModal}
        setShowModal={setShowDeletePictureModal}
        heightOfModal={200}
        onCloseFunction={onCloseFunction}
      />
      {pictures.filter((eachPicture) =>
        selectedCategory
          ? eachPicture.categoryId === selectedCategory.id
          : eachPicture
      ).length === 0 ? (
        <View style={{ alignItems: "center" }}>
          <NoRecordsCard
            text={`No ${
              selectedCategory ? selectedCategory?.label : "All"
            } Pictures added`}
          />
        </View>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {pictures
            .filter((eachPicture) =>
              selectedCategory
                ? eachPicture.categoryId === selectedCategory.id
                : eachPicture
            )
            .map((picture, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={index}
                  style={styles.eachPictureContainer}
                  onPress={() => setShowDeletePictureModal}
                >
                  <Image
                    style={{
                      resizeMode: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    source={{ uri: picture.url }}
                  ></Image>
                  <TouchableOpacity
                    onPress={() => setSelectedPicture(picture)}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  >
                    <Entypo name="cross" size={28} color={DARKPURPLE} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </ScrollView>
  );
};
export default EachCategoriesPictureScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: GREY,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  eachPictureContainer: {
    width: windowWidth / 2 - 30,
    height: 200,
    backgroundColor: WHITE,
    marginRight: 10,
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
  modalText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
