import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from '../redux/user/userSlice.js'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({user : userReducer})

const persistConfig = {
    key: "root",
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    // reducer:{
    //     user : userReducer,  // if we add reducer like this it becomes null if we refresh so to get value even after refreshing we use persist Reducer that stores and gets value from local storage
        
    // },
    reducer : persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }),
})

export const persistor = persistStore(store)