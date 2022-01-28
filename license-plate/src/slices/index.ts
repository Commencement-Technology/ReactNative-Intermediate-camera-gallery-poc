import { combineReducers } from "redux"

import pictureReducer from "./picture"

export const RootReducer = combineReducers({
  picture: pictureReducer,
})
export type RootState = ReturnType<typeof RootReducer>
