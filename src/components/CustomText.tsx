import React from 'react';
import { Text, TextProps } from 'react-native';
import Fonts from '../constants/Fonts';

export default function CustomText(props) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'Roboto-Regular' }, props.style]}
    />
  );
}
