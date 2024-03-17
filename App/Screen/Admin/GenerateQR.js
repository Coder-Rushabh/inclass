import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

const GenerateQR = ({ route }) => {
    const { userInfo } = route.params;


    const [subjectName, setSubjectName] = useState('');
  const [qrValue, setQRValue] = useState('');
  const qrCodeRef = useRef(null);

  

  // Function to handle QR generation
  const handleGenerateQR = () => {
    if (!subjectName) {
      // If subject name is empty, return
      return;
    }
    // Generate QR code value using user info and subject name
    const qrData = {
      name: userInfo?.name,
      email: userInfo.email,
      subject: subjectName,
    };
    const qrString = JSON.stringify(qrData);
    setQRValue(qrString);
  };

  const handleExpireQR = () => {
    // Clear QR value to expire the QR code
    setQRValue('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Generate QR Code</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Image source={require('../../../assets/dp.png')} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{userInfo.name}</Text>
          <View style={styles.secondaryInfo}>
            <Text style={styles.secondaryText}>Email: {userInfo.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a subject name"
          value={subjectName}
          onChangeText={setSubjectName}
        />
      </View>

      <View style={styles.qrContainer}>
        {qrValue ? (
          <QRCode
            value={qrValue}
            size={200}
            color="#000"
            backgroundColor="white"
            ref={qrCodeRef}
          />
        ) : (
          <Text style={styles.noQRText}>No QR code generated</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGenerateQR}>
          <Text style={styles.buttonText}>Generate QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.expireButton]} onPress={handleExpireQR}>
          <Text style={styles.buttonText}>Expire QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  secondaryInfo: {
    marginLeft: 20,
  },
  secondaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  expireButton: {
    backgroundColor: '#dc3545', // Change color for expiration button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noQRText: {
    fontSize: 16,
    color: '#777',
  },
});

export default GenerateQR;
