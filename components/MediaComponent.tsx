import React, { FC } from "react";
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";

interface IMediaComponent {
  value: string; // Text to display
  imageSource: ImageSourcePropType; // Image source
  onPress?: () => void; // Optional onPress handler
}

export const MediaComponent: FC<IMediaComponent> = ({ value, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image style={styles.image} source={imageSource} />
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  image: {
    width: 30,
    height: 30,
  },
  text: {
    color: "black",
    fontSize: 18,
    marginLeft: 8,
  },
});
