import React, { FC, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { InputComponent } from '@/components/InputComponent';
import SelectDropdown from "react-native-select-dropdown";
import { categoryList } from '@/data/Data';
import { useLocalSearchParams } from 'expo-router';
import realm from '@/store/realm';
import { Product } from '@/store/realm/ProductSchema';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-hooks";
import { useRouter } from 'expo-router';

const EditProductScreen: FC = () => {
  const router = useRouter()
  const params = useLocalSearchParams();
  const productString = params.product as string;
  const initialProduct: Product = JSON.parse(productString);
  // const product: Product = JSON.parse(productString);

  const [productData, setProductData] = useState<Product>(initialProduct);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(
    categoryList.findIndex(item => item.id === initialProduct.category)
  );
  const dropdownRef = useRef<SelectDropdown>(null);

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProductData({
        ...productData,
        imagePath: result.assets[0].uri,
      });
    }
  };

  const onInputChange = (type: keyof Product, value: string | number) => {
    setProductData({
      ...productData,
      [type]: value,
    });
  };

  const saveData = () => {
    if(
      productData.productName === '' || 
      productData.imagePath === '' ||
      productData.description === '' ||
      productData.price === null ||
      productData.category === null
    ){
      Alert.alert('Error', 'Please fill all your product information!');
      return;
    }
  
    if (
      productData.phoneNumber === '' &&
      productData.instagram === '' &&
      productData.facebook === ''
    ){
      Alert.alert('Error', 'Please fill at least one seller contact');
      return;
    }
  
    if (isNaN(Number(productData.price))) {
      Alert.alert('Error', 'Please provide a valid price!');
      return;
    }
  
    const productToUpdate = realm.objectForPrimaryKey('Product', productData.id);
    if (productToUpdate) {
      realm.write(() => {
        productToUpdate.productName = productData.productName;
        productToUpdate.imagePath = productData.imagePath;
        productToUpdate.category = Number(productData.category);
        productToUpdate.description = productData.description;
        productToUpdate.price = Number(productData.price);
        productToUpdate.instagram = productData.instagram;
        productToUpdate.facebook = productData.facebook;
        productToUpdate.phoneNumber = productData.phoneNumber;
      });
  
      Alert.alert('Success', 'Product updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/')  // Use 'replace' or 'push' depending on your requirement
        }
      ]);
    } else {
      Alert.alert('Error', 'Product not found!');
    }
  };

  useEffect(() => {
    // Check if the params.product changes and update state accordingly
    const newProductData = JSON.parse(params.product as string);
    setProductData(newProductData);
    console.log('Receive product for edit: ', newProductData);

    // Reset the dropdown to show the correct category
    if (dropdownRef.current) {
      dropdownRef.current.reset(); // This may not set the correct value, so we might need to manually set it
      // Force the dropdown to select the correct item
      setSelectedCategoryIndex(categoryList.findIndex(item => item.id === newProductData.category));
    }
  }, [params.product])
  

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={addImage}>
            <Image
              style={{
                width: productData.imagePath ? wp('50%') : 50,
                height: productData.imagePath ? wp('50%') : 50,
              }}
              source={{
                uri: productData.imagePath ||
                     'https://e7.pngegg.com/pngimages/21/312/png-clipart-camera-computer-icons-graphy-camera-icon-camera-lens-camera-icon.png',
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

          {/* <SelectDropdown
            data={categoryList}
            defaultButtonText='Select Category'
            onSelect={(item, index) => onInputChange('category', categoryList[index].id)}
            buttonTextAfterSelection={(selectedItem) => selectedItem.name}
            rowTextForSelection={(item) => item.name}
            buttonStyle={styles.selectDropdown}
            buttonTextStyle={styles.selectText}
            ref={dropdownRef}
          /> */}
          <SelectDropdown
            data={categoryList}
            defaultValueByIndex={categoryList.findIndex(item => item.id === productData.category)}
            onSelect={(selectedItem, index) => setProductData({
              ...productData,
              category: categoryList[index].id
            })}
            buttonTextAfterSelection={(selectedItem) => selectedItem.name}
            rowTextForSelection={(item) => item.name}
            ref={dropdownRef}
            buttonStyle={styles.selectDropdown}
            buttonTextStyle={styles.selectText}
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
            value={String(productData.price)}
            onChangeText={(text) => onInputChange('price', text)}
            iconName='dollar'
            keyboardType='numeric'
          />
        </View>

        <Text style={styles.sellerText}>Seller Contact</Text>
        <InputComponent
          placeholder='WhatsApp number (ex: +4498739230)'
          value={productData.phoneNumber}
          onChangeText={(text) => onInputChange('phoneNumber', text)}
          iconName='whatsapp'
          keyboardType='phone-pad'
        />
        <InputComponent
          placeholder='Instagram username (ex: @timedooracademy)'
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
          <TouchableOpacity style={styles.saveButton} onPress={saveData}>
            <Text style={styles.saveText}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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
    width: wp('50%'),
    height: wp('50%'),
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sellerText: {
    fontSize: hp('2.5%'),
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
    width: wp('40%'),
    height: hp('4%'),
    marginLeft: 8
  },
  selectText: {
    fontSize: hp('1.5%')
  }
});

export default EditProductScreen;


// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { InputComponent } from '@/components/InputComponent';
// import SelectDropdown from 'react-native-select-dropdown';
// import { categoryList } from '@/data/Data';
// import realm from '@/store/realm';
// import { useLocalSearchParams } from 'expo-router';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen-hooks';
// import { UpdateMode } from 'realm';

// const EditProductScreen = () => {
//   const params = useLocalSearchParams();  // Retrieve the passed product data
//   const [productData, setProductData] = useState({
//     id: null,
//     productName: '',
//     imagePath: '',
//     category: null,
//     description: '',
//     price: '',
//     instagram: '',
//     facebook: '',
//     phoneNumber: '',
//   });

//   const dropdownRef = useRef<SelectDropdown>(null);

//   useEffect(() => {
//     // Pre-fill form with passed product data
//     if (params.productData) {
//       const parsedData = JSON.parse(params.productData as string);
//       setProductData(parsedData);
//     }
//   }, [params.productData]);

//   const addImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         const selectedImageUri = result.assets[0].uri;
//         setProductData({ ...productData, imagePath: selectedImageUri });
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//     }
//   };

//   const onInputChange = (type: keyof typeof productData, value: string | number) => {
//     setProductData({
//       ...productData,
//       [type]: value,
//     });
//   };

//   const updateData = () => {
//     if (
//       !productData.productName ||
//       !productData.imagePath ||
//       !productData.description ||
//       !productData.price ||
//       productData.category === null
//     ) {
//       alert('Please fill all the product information!');
//       return;
//     }

//     if (!productData.phoneNumber && !productData.instagram && !productData.facebook) {
//       alert('Please fill at least one seller contact.');
//       return;
//     }

//     realm.write(() => {
//       realm.create('Product', {
//         id: productData.id ?? realm.objects('Product').length + 1,  // Handle existing or new products
//         productName: productData.productName,
//         imagePath: productData.imagePath,
//         category: productData.category,
//         description: productData.description,
//         price: parseInt(productData.price as string, 10),
//         instagram: productData.instagram,
//         facebook: productData.facebook,
//         phoneNumber: productData.phoneNumber,
//       }, UpdateMode.Modified);
//     });

//     alert('Successfully updated the product!');
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <View style={styles.imageContainer}>
//           <TouchableOpacity style={styles.imageButton} onPress={addImage}>
//             <Image
//               style={{
//                 width: productData.imagePath ? wp('50%') : 50,
//                 height: productData.imagePath ? wp('50%') : 50,
//               }}
//               source={{
//                 uri: productData.imagePath || 'https://e7.pngegg.com/pngimages/21/312/png-clipart-camera-computer-icons-graphy-camera-icon-camera-lens-camera-icon.png',
//               }}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.horizontalContainer}>
//           <InputComponent
//             placeholder="Product Name"
//             value={productData.productName}
//             onChangeText={(text) => onInputChange('productName', text)}
//           />

//           <SelectDropdown
//             ref={dropdownRef}
//             data={categoryList}
//             defaultValue={categoryList.find((item) => item.id === productData.category) || null}
//             defaultButtonText="Select Category"
//             onSelect={(item) => onInputChange('category', item.id)}
//             buttonTextAfterSelection={(item) => item.name}
//             rowTextForSelection={(item) => item.name}
//             buttonStyle={styles.selectDropdown}
//             buttonTextStyle={styles.selectText}
//           />
//         </View>

//         <View style={styles.horizontalContainer}>
//           <InputComponent
//             placeholder="Description"
//             value={productData.description}
//             onChangeText={(text) => onInputChange('description', text)}
//             isDescription={true}
//           />
//           <InputComponent
//             placeholder="Price"
//             value={productData.price}
//             onChangeText={(text) => onInputChange('price', text)}
//             iconName="dollar"
//             keyboardType="numeric"
//           />
//         </View>

//         <Text style={styles.sellerText}>Seller Contact</Text>
//         <InputComponent
//           placeholder="WhatsApp Number (ex: +4498739230)"
//           value={productData.phoneNumber}
//           onChangeText={(text) => onInputChange('phoneNumber', text)}
//           iconName="whatsapp"
//           keyboardType="phone-pad"
//         />
//         <InputComponent
//           placeholder="Instagram Username (ex: @timedooracademy)"
//           value={productData.instagram}
//           onChangeText={(text) => onInputChange('instagram', text)}
//           iconName="instagram"
//         />
//         <InputComponent
//           placeholder="Facebook Username (ex: timedooracademy)"
//           value={productData.facebook}
//           onChangeText={(text) => onInputChange('facebook', text)}
//           iconName="facebook-square"
//         />

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.saveButton} onPress={updateData}>
//             <Text style={styles.saveText}>UPDATE</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   scroll: {
//     margin: 8,
//     paddingBottom: 8,
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   imageButton: {
//     width: wp('50%'),
//     height: wp('50%'),
//     borderWidth: 0.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   horizontalContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   sellerText: {
//     fontSize: hp('2.5%'),
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginLeft: 8,
//     marginBottom: 0,
//     color: 'black',
//   },
//   buttonContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   saveButton: {
//     marginTop: 16,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: 'mistyrose',
//   },
//   saveText: {
//     color: 'black',
//   },
//   selectDropdown: {
//     borderRadius: 10,
//     backgroundColor: 'skyblue',
//     width: wp('40%'),
//     height: hp('4%'),
//     marginLeft: 8,
//   },
//   selectText: {
//     fontSize: hp('1.5%'),
//   },
// });

// export default EditProductScreen;


// // import React, { useState, useEffect, useRef } from 'react';
// // import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
// // import * as ImagePicker from 'expo-image-picker';
// // import { InputComponent } from '@/components/InputComponent';
// // import SelectDropdown from 'react-native-select-dropdown';
// // import { categoryList } from '@/data/Data';
// // import realm from '@/store/realm';
// // import { useLocalSearchParams } from 'expo-router';
// // import {
// //   widthPercentageToDP as wp,
// //   heightPercentageToDP as hp,
// // } from 'react-native-responsive-screen-hooks';
// // import { UpdateMode } from 'realm';

// // const EditProductScreen = () => {
// //   const params = useLocalSearchParams();  // Retrieve the passed product data
// //   const [productData, setProductData] = useState({
// //     id: null,
// //     productName: '',
// //     imagePath: '',
// //     category: null,
// //     description: '',
// //     price: '',
// //     instagram: '',
// //     facebook: '',
// //     phoneNumber: '',
// //   });

// //   const dropdownRef = useRef<SelectDropdown>(null);

// //   useEffect(() => {
// //     // Pre-fill form with passed product data
// //     if (params.productData) {
// //       const parsedData = JSON.parse(params.productData as string);
// //       setProductData(parsedData);
// //     }
// //   }, [params.productData]);

// //   const addImage = async () => {
// //     try {
// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         quality: 1,
// //       });

// //       if (!result.canceled) {
// //         const selectedImageUri = result.assets[0].uri;
// //         setProductData({ ...productData, imagePath: selectedImageUri });
// //       }
// //     } catch (error) {
// //       console.error('Error picking image:', error);
// //     }
// //   };

// //   const onInputChange = (type: keyof typeof productData, value: string | number) => {
// //     setProductData({
// //       ...productData,
// //       [type]: value,
// //     });
// //   };

// //   const saveData = () => {
// //     if (
// //       !productData.productName ||
// //       !productData.imagePath ||
// //       !productData.description ||
// //       !productData.price ||
// //       productData.category === null
// //     ) {
// //       alert('Please fill all the product information!');
// //       return;
// //     }

// //     if (!productData.phoneNumber && !productData.instagram && !productData.facebook) {
// //       alert('Please fill at least one seller contact.');
// //       return;
// //     }

// //     realm.write(() => {
// //       realm.create('Product', {
// //         id: productData.id ?? realm.objects('Product').length + 1, // Handle existing or new products
// //         productName: productData.productName,
// //         imagePath: productData.imagePath,
// //         category: productData.category,
// //         description: productData.description,
// //         price: parseInt(productData.price as string, 10),
// //         instagram: productData.instagram,
// //         facebook: productData.facebook,
// //         phoneNumber: productData.phoneNumber,
// //       }, UpdateMode.Modified);
// //     });
// //     alert('Successfully saved the product!');
// //   };

// //   return (
// //     <View style={styles.mainContainer}>
// //       <ScrollView contentContainerStyle={styles.scroll}>
// //         <View style={styles.imageContainer}>
// //           <TouchableOpacity style={styles.imageButton} onPress={addImage}>
// //             <Image
// //               style={{
// //                 width: productData.imagePath ? wp('50%') : 50,
// //                 height: productData.imagePath ? wp('50%') : 50,
// //               }}
// //               source={{
// //                 uri: productData.imagePath || 'https://e7.pngegg.com/pngimages/21/312/png-clipart-camera-computer-icons-graphy-camera-icon-camera-lens-camera-icon.png',
// //               }}
// //             />
// //           </TouchableOpacity>
// //         </View>

// //         <View style={styles.horizontalContainer}>
// //           <InputComponent
// //             placeholder="Product Name"
// //             value={productData.productName}
// //             onChangeText={(text) => onInputChange('productName', text)}
// //           />

// //           <SelectDropdown
// //             ref={dropdownRef}
// //             data={categoryList}
// //             defaultValue={categoryList.find((item) => item.id === productData.category) || null}
// //             defaultButtonText="Select Category"
// //             onSelect={(item) => onInputChange('category', item.id)}
// //             buttonTextAfterSelection={(item) => item.name}
// //             rowTextForSelection={(item) => item.name}
// //             buttonStyle={styles.selectDropdown}
// //             buttonTextStyle={styles.selectText}
// //           />
// //         </View>

// //         <View style={styles.horizontalContainer}>
// //           <InputComponent
// //             placeholder="Description"
// //             value={productData.description}
// //             onChangeText={(text) => onInputChange('description', text)}
// //             isDescription={true}
// //           />
// //           <InputComponent
// //             placeholder="Price"
// //             value={productData.price}
// //             onChangeText={(text) => onInputChange('price', text)}
// //             iconName="dollar"
// //             keyboardType="numeric"
// //           />
// //         </View>

// //         <Text style={styles.sellerText}>Seller Contact</Text>
// //         <InputComponent
// //           placeholder="WhatsApp Number (ex: +4498739230)"
// //           value={productData.phoneNumber}
// //           onChangeText={(text) => onInputChange('phoneNumber', text)}
// //           iconName="whatsapp"
// //           keyboardType="phone-pad"
// //         />
// //         <InputComponent
// //           placeholder="Instagram Username (ex: @timedooracademy)"
// //           value={productData.instagram}
// //           onChangeText={(text) => onInputChange('instagram', text)}
// //           iconName="instagram"
// //         />
// //         <InputComponent
// //           placeholder="Facebook Username (ex: timedooracademy)"
// //           value={productData.facebook}
// //           onChangeText={(text) => onInputChange('facebook', text)}
// //           iconName="facebook-square"
// //         />

// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity style={styles.saveButton} onPress={saveData}>
// //             <Text style={styles.saveText}>SAVE</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   mainContainer: {
// //     flex: 1,
// //     backgroundColor: 'white',
// //   },
// //   scroll: {
// //     margin: 8,
// //     paddingBottom: 8,
// //   },
// //   imageContainer: {
// //     alignItems: 'center',
// //     marginVertical: 8,
// //   },
// //   imageButton: {
// //     width: wp('50%'),
// //     height: wp('50%'),
// //     borderWidth: 0.5,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   horizontalContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-end',
// //   },
// //   sellerText: {
// //     fontSize: hp('2.5%'),
// //     fontWeight: 'bold',
// //     marginTop: 16,
// //     marginLeft: 8,
// //     marginBottom: 0,
// //     color: 'black',
// //   },
// //   buttonContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 8,
// //   },
// //   saveButton: {
// //     marginTop: 16,
// //     borderWidth: 1,
// //     borderRadius: 5,
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     backgroundColor: 'mistyrose',
// //   },
// //   saveText: {
// //     color: 'black',
// //   },
// //   selectDropdown: {
// //     borderRadius: 10,
// //     backgroundColor: 'skyblue',
// //     width: wp('40%'),
// //     height: hp('4%'),
// //     marginLeft: 8,
// //   },
// //   selectText: {
// //     fontSize: hp('1.5%'),
// //   },
// // });

// // export default EditProductScreen;
