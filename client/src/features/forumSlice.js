import { createSlice } from "@reduxjs/toolkit";

const forumSlice = createSlice({
  name: "forum",
  initialState: {
    posts: [],
    isLoading: false,
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    addPostToTop(state, action) {
      state.posts.unshift(action.payload); // ✅ Adds new post at the top
    },
  },
});

export const { setPosts, addPostToTop } = forumSlice.actions;
export default forumSlice.reducer;
