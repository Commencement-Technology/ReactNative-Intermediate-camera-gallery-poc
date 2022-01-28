import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  CameraScreen,
  CategoriesScreen,
  HomeScreen,
  EachCategoriesPictureScreen,
} from "../screens";
import { EachCategoryType } from "../utils/type";

export type StackNavigatorParams = {
  HomeScreen: undefined;
  CameraScreen: undefined;
  CategoriesScreen: undefined;
  EachCategoriesPictureScreen:
    | { selectedCategory: EachCategoryType }
    | undefined;
};

const RootStack = createStackNavigator<StackNavigatorParams>();

function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="EachCategoriesPictureScreen"
          component={EachCategoriesPictureScreen}
          options={({ route }) => ({
            //add the title to specific category screen
            title: `${
              route.params?.selectedCategory
                ? route.params.selectedCategory.label
                : "All"
            } Pictures`,
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
