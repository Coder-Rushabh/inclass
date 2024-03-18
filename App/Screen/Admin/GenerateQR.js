import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Share,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";

const GenerateQR = ({ route }) => {
  const { adminInfo } = route.params;

  const [subjectName, setSubjectName] = useState("");
  const [qrValue, setQRValue] = useState("");
  const qrCodeRef = useRef(null);

  // Function to handle QR generation

  const handleGenerateQR = async () => {
    if (!subjectName) {
      // If subject name is empty, return
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});

      const uniqueId = Date.now() + "-" + Math.floor(Math.random() * 1000000);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0]; // Get only the date part

      const qrData = {
        uid: uniqueId,
        name: adminInfo.name,
        email: adminInfo.email,
        date: formattedDate,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        subject: subjectName,
      };

      const qrString = JSON.stringify(qrData);
      setQRValue(qrString);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleShareQR = async () => {
    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        const uri = await saveQRToDisk();
        if (uri) {
          await Share.share({
            url: uri,
          });
        } else {
          console.log("No QR code available to share.");
        }
      } else {
        console.log("Sharing QR code is not supported on this platform.");
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const saveQRToDisk = async () => {
    try {
      if (!qrValue) return null; // Check if QR value is empty

      const base64Data = qrValue.replace(/^data:image\/png;base64,/, ""); // Remove the data URL prefix
      const path = FileSystem.cacheDirectory + "qrcode.png";

      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return path;
    } catch (error) {
      console.error("Error saving QR code to disk:", error);
      throw error;
    }
  };

  const handleExpireQR = () => {
    // Clear QR value to expire the QR code
    setQRValue("");
    setSubjectName("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Generate QR Code</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Image
          source={require("../../../assets/dp.png")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{adminInfo.name}</Text>
          <View style={styles.secondaryInfo}>
            <Text style={styles.secondaryText}>{adminInfo.email}</Text>
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

      <ScrollView contentContainerStyle={styles.qrContainer}>
        {qrValue ? (
          <QRCode
            value={qrValue}
            size={250}
            color="#000"
            backgroundColor="white"
            ref={qrCodeRef}
          />
        ) : (
          <Text style={styles.noQRText}>No QR code generated</Text>
        )}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
      <TouchableOpacity
  style={[
    styles.button,
    qrValue && styles.disabledButton,
  ]}
  onPress={handleGenerateQR}
  disabled={!!qrValue} // Disable if qrValue is truthy
>
  <Text
    style={[styles.buttonText, qrValue && styles.disabledButtonText]}
  >
    Generate QR
  </Text>
</TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.button,
            styles.expireButton,
            !qrValue && styles.disabledButton,
          ]}
          onPress={handleExpireQR}
          disabled={!qrValue}
        >
          <Text
            style={[styles.buttonText, !qrValue && styles.disabledButtonText]}
          >
            Expire QR
          </Text>
        </TouchableOpacity>
      </View>

      {qrValue ? (
        <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
          <Text style={styles.shareButtonText}>Share QR</Text>
        </TouchableOpacity>
      ) : null}
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
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
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
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  secondaryInfo: {
    marginLeft: 20,
  },
  secondaryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  qrContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noQRText: {
    fontSize: 16,
    color: "#777",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  expireButton: {
    backgroundColor: "#dc3545",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "#999",
  },
  shareButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GenerateQR;
