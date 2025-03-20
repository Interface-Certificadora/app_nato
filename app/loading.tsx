import React, { createContext, useContext, useState } from "react";
import { View, ActivityIndicator, Modal, Text, StyleSheet } from "react-native";

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
};
export const useLoading = () => useContext(LoadingContext);

const LoadingScreen = () => {
  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});


export default LoadingProvider;