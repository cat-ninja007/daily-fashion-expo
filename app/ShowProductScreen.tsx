import React, { FC, useEffect, useState} from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
// import realm from '@/store/realm';
import { AntDesign } from '@expo/vector-icons';
// import { useSearchParams } from 'expo-router/build/hooks';
import { useLocalSearchParams } from 'expo-router';
// import { Product } from '@/store/realm/ProductSchema';

interface Product {
  id: number;
  productName: string;
  imagePath: string;
  category: number;
  description: string;
  price: number;
  instagram: string;
  facebook: string;
  phoneNumber: string;
}

const ShowProductScreen:FC = () => {
  const params = useLocalSearchParams();
  const [ products, setProducts ] = useState<Product[]>([]);

  
  useEffect(() => {
    const data = params.products as unknown as string;
    try {
      const parsedProducts = JSON.parse(data) as Product[];
      setProducts(parsedProducts);
    } catch(error){
      console.error("Failed to parse products: ", error);
    }
    // console.log('This is the parameter', data)  
  }, [params.products])
  return (
    <View style={styles.mainContainer}>
      <FlatList 
        data={products}
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>No products found.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemButton}>
            <View style={styles.productContainer}>
              <Image 
                style={styles.image}
                source={{uri: item.imagePath}}
                />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.productName}</Text>
                <Text style={styles.text}>{item.description}</Text>
                <Text style={styles.text}>{item.price}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <AntDesign name="shoppingcart" size={30} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
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
  emptyListText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 50
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






