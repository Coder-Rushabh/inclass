import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert , Platform} from 'react-native';
import { DataTable } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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

const ShowData = ({ route, navigation }) => {
  const { attendanceInfo, qrValue } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
    deleteData();
  };

  const writeToFile = async (data) => {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const randomPrefix = Math.floor(Math.random() * 10000); // Generate random number prefix
      const fileName = `attendanceData_${currentDate}_${randomPrefix}.json`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
  
      // Write data to file in cache directory
      await FileSystem.writeAsStringAsync(filePath, jsonData);
      console.log('File saved successfully:', filePath);
  
      if (Platform.OS === 'android') {
        // Move the file to the device's download folder
        const destinationUri = `${FileSystem.documentDirectory}Download/${fileName}`;
        await FileSystem.moveAsync({ from: filePath, to: destinationUri });
        console.log('File moved to download folder:', destinationUri);
        return destinationUri;
      } else {
        // iOS doesn't support direct access to the download folder, so return the cache directory path
        return filePath;
      }
    } catch (error) {
      console.error('Error writing file:', error);
      return null;
    }
  };
  
  const deleteData = async () => {

    let qrData;
    if (typeof qrValue === "string") {
      // Parse qrValue if it's a string
      qrData = JSON.parse(qrValue);
    } else {
      qrData = qrValue;
    }
    const deleteId = qrData?.uid;
    const deleteIdAsString = deleteId.toString();

    console.log("qrdata :", qrData);
    
    try {
      const documentRef = doc(collection(db, 'attendance'), deleteIdAsString);
      
            await deleteDoc(documentRef);
            console.log("Document successfully deleted!");
         
      console.log("uid deleteData: ", deleteId);
      console.log("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  
  const handleDownload = async () => {
    const filePath = await writeToFile(attendanceInfo);
    if (filePath) {
      // File saved successfully, share it
      Sharing.shareAsync(filePath);
    } else {
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Student Details</Text>
      </View>
    
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Roll Number</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
        </DataTable.Header>

        {attendanceInfo.map((student, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{student.roll}</DataTable.Cell>
            <DataTable.Cell>{student.name}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: 20,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ShowData;
