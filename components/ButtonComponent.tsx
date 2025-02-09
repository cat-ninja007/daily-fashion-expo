import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen-hooks";

// Props interface for type safety
interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  color: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ title, onPress, color }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
  },
});

export default ButtonComponent;
