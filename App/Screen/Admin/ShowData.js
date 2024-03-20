import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';

const ShowData = ({ route, navigation }) => {
  const { studentDetails } = route.params;


  console.log(studentDetails);
  const handleBackPress = () => {
    navigation.goBack();
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

        {studentDetails.map((student, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{student.rollNumber}</DataTable.Cell>
            <DataTable.Cell>{student.name}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
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
});

export default ShowData;
