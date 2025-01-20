import React, {FC} from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const ImageZoomScreen = (props) => {
  const { route } = props;

  return (
    <View style={styles.mainContainer}>
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={route.params.imageWidth}
        imageHeight={route.params.imageHeight}
      >
        <Image 
          style={styles.image}
        />
      </ImageZoom>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    backgroundColor: 'black'
  },
  image: {
    width: '100%',
    height: '100%'
  }
})

export default ImageZoomScreen;