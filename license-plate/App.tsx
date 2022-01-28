import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/config/store";

import RootNavigator from "./src/Navigation/RootNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}

