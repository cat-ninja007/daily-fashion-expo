import React, { FC, useEffect, useState} from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import realm from '@/store/realm';
import { AntDesign } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';
import { Product } from '@/store/realm/ProductSchema';


const ShowProductScreen: React.FC = () => {
  const { get } = useSearchParams();
  const [products, setProducts] = useState<any[]>([]); // or a more specific type for your products
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const productsParam = get('products');
    const categoryIdParam = get('categoryId');

    if (productsParam) {
      setProducts(JSON.parse(productsParam)); // Parse the products
    }

    if (categoryIdParam) {
      setCategoryId(categoryIdParam); // Set categoryId
    }
  }, []);

  return (
    <View>
      {categoryId && <Text>Category ID: {categoryId}</Text>}
      <FlatList
        data={products} // Render the list of products
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};
// const ShowProductScreen:FC = () => {
//   const { products } = useSearchParams();

//   // Safely parse products
//   let parsedProducts = [];
//   try {
//     if (products) {
//       parsedProducts = JSON.parse(products as string); // Explicit cast
//     }
//   } catch (error) {
//     console.error("Failed to parse products: ", error);
//   }
  
//   // const [ data, setData ] = useState([])

//   // const collectData = () => {
//   //   const allData = realm.objects('Product');
//   //   setData(allData);
//   // }

//   // useEffect(() => {
//   //   const productPage = navigation.addListener('focus', () => {
//   //     collectData()
//   //   })
//   //   return productPage
//   // }, [])
//   return (
//     <View style={styles.mainContainer}>
//       {/* <FlatList
//         data={parsedProducts}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.product}>
//             <Text style={styles.productName}>{item.name}</Text>
//             <Text>{item.description}</Text>
//           </View>
//         )}
//       /> */}
//       {parsedProducts.length > 0 ? (
//         parsedProducts.map((product: any, index: number) => (
//           <Text key={index}>{JSON.stringify(product)}</Text>
//         ))
//       ) : (
//         <Text>No products available.</Text>
//       )}
//       {/* <FlatList 
//         data={productList}
//         contentContainerStyle={styles.flatListContainer}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity style={styles.itemButton}>
//               <View style={styles.productContainer}>
//                 <Image 
//                   style={styles.image}
//                   source={{uri: item.imagePath}}
//                 />
//                 <View style={styles.textContainer}>
//                   <Text style={styles.title}>{item.name}</Text>
//                   <Text style={styles.text}>{item.price}</Text>
//                   <Text style={styles.text}>{item.description}</Text>
//                 </View>
//               </View>
//               <TouchableOpacity>
//                 <AntDesign name="shoppingcart" size={30} color="black" />
//               </TouchableOpacity>
//             </TouchableOpacity>
//           )
//         }}
//       /> */}

//     </View>
//   )
// }

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  flatListContainer:{
    padding: 8
  },
  itemButton: {
    margin: 8,
    padding: 16,
    borderColor: '#7CAFF58',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center'
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    color: 'black',
    fontSize: 16
  },


  product: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ShowProductScreen

// import React, { useState, useEffect} from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
// import realm from "@/store/realm";
// import { useNavigation } from "expo-router";
// import { Product } from "@/store/realm/ProductSchema";

// type ShowProductScreenProps = {
//   route: { params: {categoryId: number}}
// }

// const ShowProductScreen: React.FC<ShowProductScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const category = route.params.categoryId;
//   const [data, setData] = useState<Product[]>([]);

//   const collectData = () => {
//     const allData = realm.objects<Product>('Product').filtered(`category = ${category}`); 
//     setData(allData as unknown as Product[]);

//   }

//   useEffect(() => {
//     const productPage = navigation.addListener('focus', () => {
//       collectData();
//     });
//     return productPage;
//   }, [navigation])
  
//   return (
//     <View style={styles.mainContainer}>
//       <FlatList 
//         data={data}
//         contentContainerStyle={styles.flatListContainer}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity style={styles.itemButton}>
//               <View style={styles.productContainer}>
//                 <Image style={styles.image} source={{ uri: item.imagePath }} />
//                 <View style={styles.textContainer}>
//                   <Text style={styles.title}>{item.productName}</Text>
//                   <Text style={styles.text}>{item.price}</Text>
//                   <Text style={styles.text}>{item.description}</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           )
//         }}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text>No Items</Text>
//           </View>

//         }
//       />

//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   flatListContainer: {
//     padding: 8,
//   },
//   itemButton: {
//     margin: 8,
//     padding: 16,
//     borderColor: '#7CAFF58',
//     borderWidth: 1,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   productContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 16,
//     justifyContent: 'center',
//   },
//   title: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   text: {
//     color: 'black',
//     fontSize: 16,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     margin: 8
//   },
// });

// export default ShowProductScreen


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ListRenderItem,
// } from 'react-native';
// import realm from '@/store/realm';
// import { AntDesign } from '@expo/vector-icons';
// import { NavigationProp, RouteProp } from '@react-navigation/native';
// import { Product } from '@/store/realm/ProductSchema'; // Assuming the Product type is defined elsewhere

// interface ShowProductScreenProps {
//   navigation: NavigationProp<any>; // Replace `any` with your navigation stack type
//   route: RouteProp<any, any>; // Replace `any` with your specific route type if needed
// }

// const ShowProductScreen: React.FC<ShowProductScreenProps> = ({ navigation, route }) => {
//   const [data, setData] = useState<Product[]>([]);

//   // Check if route and params are defined before accessing categoryId
//   const category = route?.params?.categoryId;

//   useEffect(() => {
//     // Check for categoryId presence before calling collectData
//     if (category) {
//       collectData();
//     } else {
//       // Handle the case where categoryId is missing or route params are undefined
//       console.warn('No categoryId found in route params');
//     }
//   }, [category]);

//   const collectData = () => {
//     // Assuming that 'category' is always valid after the check
//     const allData = realm.objects<Product>('Product').filtered(`category = ${category}`);
//     setData(allData as unknown as Product[]); // Cast for TypeScript compatibility
//   };

//   const renderItem: ListRenderItem<Product> = ({ item }) => (
//     <TouchableOpacity style={styles.itemButton}>
//       <View style={styles.productContainer}>
//         <Image style={styles.image} source={{ uri: item.imagePath }} />
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>{item.productName}</Text>
//           <Text style={styles.text}>{item.price}</Text>
//           <Text style={styles.text}>{item.description}</Text>
//         </View>
//       </View>
//       <TouchableOpacity>
//         <AntDesign name="shoppingcart" size={30} color="black" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.mainContainer}>
//       <FlatList
//         data={data}
//         contentContainerStyle={styles.flatListContainer}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   flatListContainer: {
//     padding: 8,
//   },
//   itemButton: {
//     margin: 8,
//     padding: 16,
//     borderColor: '#7CAFF58',
//     borderWidth: 1,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   productContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 16,
//     justifyContent: 'center',
//   },
//   title: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   text: {
//     color: 'black',
//     fontSize: 16,
//   },
// });

// export default ShowProductScreen;






