import { configureStore } from "@reduxjs/toolkit";
import pongReducer from "../components/PingPongGame/pongSlice";

export function makeStore() {
  return configureStore({
    reducer: { pong: pongReducer },
  });
}

const store = makeStore();

export const AppState = store.getState();

export const AppDispatch = store.dispatch;

export default store;
