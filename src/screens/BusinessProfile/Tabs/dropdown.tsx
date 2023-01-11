import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Actionsheet, useDisclose, Text, Icon, useTheme} from 'native-base';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {INavItem} from '../../../components/NavigationList';
import SafeTouchable from '../../../components/SafeTouchable';

interface IDropDownProps {
  data: INavItem[];
  selectedId: string;
  onSelect: (item: INavItem) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
type IPressHandler = {
  onPickerSelect: (item: INavItem) => void;
};

const DropDown = forwardRef<IPressHandler, IDropDownProps>((props: IDropDownProps, ref) => {
  const {data, selectedId, onSelect, contentContainerStyle} = props;
  useImperativeHandle(ref, () => ({onPickerSelect: onOpen}));
  const {colors} = useTheme();
  const {isOpen, onOpen, onClose} = useDisclose();

  const selectOption = (selectedOption: INavItem) => {
    onClose();
    onSelect(selectedOption);
  };

  return (
    <View
      borderColor={colors.coolGray[500]}
      ref={ref}
      style={[styles.container, contentContainerStyle]}>
      <SafeTouchable style={styles.button} onPress={onOpen}>
        <Text color="gray.400">{data.find(i => i.id === selectedId)?.title}</Text>
        <Icon as={<MaterialCommunityIcons name="chevron-down" />} color="gray.400" size="6" />
      </SafeTouchable>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {data.map(ele => {
            if (ele.id === selectedId) {
              return (
                <Actionsheet.Item
                  endIcon={
                    <Icon
                      as={<MaterialIcons name="check" />}
                      color={colors.red[900]}
                      marginLeft={-15}
                      size="6"
                    />
                  }
                  key={`${ele.id}_dropdown_inside_search`}
                  onPress={() => selectOption(ele)}>
                  <Text color={colors.red[900]} fontSize="md" mr="3" textTransform="capitalize">
                    {ele.title}
                  </Text>
                </Actionsheet.Item>
              );
            }
            return (
              <Actionsheet.Item
                key={`${ele.id}_dropdown_inside_search`}
                onPress={() => selectOption(ele)}>
                <Text fontSize="md" mr="3" textTransform="capitalize">
                  {ele.title}
                </Text>
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});
DropDown.defaultProps = {
  contentContainerStyle: null,
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 2,

    height: 30,
    padding: 3,
    minWidth: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type PickerHandle = React.ElementRef<typeof DropDown>;
export default DropDown;
