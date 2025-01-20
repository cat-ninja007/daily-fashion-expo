import React, { FC, useEffect, useState} from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { MediaComponent } from '@/components/MediaComponent';
import { Linking } from 'react-native';

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
  const [ isBuy, setIsBuy ] = useState(false);
  const [ contact, setContact ] = useState({
    phoneNumber: '',
    instagram: '',
    facebook: ''
  })

  const buyProduct = (
    whatsapp: string, 
    instagramId: string, 
    facebookId: string
  ) => {
    setContact({
      phoneNumber: whatsapp,
      instagram: instagramId,
      facebook: facebookId
    });
    setIsBuy(true);
  }

  // const handleImageZoomPress = (imagePath: string) => {
  //   const image
  // }


  const onClickMedia = (type:string ) => {
    if(type === 'whatsapp'){
      Linking.openURL(`https://wa.me/${contact.phoneNumber}`);
    } else if(type === 'instagram'){
      Linking.openURL(`https://instagram.com/${contact.instagram}`);
    } else if(type === 'facebook'){
      Linking.openURL(`https://facebook.com/${contact.facebook}`);
    }
  }

  
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
  useEffect(() => {
    console.log(isBuy)
  }, [])
  return (
    <View style={styles.mainContainer}>
      <FlatList 
        data={products}
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>No products found.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity 
              style={styles.itemButton}>
              onPress
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
            <TouchableOpacity
              onPress={() => buyProduct(item.phoneNumber, item.instagram, item.facebook)}
            >
              <AntDesign name="shoppingcart" size={30} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {
        isBuy ?
          <View style={styles.modalContainer}>
            <View style={styles.box}>
              <TouchableOpacity 
                onPress={() => setIsBuy(false)}
                style={styles.cancel}
              >
                <AntDesign name="close" size={30} color="black" />
              </TouchableOpacity>
              <Text
                style={[
                  styles.sellerText,
                  styles.title
                ]}
              >
                Contact the seller through this media : 
              </Text>
              {
                contact.phoneNumber !== '' ?
                  <MediaComponent
                    imageSource={require('@/assets/images/whatsapp.png')}
                    value={contact.phoneNumber}
                    onPress={() => onClickMedia('whatsapp')}
                  />
                  :
                  null
              }
              {
                contact.instagram !== '' ?
                  <MediaComponent
                    imageSource={require('@/assets/images/instagram.png')}
                    value={contact.instagram}
                    onPress={() => onClickMedia('instagram')}
                  />
                  :
                  null
              }
              {
                contact.facebook !== '' ?
                  <MediaComponent
                    imageSource={require('@/assets/images/facebook.png')}
                    value={contact.facebook}
                    onPress={() => onClickMedia('facebook')}
                  />
                  :
                  null
              }
            </View>
          </View>
          :
          null
      }
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
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center'
  },
  cancel: {
    padding: 8,
    position: 'absolute',
    right: 8,
    top: 8
  },
  sellerText: {
    marginBottom: 8,
    marginTop: 32
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






