import React from "react";
import  LoadingProvider  from "./loading"; 
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <LoadingProvider>
      <Slot />
    </LoadingProvider>
  );
}
