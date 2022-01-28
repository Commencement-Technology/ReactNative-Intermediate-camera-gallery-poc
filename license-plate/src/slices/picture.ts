import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import "react-native-get-random-values";
import { EachCategoryType } from "../utils/type";

const { v4: uuidv4 } = require("uuid");

export type EachPictureType = {
  categoryId: string;
  url: string;
  height: Number;
  width: Number;
  id:string
};

type PictureState = {
  pictures: EachPictureType[];
  categories: EachCategoryType[];
};
export const initialState: PictureState = {
  pictures: [],
  categories: [
    {
      label: "Favourite",
      id: uuidv4(),
    },
    {
      label: "Landscape",
      id: uuidv4(),
    },
    {
      label: "Portrait",
      id: uuidv4(),
    },
    {
      label: "Abstract",
      id: uuidv4(),
    },
  ],
};

const pictureSlice = createSlice({
  name: "picture",
  initialState,
  reducers: {
    reset: () => initialState,
    addCategory: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          id: string
          newCategory: string
        }>
      ) => {
        //add the new category to our categories state in redux store
        state.categories.push({label:payload.newCategory,id:payload.id})
      },
      prepare: ({ newCategory }: { newCategory: string }) => ({
        //first prepare the payload by assigning id to them and then send this payload to the reducer above.
        payload: {
          id: uuidv4(),
          newCategory,
        },
      }),
    },
    addPicture: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          categoryId: string;
          url: string;
          height: Number;
          width: Number;
          id: string;
        }>
      ) => {
        //add the picture to our pictures state in redux store
        state.pictures.push(payload);
      },
      prepare: ({
        categoryId,
        url,
        height,
        width,
      }: {
        categoryId: string;
        url: string;
        height: Number;
        width: Number;
      }) => ({
        //first prepare the payload by assigning id to them and then send this payload to the reducer above.
        payload: {
          id: uuidv4(),
          categoryId,
          url,
          height,
          width,
        },
      }),
    },
     removePicture: (state, { payload }: PayloadAction<{ id: string }>) => {
      //find the respective picture from pictures state in redux store by id, and remove that picture.
      const index = state.pictures.findIndex((obj) => {
        return obj.id === payload.id;
      });

      if (index !== -1) {
        state.pictures.splice(index, 1);
      }
    },
  },
});
export default pictureSlice.reducer;

export const {
  addPicture,
  addCategory,
  removePicture,
  reset: resetPicturesData,
} = pictureSlice.actions;
