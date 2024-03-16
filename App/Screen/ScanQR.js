import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

const ScanQR = ({ route }) => {
  const { userInfo } = route.params;

  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    // Decode the scanned QR code
    if (scannedData) {
      console.log('Scanned QR Code:', scannedData);
    }
  }, [scannedData]);

  const handleScan = ({ data }) => {
    setScannedData(data);
  };

  const openGallery = () => {
    // Options for ImagePicker
    const options = {
      title: 'Select QR Code',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
      },
    };

    // Open gallery
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else {
        // Decode QR code from selected image
        // For now, let's just display an alert with the image uri
        Alert.alert('Selected Image:', response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTextName}>{userInfo.name}</Text>
        <Text style={styles.userInfoText}> {userInfo.rollNumber}</Text>
        <Text style={styles.userInfoText}>{userInfo.email}</Text>
      </View>
      <View style={styles.qrCodeContainer}>
        <RNCamera
          style={styles.cameraPreview}
          onBarCodeRead={handleScan}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
      <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
        <Text style={styles.galleryButtonText}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  userInfoContainer: {
    height: windowHeight * 0.25,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  galleryButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ScanQR;
