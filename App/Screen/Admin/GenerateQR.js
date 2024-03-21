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
  Dimensions,
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
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { BackHandler } from "react-native";
import ViewShot from "react-native-view-shot";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
      console.log(qrValue);

      let qrData;
      if (typeof qrValue === "string") {
        // Parse qrValue if it's a string
        qrData = JSON.parse(qrValue);
      } else {
        qrData = qrValue;
      }
      const uid = qrData?.uid;

      console.log(uid);

      // Clear QR value and subject name
      setQRValue("");
      setSubjectName("");
      fetchData();
      // Navigate user to ShowData page and pass student details as props
      // Delete the document associated with the UID
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
      console.error("Error sharing QR code:", error);
    }
  };

  const captureQRCode = async () => {
    return new Promise((resolve, reject) => {
      viewShotRef.current
        .capture()
        .then((uri) => {
          resolve(uri);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const shareImage = async (uri) => {
    const shareOptions = {
      url: uri,
    };

    try {
      if (Platform.OS === "android") {
        await ShareExtension.open(shareOptions);
      } else {
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error("Error sharing image:", error);
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

  // Function to fetch data from Firestore

  const fetchData = async () => {
    let qrData;
    if (typeof qrValue === "string") {
      // Parse qrValue if it's a string
      qrData = JSON.parse(qrValue);
    } else {
      qrData = qrValue;
    }
    const uiid = qrData?.uid;
    console.log("qrdata :", qrData);
    console.log(uiid);


      try {
        const attendanceQuery = query(collection(db, "attendance"));
        const querySnapshot = await getDocs(attendanceQuery);
        let attendanceIds = []; // Array to store document IDs
        let attendanceInfo = []; // Array to store attendance info objects
      
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const docId = doc.id;
            console.log("docID : ", docId);
      
            attendanceIds.push(docId);
      
            // Extract data from the document
            const data = doc.data();
            const rollNames = Object.entries(data);
      
            // Iterate over each roll and name pair
            rollNames.forEach(([roll, nameObj]) => {
              const name = nameObj.name;
              if (docId == uiid) {
              // Push roll and name object to the attendanceInfo array
              attendanceInfo.push({ roll, name });
              }
            });
      
            console.log(attendanceInfo);
          });
      
          console.log(attendanceInfo);
          navigation.navigate("ShowData", { attendanceInfo: attendanceInfo , qrValue: qrValue});
          console.log("All document IDs:", attendanceIds); // Log the array of IDs
        } else {
          console.log("No documents found in the 'attendance' collection");
        }
  

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to delete data from Firestore
  

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
      

      {/* {qrValue ? (
        <TouchableOpacity style={styles.shareButton} onPress={handleShareQRCode}>
          <Text style={styles.shareButtonText}>Share QR</Text>
        </TouchableOpacity>
      ) : null} */}
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
    paddingVertical: windowHeight * 0.03,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: windowHeight * 0.04,
    fontWeight: "bold",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: windowWidth * 0.05,
    backgroundColor: "#ffffff",
    borderRadius: windowWidth * 0.05,
    marginHorizontal: windowWidth * 0.1,
    marginTop: windowHeight * 0.03,
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
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    borderRadius: windowWidth * 0.075,
    marginRight: windowWidth * 0.05,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    marginLeft: windowWidth * 0.05,
    fontSize: windowHeight * 0.025,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.01,
  },
  secondaryInfo: {
    marginLeft: windowWidth * 0.05,
  },
  secondaryText: {
    fontSize: windowHeight * 0.02,
    color: "#333",
    marginBottom: windowHeight * 0.01,
  },
  inputContainer: {
    paddingHorizontal: windowWidth * 0.05,
    marginTop: windowHeight * 0.03,
  },
  input: {
    height: windowHeight * 0.07,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: windowWidth * 0.05,
    paddingHorizontal: windowWidth * 0.04,
    fontSize: windowHeight * 0.02,
  },
  disabledInput: {
    backgroundColor: "#eee",
    color: "#999",
  },
  qrContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.03,
  },
  noQRText: {
    fontSize: windowHeight * 0.02,
    color: "#777",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: windowWidth * 0.05,
    marginTop: windowHeight * 0.03,
    marginBottom: windowHeight * 0.03,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: windowHeight * 0.03,
    alignItems: "center",
    borderRadius: windowWidth * 0.05,
    flex: 1,
    marginRight: windowWidth * 0.05,
  },
  expireButton: {
    backgroundColor: "#dc3545",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: windowHeight * 0.02,
    fontWeight: "bold",
  },
  disabledButtonText: {
    color: "#999",
  },
  shareButton: {
    backgroundColor: "#007bff",
    paddingVertical: windowHeight * 0.03,
    alignItems: "center",
    borderRadius: windowWidth * 0.05,
    marginHorizontal: windowWidth * 0.05,
    marginBottom: windowHeight * 0.03,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: windowHeight * 0.02,
    fontWeight: "bold",
  },
});

export default GenerateQR;
