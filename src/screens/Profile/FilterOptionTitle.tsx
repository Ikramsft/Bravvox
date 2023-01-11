/**
 * @format
 */
import React from 'react';
import {Text, useTheme} from 'native-base';
import SafeTouchable from '../../components/SafeTouchable';

interface IFilterOptionTitleProps {
  title: string;
  optionVisible: boolean;
  onPress: () => void;
}

function FilterOptionTitle(props: IFilterOptionTitleProps) {
  const {title, optionVisible, onPress} = props;
  const {colors} = useTheme();
  const mb = {
    marginBottom: 10,
    color: colors.blue[500],
  };
  return (
    <SafeTouchable activeOpacity={1} onPress={onPress}>
      <Text fontSize={18} style={optionVisible && mb}>
        {title}
      </Text>
    </SafeTouchable>
  );
}

export default FilterOptionTitle;
