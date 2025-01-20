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
    // console.log(products)
    router.push({
      pathname: "/ShowProductScreen",
      params: { products: JSON.stringify(Array.from(products)) },
    });
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




