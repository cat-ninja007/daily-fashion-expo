import React, { FC } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";
import { useRouter } from "expo-router";
import { imageSlider, categoryList } from "@/data/Data";
import realm from "@/store/realm";
import { Product } from "@/store/realm/ProductSchema";

const Index: FC = () => {
  const router = useRouter();

  const handleIconPress = (categoryId: number) => {
    // Fetch all products from Realm, don't filter here, just pass all products
    const products = realm.objects<Product>("Product").filtered(`category = ${categoryId}`);
    console.log(products)
    router.push(`/ShowProductScreen?products=${JSON.stringify(products)}&categoryId=${categoryId}`);
  };

  
  

  return (
    <View style={styles.mainContainer}>
      <ImageSlider
        data={imageSlider}
        caroselImageStyle={{ resizeMode: "cover", height: 210 }}
        autoPlay={true}
        closeIconColor="#fff"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Categories</Text>
      </View>
      <FlatList
        data={categoryList}
        key={3}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleIconPress(item.id)}
          >
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    marginTop: 2,
    alignItems: "center",
  },
  flatListContainer: {
    padding: 8,
  },
  button: {
    flex: 1,
    margin: 8,
    borderWidth: 1,
    borderColor: "#7CAF58",
    borderRadius: 10,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  itemName: {
    color: "black",
  },
});

export default Index;



// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { ImageSlider } from 'react-native-image-slider-banner'
// import { imageSlider, categoryList } from '@/data/Data';
// import { Image } from 'react-native';
// import { NavigationProp } from '@react-navigation/native';

// interface IndexProps {
//   navigation: NavigationProp<any>;
// }

// const Index: React.FC<IndexProps> = (props) => {
//   const { navigation } = props;

//   return (
//     <View style={styles.mainContainer}>
//       <ImageSlider
//           data={imageSlider}
//           caroselImageStyle={{ resizeMode: 'cover', height: 210 }}
//           autoPlay={true}
//           // onItemChanged={(item) => console.log("item", item)}
//           closeIconColor="#fff"
//       />
//       <View style={styles.titleContainer}>
//         <Text style={styles.text}>
//           Categories
//         </Text>
//       </View>
//       <FlatList 
//         data={categoryList}
//         key={3}
//         numColumns={3}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.flatListContainer}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               // navigation.navigate('ShowProductScreen', { categoryId: item.id });
//               console.log({ categoryId: item.id })
//             }}
//             >
//               <Image
//               source={{ uri: item.icon }}
//               style={styles.icon}
//               />
//               <Text style={styles.itemName} >{item.name}</Text>
//             </TouchableOpacity>
//           )
//           }}
//       />
      
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black'
//   },
//   titleContainer: {
//     marginTop: 2,
//     alignItems: 'center',
//   },
//   flatListContainer: {
//     padding: 8,
//   },
//   button: {
//     flex: 1,
//     margin: 8,
//     borderWidth: 1,
//     borderColor: '#7CAF58',
//     borderRadius: 10,
//     height: 130,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   icon: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain'
//   },
//   itemName: {
//     color: 'black'
//   }
// });

// export default Index;
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
// import { ImageSlider } from 'react-native-image-slider-banner';
// import { imageSlider, categoryList } from '@/data/Data';
// import { useRouter } from 'expo-router';  // Import useRouter hook

// const Index: React.FC = () => {
//   const router = useRouter(); // Use useRouter hook

//   return (
//     <View style={styles.mainContainer}>
//       <ImageSlider
//         data={imageSlider}
//         caroselImageStyle={{ resizeMode: 'cover', height: 210 }}
//         autoPlay={true}
//         closeIconColor="#fff"
//       />
//       <View style={styles.titleContainer}>
//         <Text style={styles.text}>Categories</Text>
//       </View>
//       <FlatList
//         data={categoryList}
//         numColumns={3}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.flatListContainer}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push(`/ShowProductScreen?categoryId=${item.id}`)} // Use router.push for navigation
//           >
//             <Image source={{ uri: item.icon }} style={styles.icon} />
//             <Text style={styles.itemName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   titleContainer: {
//     marginTop: 2,
//     alignItems: 'center',
//   },
//   flatListContainer: {
//     padding: 8,
//   },
//   button: {
//     flex: 1,
//     margin: 8,
//     borderWidth: 1,
//     borderColor: '#7CAF58',
//     borderRadius: 10,
//     height: 130,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   itemName: {
//     color: 'black',
//   },
// });

// export default Index;




