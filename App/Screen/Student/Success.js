import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Success = ({ navigation }) => {
  const handleBack = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/success.png")}
        style={styles.successImage}
      />
      <Text style={styles.successText}>Attendance Successfully Marked!</Text>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back to Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: "#444",
  },
  backButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Success;
