/**
 * @format
 */
import React from 'react';
import {Text, useTheme, View} from 'native-base';
import SafeTouchable from '../../components/SafeTouchable';
import {INavItem} from '../../components/NavigationList';

interface IFilterOptionTitleProps {
  item: INavItem;
  selectedId: string;
  selectOption: (item: INavItem) => void;
}

function FilterOptionListItem(props: IFilterOptionTitleProps) {
  const {item, selectedId, selectOption} = props;
  const {colors} = useTheme();
  const selectedStyle = {
    backgroundColor: colors.blue[500],
    borderRadius: 4,
    padding: 1,
  };
  const nonSelectedStyle = {
    borderColor: colors.blue[500],
    borderRadius: 4,
    borderWidth: 1,
  };

  return (
    <View mx={1}>
      <SafeTouchable
        activeOpacity={1}
        style={item.id === selectedId ? selectedStyle : nonSelectedStyle}
        onPress={() => selectOption(item)}>
        <Text fontSize={15} marginX={2} style={item.id === selectedId && {color: colors.white}}>
          {item.title}
        </Text>
      </SafeTouchable>
    </View>
  );
}

export default FilterOptionListItem;
