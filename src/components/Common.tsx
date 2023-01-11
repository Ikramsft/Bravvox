/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from './SafeTouchable';

interface OptionProps {
  onOpen: () => void;
  size: number;
}
export function OptionIcon(props: OptionProps) {
  const {onOpen} = props;
  return (
    <SafeTouchable onPress={onOpen}>
      <View alignItems="flex-end" height={25} justifyContent="center" width={25}>
        <SimpleLineIcons color="#818488" name="options" {...props} />
      </View>
    </SafeTouchable>
  );
}

export const ProgressImage = createImageProgress(FastImage);
