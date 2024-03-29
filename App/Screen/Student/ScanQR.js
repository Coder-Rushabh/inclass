import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  BackHandler,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as Location from "expo-location";

const ScanQR = ({ route }) => {
  const { userInfo } = route.params;
  const navigation = useNavigation();

  console.log(userInfo);
  const [scannedData, setScannedData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    setIsScanned(false); // Reset isScanned when the component mounts
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const backAction = () => {
      showExitConfirmation();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleScan = async ({ type, data }) => {
    if (!isScanned && type === BarCodeScanner.Constants.BarCodeType.qr) {
      setIsScanned(true);
      console.log("Scanned QR Code:", data);

      try {
        const qrData = JSON.parse(data);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        // Get current location
        const { coords } = await Location.getCurrentPositionAsync({});

        // Check if location matches within 50 meters
        const locationWithinRange =
          Math.abs(qrData.latitude - coords.latitude) <= 0.00045 &&
          Math.abs(qrData.longitude - coords.longitude) <= 0.00045;

        // Check if date matches
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const dateMatches = formattedDate === qrData.date;

        if (locationWithinRange && dateMatches) {
          // Upload student's data to Firestore under UID provided in QR code

          await setDoc(doc(db, "attendance", qrData.uid.toString()), {
            [userInfo.rollNumber]: {
              name: userInfo.name,
            },
          });

          const adminDetails = {
            name: qrData.name,
            subject: qrData.subject,
          };

          // Navigate to success page and pass admin details
          navigation.navigate("Success", { adminDetails : adminDetails });


        } else {
          alert("Location or date mismatch. Attendance not marked.");
        }
      } catch (error) {
        console.error("Error scanning QR code:", error);
        alert("Error scanning QR code. Please try again.");
      }
    }
  };
  
  const openGallery = async () => {
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    if (
      mediaLibraryPermission.status !== "granted" ||
      cameraPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permission denied",
        "You need to grant permission to access the media library and camera"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.cancelled) {
      console.log("Image selection cancelled");
      return;
    }

    if (!result.assets[0].uri) {
      console.log("Selected image URI is undefined");
      return;
    }

    // Pass the selected image URI to handleScan function
    handleScan({
      data: result.assets[0].uri,
      type: BarCodeScanner.Constants.BarCodeType.qr,
    });
  };

  const showExitConfirmation = () => {
    Alert.alert(
      "Exit App",
      "Do you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Exit",
          onPress: () => BackHandler.exitApp(),
          style: "destructive",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Image
          source={require("../../../assets/dp.png")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{userInfo.name}</Text>
          <View style={styles.secondaryInfo}>
            <Text style={styles.secondaryText}>{userInfo.rollNumber}</Text>
            <Text style={styles.secondaryText}>{userInfo.email}</Text>
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
      {/* <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
        <Text style={styles.galleryButtonText}>Open Gallery</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
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
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 20,
  },
  secondaryInfo: {
    marginLeft: 20,
  },
  secondaryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 10,
    overflow: "hidden",
  },
  cameraPreview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  galleryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
  },
  galleryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScanQR;
