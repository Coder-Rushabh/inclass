import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ScanQR = ({ route }) => {
  const { userInfo } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTextName}>{userInfo.name}</Text>
        <Text style={styles.userInfoText}> {userInfo.rollNumber}</Text>

        <Text style={styles.userInfoText}>{userInfo.email}</Text>
      </View>

      <View style={styles.qrCodeContainer}>
        <Text style={styles.qrCodeText}>QR Code Scanner Placeholder</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  userInfoContainer: {
    flex: 1,
    backgroundColor: "#E1F5FE",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoTextName: {
    fontSize: 30,
    marginBottom: 5,
    color: "black",
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
  },
  qrCodeContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodeText: {
    fontSize: 20,
    color: "black",
  },
});

export default ScanQR;
