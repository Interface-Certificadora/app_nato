import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";


import { initializeDatabase } from "@/database/initializeDatabase";

export default function RootLayout() {
  return (
    <>
      <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
        <Slot />
      </SQLiteProvider>
    </>
  );
}
