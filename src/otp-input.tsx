import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  length: number;
  value: string;
  onChange: (e: string) => void;
  inputStyles?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const OtpInput = ({ length, value, onChange, inputStyles, containerStyle }: Props) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [values, setValues] = useState<string[]>([]);

  const handleTextChange = async (text: string, index: number) => {
    const existingValues = [...values];
    existingValues[index] = text;
    setValues(existingValues);
    onChange(existingValues.join(""));
  }

  const handleKeyPressed = async (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      const vals = [...values];
      vals[index] = "";
      setValues(vals);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else {
      if (index <= length) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  useEffect(() => {
    setValues([]);
    Array.from({ length }).forEach((_) => {
      setValues(prev => ([...prev, ""]))
    })
  }, [length]);

  useEffect(() => {
    let vals = [...values];
    Array.from({ length }).forEach((_, index) => {
      vals[index] = value[index];
    });
    setValues(vals);
  }, [value]);

  return (
    <View style={containerStyle || styles.inputContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={el => { inputRefs.current[index] = el }}
          style={[inputStyles || styles.input]}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(e) => handleTextChange(e, index)}
          onKeyPress={(e) => handleKeyPressed(e, index)}
          value={values[index]}
        />
      ))}
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "center"
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row"
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    height: 50,
    width: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    textAlign: "center"
  }
});

export default OtpInput