import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const ScanQR = ({ route }) => {
  const { userInfo } = route.params;
  const navigation = useNavigation();

  const [scannedData, setScannedData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = ({ type, data }) => {
    if (!isScanned && type === BarCodeScanner.Constants.BarCodeType.qr) {
      setScannedData(data);
      console.log('Scanned QR Code:', data);
      setIsScanned(true);
      // Navigate to success.json page
      navigation.navigate('Success');
    }
  };

  const openGallery = async () => {
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    if (mediaLibraryPermission.status !== 'granted' || cameraPermission.status !== 'granted') {
      Alert.alert('Permission denied', 'You need to grant permission to access the media library and camera');
      return;
    }

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
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Image source={require('../../assets/dp.png')} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{userInfo.name}</Text>
          <View style={styles.secondaryInfo}>
            <Text style={styles.secondaryText}>Roll Number: {userInfo.rollNumber}</Text>
            <Text style={styles.secondaryText}>Email: {userInfo.email}</Text>
          </View>
        </View>
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
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 10,
    overflow: 'hidden',
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
    margin: 20,
    borderRadius: 10,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanQR;
