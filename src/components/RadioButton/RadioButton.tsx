// components/RadioButton.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';

type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  label: string;
};

const RadioButton = ({ selected, onPress, label }: RadioButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.outerCircle, selected && styles.selectedOuterCircle]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: Colors.blueIris,
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.blueIris,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default RadioButton;
