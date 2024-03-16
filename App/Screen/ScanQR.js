import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanQR = ({ userInfo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>User Information:</Text>
        <Text style={styles.userInfoText}>Roll Number: {userInfo.rollNumber}</Text>
        <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
        <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
      </View>
      {/* Add QR scanner component here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ScanQR;
