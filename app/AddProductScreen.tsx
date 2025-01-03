import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

const AddProductScreen = () => {
  
  const [productData, setProductData]= useState({
    productName: '',
    imagePath: '',
    category: null,
    description: '',
    price: null,
    instagram: '',
    facebook: '',
    phoneNumber: ''
  })

  const addImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        allowsEditing: true, // Enable cropping/editing
        quality: 1, // Highest quality
      });
  
      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri; // Get the image URI
        console.log(selectedImageUri); // Log the URI to the terminal
  
        setProductData({
          ...productData,
          imagePath: selectedImageUri, // Update the imagePath in the state
        });
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => addImage()}
          // onPress={() => console.log('pressed')}
        >
          <Image
            style={{ 
              width: productData.imagePath !== '' ? 200 : 50, 
              height: productData.imagePath !== '' ? 200 : 50 }}
            source={{
              uri:  productData.imagePath !== '' ?
                    productData.imagePath
                    :
                    'https://e7.pngegg.com/pngimages/21/312/png-clipart-camera-computer-icons-graphy-camera-icon-camera-lens-camera-icon.png'
              }}
          />
        </TouchableOpacity>
      
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  scroll: {
    margin: 8,
    paddingBottom: 8
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 8
  },
  imageButton: {
    width: 200,
    height: 200,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AddProductScreen