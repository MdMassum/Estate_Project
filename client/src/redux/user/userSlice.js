import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error :null,
};

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateProfileStart:(state)=>{
            state.loading = true;
        },
        updateProfileSuccess:(state, action)=>{
            state.loading=false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateProfileFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload
        },
        deleteStart:(state)=>{
            state.loading = true;
        },
        deleteSuccess:(state)=>{
            state.loading=false;
            state.currentUser = null;
            state.error = null;
        },
        deleteFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload
        },
        signOutStart:(state)=>{
            state.loading = true;
        },
        signOutSuccess:(state)=>{
            state.loading=false;
            state.currentUser = null;
            state.error = null;
        },
        signOutFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload
        },
    }
})
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateProfileSuccess,
    updateProfileFailure,
    updateProfileStart,
    deleteSuccess,
    deleteFailure,
    deleteStart,
    signOutSuccess,
    signOutFailure,
    signOutStart,
} = userSlice.actions
export default userSlice.reducer

