import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginModal: false,
  modalType: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
    },
    setModalType: (state, action) => {
      state.modalType = action.payload; // "login" or "signup"
    },
  },
});

export const { setShowLoginModal } = uiSlice.actions;
export const { setModalType } = uiSlice.actions;
export default uiSlice.reducer;
