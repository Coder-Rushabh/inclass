import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScanQR = ({ route }) => {
  const { userInfo } = route.params;

  const [scannedData, setScannedData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);


  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = ({ type, data }) => {
    if (type === BarCodeScanner.Constants.BarCodeType.qr) {
      setScannedData(data);
      console.log('Scanned QR Code:', data);
    }
  };

  const openGallery = async () => {
    // Ask for permission to access the media library
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  const cameraPermission = await Camera.requestCameraPermissionsAsync();

  if (mediaLibraryPermission.status !== 'granted' || cameraPermission.status !== 'granted') {
    Alert.alert('Permission denied', 'You need to grant permission to access the media library and camera');
    return;
  }

    // Open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (result.cancelled) {
      console.log('Image selection cancelled');
      return;
    }
  
    if (!result.uri) {
      console.log('Selected image URI is undefined');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTextName}>{userInfo.name}</Text>
        <Text style={styles.userInfoText}> {userInfo.rollNumber}</Text>
        <Text style={styles.userInfoText}>{userInfo.email}</Text>
      </View>
      <View style={styles.qrCodeContainer}>
        {hasPermission && (
          <BarCodeScanner
            style={styles.cameraPreview}
            onBarCodeScanned={handleScan}
          />
        )}
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
    backgroundColor: '#007bff',
    paddingVertical: 15,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default ScanQR;
