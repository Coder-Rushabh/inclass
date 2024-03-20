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
  Alert,
  Platform,
  Button
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  deleteDoc,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import { BackHandler } from "react-native";
import ViewShot from 'react-native-view-shot';
import ShareExtension from 'react-native-share-extension';



const GenerateQR = ({ route, navigation }) => {
  const { adminInfo } = route.params;

  const [subjectName, setSubjectName] = useState("");
  const [qrValue, setQRValue] = useState("");
  const qrCodeRef = useRef(null);

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


  const handleExpireQR = async () => {
    try {
      console.log(qrValue)


      let qrData;
    if (typeof qrValue === 'string') {
      // Parse qrValue if it's a string
      qrData = JSON.parse(qrValue);
    } else {
      qrData = qrValue;
    }


      const uid = qrData?.uid;

      console.log(uid)
      // if (!qrValue || !qrValue.uid) {
      //   console.log("No QR code generated or invalid QR code data");
      //   return;
      // }
  
      // Fetch student details from Firestore
      const studentDetails = await getStudentDetails(uid);

      console.log(studentDetails)

      // Clear QR value and subject name
      setQRValue("");
      setSubjectName("");
  
      // Navigate user to ShowData page and pass student details as props
      navigation.navigate('ShowData', { studentDetails: studentDetails });
  
      // Delete the document associated with the UID
      await deleteCollection(uid);
    } catch (error) {
      console.error("Error expiring QR code:", error);
    }
  };

  const viewShotRef = useRef(null);

  const handleShareQRCode = async () => {
    try {
      // Capture the QR code view as an image
      const uri = await captureQRCode();

      // Share the image using the Share API
      await shareImage(uri);

    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const captureQRCode = async () => {
    return new Promise((resolve, reject) => {
      viewShotRef.current.capture().then(uri => {
        resolve(uri);
      }).catch(error => {
        reject(error);
      });
    });
  };

  const shareImage = async (uri) => {
    const shareOptions = {
      url: uri,
    };

    try {
      if (Platform.OS === 'android') {
        await ShareExtension.open(shareOptions);
      } else {
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };
  
  
  const getStudentDetails = async (uid) => {
    const studentDetails = [];
    console.log("uid", uid);
    
    try {
      // Reference the "attendance" collection and the document with the provided UID

      const querySnapshot = await getDocs(collection(db, "attendance", uid));
    console.log("Query Snapshot:", querySnapshot);

  
      // querySnapshot.forEach((doc) => {
      //   // Push the entire document data into the studentDetails array
      //   studentDetails.push(doc.data());
      // });
      
      return studentDetails;
    } catch (error) {
      console.error("Error fetching student details:", error);
      return []; // Return an empty array in case of an error
    }
  };
  


  
  const deleteCollection = async (uid) => {
    const querySnapshot = await getDocs(collection(db, "attendance", uid));
    console.log("Query Snapshot:", querySnapshot);
    querySnapshot.forEach(async (doc) => {
      console.log("Document Reference:", doc.ref);
      await deleteDoc(doc.ref);
    });
};

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

      const uniqueId = Date.now() + Math.floor(Math.random() * 1000000);
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

      await setDoc(doc(db, "attendance", uniqueId.toString()), {});
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
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
    style={[styles.input, qrValue && styles.disabledInput]} // Apply disabled style if qrValue is truthy
    placeholder="Enter a subject name"
    value={subjectName}
    onChangeText={setSubjectName}
    editable={!qrValue} // Disable editing if qrValue is truthy
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
          style={[styles.button, qrValue && styles.disabledButton]}
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
        <TouchableOpacity style={styles.shareButton} onPress={handleShareQRCode}>
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
  disabledInput: {
    backgroundColor: "#eee", // Change the background color to indicate it's disabled
    color: "#999", // Change the text color to indicate it's disabled
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
