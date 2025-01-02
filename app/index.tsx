import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ImageSlider } from 'react-native-image-slider-banner'
import { imageSlider } from '@/data/Data';
import { Image } from 'react-native';



const Index: React.FC = () => {
  return (
    <View style={styles.mainContainer}>
      <ImageSlider
          data={imageSlider}
          caroselImageStyle={{ resizeMode: 'cover', height: 250 }}
          autoPlay={true}
          // onItemChanged={(item) => console.log("item", item)}
          closeIconColor="#fff"
      />
      
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 0,
  },
});

export default Index;
