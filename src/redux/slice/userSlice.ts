import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UserState {
  value: {
    data: null | {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  };
}

// Define the initial state using that type
const initialState: UserState = {
  value: {
    data: null 
  },
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login:(state, action)=>{
      state.value.data = action.payload
    },
    logout:(state)=>{
      state.value.data = null
      localStorage.removeItem("token")
    }
   
    },
});

export const { login, logout } = userSlice.actions;



export default userSlice.reducer;
