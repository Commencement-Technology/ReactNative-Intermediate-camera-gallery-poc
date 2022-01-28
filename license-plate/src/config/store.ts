import AsyncStorage from "@react-native-async-storage/async-storage"
import { configureStore } from "@reduxjs/toolkit"
import Config from "react-native-config"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistReducer, persistStore } from "redux-persist"
import { PersistConfig } from "redux-persist/es/types"

import { RootReducer, RootState } from "../slices"

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, RootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: Config.ENV === "development"
})
const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export { store, persistor }
