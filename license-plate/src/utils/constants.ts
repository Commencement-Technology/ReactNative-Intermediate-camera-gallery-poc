import Constants from "expo-constants";
import { Dimensions } from "react-native";

export const DESIRED_RATIO = "9:16";
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const pkg = Constants.manifest?.releaseChannel
  ? Constants.manifest?.android?.package
  : "host.exp.exponent";

export const BLUE = "#383CC1";
export const GREY = "#ebebeb";
export const WHITE = "#fff";
export const BLACK = "#000";
export const DARKPURPLE = "#050A30";
