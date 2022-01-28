import React, { useState, useEffect, ReactElement } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";

let camera: Camera | null;

import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import * as IntentLauncher from "expo-intent-launcher";
import {
  DESIRED_RATIO,
  windowWidth,
  windowHeight,
  pkg,
  BLUE,
  GREY,
  WHITE,
  BLACK,
} from "../utils/constants";
import { CameraType, FlashModeType } from "../utils/type";

import { AntDesign } from "@expo/vector-icons";

import CameraPreview from "../components/CameraPreview";
import { useNavigation } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Navigation/RootNavigator";

import { CapturedImageType } from "../utils/type";

function CameraScreen(): ReactElement {
  //navigation state
  const navigation: StackNavigationProp<StackNavigatorParams, "CameraScreen"> =
    useNavigation();

  //states for camera
  const [hasPermission, setHasPermission] = useState<Boolean>(false);
  const [type, setType] = useState<CameraType>(Camera.Constants.Type.back); //state for rear and front camera switch
  const [previewVisible, setPreviewVisible] = useState<Boolean>(false);
  const [capturedImage, setCapturedImage] = useState<CapturedImageType | null>(
    null
  );
  const [flashMode, setFlashMode] = React.useState<FlashModeType>(
    Camera.Constants.FlashMode.off
  );
  const [ratio, setRatio] = useState<string>("");

  //States of modal for choosing category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [savedPicture, setSavedPicture] = useState<CapturedImageType | null>(
    null
  );

  useEffect(() => {
    takePermissions(); //take all permissions first
  }, []);

  useEffect(() => {
    if (savedPicture) setShowCategoryModal(true);
  }, [savedPicture]);

  //take camera access permissions
  const takePermissions = async (): Promise<void> => {
    const cameraAccessPermission = await Camera.requestPermissionsAsync();
    setHasPermission(cameraAccessPermission.status === "granted");
  };

  //prepare aspect ratio for the camera
  const prepareRatio = async (): Promise<void> => {
    if (Platform.OS === "android" && camera) {
      const ratios = await camera.getSupportedRatiosAsync();
      const getRatio =
        ratios.find((ratio) => ratio === DESIRED_RATIO) ||
        ratios[ratios.length - 1];
      setRatio(getRatio);
    }
  };

  //open app settings after denying permissions
  const openAppSettings = (): void => {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
      { data: "package:" + pkg }
    );
  };

  //handle flash state for on and off and auto
  const handleFlashMode = (): void => {
    if (flashMode === Camera.Constants.FlashMode.torch) {
      setFlashMode(Camera.Constants.FlashMode.off);
    } else if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.torch);
    } else {
      setFlashMode(Camera.Constants.FlashMode.auto);
    }
  };

  //take the picture
  const takePicture = async (): Promise<void> => {
    if (!camera) return;
    const options = { quality: 1, fixOrientation: true, skipProcessing: true };
    const photo = await camera.takePictureAsync(options);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  //show the camera screen again
  const retakePicture = (): void => {
    setCapturedImage(null);
    setPreviewVisible(false);
    takePermissions();
  };

  //save the oicture to the gallery and open modal for choosing category
  const savePicture = async (): Promise<void> => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status === "granted") {
      if (capturedImage) {
        MediaLibrary.saveToLibraryAsync(capturedImage.uri); //if given permissions then save the picture
        setSavedPicture(capturedImage);
        if (savedPicture) setShowCategoryModal(true);
      } else {
        return;
      }
    } else {
      permissionNotAllowed(); //if permission not allowed
    }
  };

  //pick image fro device library
  const pickPicture = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      permissionNotAllowed();
    } else {
      permissionAllowed();
    }
  };

  //launch library for selecting picture, if permission is given
  const permissionAllowed = async (): Promise<void> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (result.cancelled) {
      alert("You did not selected any image");
    } else {
      setPreviewVisible(true);
      setCapturedImage(result);
    }
  };

  //Alert the user if permission not allowed
  const permissionNotAllowed = (): void => {
    Alert.alert(
      "Permission required!",
      "Permission is required to acccess media storage ! Please first give permissions from Settings",
      [
        {
          text: "Cancel",
          onPress: () => {
            takePermissions();
          },
          style: "cancel",
        },
        {
          text: "Go to Settings",
          onPress: () => {
            openAppSettings(); //open seetings for specific app
          },
        },
      ]
    );
  };

  //toggle camera type between front and back
  const switchCameraType = (): void => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  //show "No permission" text if permission not given
  if (hasPermission === false) {
    return (
      <View style={styles.noCameraAccessContainer}>
        <Text style={styles.noCameraAccessText}>No Camera Access!</Text>
        <TouchableOpacity
          style={styles.goBackButtonContainer}
          onPress={() => {
            navigation.navigate("HomeScreen");
          }}
        >
          <Text style={styles.goBackButtonText}>Give Permissions!</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          savePicture={savePicture}
          retakePicture={retakePicture}
          showCategoryModal={showCategoryModal}
          setShowCategoryModal={setShowCategoryModal}
          savedPicture={savedPicture}
        />
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          onCameraReady={prepareRatio}
          ratio={ratio}
          flashMode={flashMode}
          ref={(r) => {
            camera = r;
          }}
        >
          <TouchableOpacity
            onPress={handleFlashMode}
            style={[
              styles.flashButton,
              {
                backgroundColor:
                  flashMode === Camera.Constants.FlashMode.off ? BLACK : WHITE,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>⚡️</Text>
          </TouchableOpacity>
          <View style={styles.cameraRollContainer}>
            <TouchableOpacity onPress={pickPicture}>
              <AntDesign name="picture" size={40} color={WHITE} />
            </TouchableOpacity>
          </View>
          <View style={styles.takepictureButtonContainer}>
            <View style={styles.subContainer}>
              <TouchableOpacity
                style={styles.takePictureButton}
                onPress={takePicture}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={switchCameraType}>
              <MaterialIcons
                name="flip-camera-android"
                size={35}
                color={WHITE}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}
export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noCameraAccessContainer: {
    flex: 1,
    backgroundColor: GREY,
    alignItems: "center",
    justifyContent: "center",
  },
  noCameraAccessText: {
    fontSize: 30,
    fontWeight: "bold",
    color: BLACK,
  },
  goBackButtonContainer: {
    backgroundColor: BLUE,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  goBackButtonText: {
    color: WHITE,
  },
  camera: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  cameraRollContainer: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  takepictureButtonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  subContainer: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
  takePictureButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  flashButton: {
    position: "absolute",
    left: "5%",
    top: "10%",
    borderRadius: 150 / 2,
    padding: 2,
  },
});
