import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { InputComponent } from '@/components/InputComponent';
import SelectDropdown from "react-native-select-dropdown";
import { categoryList } from '@/data/Data';
import realm from '@/store/realm';
import { ProductSchema } from '@/store/realm/ProductSchema';

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
  
  const dropdownRef = useRef<SelectDropdown>(null);

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

  const onInputChange = (type: keyof typeof productData, value: string | number) => {
    setProductData({
      ...productData,
      [type]: value
    })
  }

  const saveData = () => {
    if(
      productData.productName === '' || 
      productData.imagePath === '' ||
      productData.description === '' ||
      productData.price === '' ||
      productData.category === null
    ){
      alert('Please fill all your product information!')
    } else if (
      productData.phoneNumber === '' &&
      productData.instagram === '' &&
      productData.facebook === ''
    ){
      alert('Please fill at least one seller contact')
    } else {
      const allData = realm.objects('Product');
      const lastId = allData.length === 0 ? 0 : allData[allData.length - 1].id as number;

      if (isNaN(Number(productData.price)) || productData.price === '') {
        alert('Please provide a valid price!');
        return;
      }

      realm.write(() => {
        realm.create('Product', {
          id: lastId + 1,
          productName: productData.productName,
          imagePath: productData.imagePath,
          category: productData.category,
          description: productData.description,
          price: productData.price ? parseInt(productData.price, 10) : 0, // Default to 0
          instagram: productData.instagram,
          facebook: productData.facebook,
          phoneNumber: productData.phoneNumber,
        });
      });
      console.log('Save data success');
      alert('Successfully save ytour product!')

      setProductData({
        productName: '',
        imagePath: '',
        category: null,
        description: '',
        price: null,
        instagram: '',
        facebook: '',
        phoneNumber: ''
      })

      if (dropdownRef.current) {
        dropdownRef.current.reset(); // reset the dropdown
      }
    };
  };
  

  useEffect(() => {
    console.log(productData);
    }, [productData]);
  
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

        <View style={styles.horizontalContainer}>
          <InputComponent 
            placeholder='Product Name'
            value={productData.productName}
            onChangeText={(text) => onInputChange('productName', text)}
          />

          <SelectDropdown
            data={categoryList}  
            defaultButtonText='Select Category'
            onSelect={(item) => {
              onInputChange('category', item.id)
            }}
            buttonTextAfterSelection={(item) => {
              return item.name
            }}
            rowTextForSelection={(item) => {
              return item.name
            }}
            buttonStyle={styles.selectDropdown}
            buttonTextStyle={styles.selectText}
            ref={dropdownRef}
          />

        
        
        </View>

        <View style={styles.horizontalContainer}>
          <InputComponent 
            placeholder='Description'
            value={productData.description}
            onChangeText={(text) => onInputChange('description', text)}
            isDescription={true}
          />
          <InputComponent 
            placeholder='Price'
            value={(productData.price as number | null)?.toString()}
            onChangeText={(text) => onInputChange('price', text)}
            iconName='dollar'
            keyboardType='numeric'
          />
        </View>

        <Text style={styles.sellerText}>Seller Contact</Text>
        <InputComponent
          placeholder='Whastapp number (ex : +4498739230)'
          value={productData.phoneNumber}
          onChangeText={(text) => onInputChange('phoneNumber', text)}
          iconName='whatsapp'
          keyboardType='phone-pad'
        />
        <InputComponent
          placeholder='Instagram username (ex : @timedooracademy)'
          value={productData.instagram}
          onChangeText={(text) => onInputChange('instagram', text)}
          iconName='instagram'
        />
        <InputComponent
          placeholder='Facebook number (ex: timedooracademy)'
          value={productData.facebook}
          onChangeText={(text) => onInputChange('facebook', text)}
          iconName='facebook-square'
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveData()}
          >
            <Text style={styles.saveText}>SAVE</Text>
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
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sellerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 0,
    color: 'black'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  saveButton: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'mistyrose'
  },
  saveText: {
    color: 'black'
  },

  selectDropdown:{
    borderRadius: 10,
    backgroundColor: 'skyblue',
    width: 150,
    height: 30,
    marginLeft: 8
  },
  selectText: {
    fontSize: 12
  }
});

export default AddProductScreen