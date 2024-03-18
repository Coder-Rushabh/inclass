import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Success = ({ route, navigation }) => {
  const { adminDetails } = route.params;

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

      <View style={styles.adminDetailsContainer}>
        <Text style={styles.adminDetailsText}>Admin Name: {adminDetails.name}</Text>
        <Text style={styles.adminDetailsText}>Subject: {adminDetails.subject}</Text>
      </View>


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
  adminDetailsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  adminDetailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Success;
