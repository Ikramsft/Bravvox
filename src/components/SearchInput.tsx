import {Icon, IInputProps, Input, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ISearchProps extends IInputProps {
  placeholder?: string;
  containerStyle?: ViewStyle;
}

function SearchInput(props: ISearchProps) {
  const {colors} = useTheme();
  const {containerStyle} = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        _focus={{borderColor: colors.trueGray[100]}}
        bg={colors.trueGray[100]}
        borderRadius="4"
        borderWidth="1"
        flex={1}
        fontSize="14"
        height={50}
        InputLeftElement={
          <Icon as={<MaterialIcons name="search" />} color="gray.400" m="2" ml="5" size="6" />
        }
        px="1"
        py="3"
        width="100%"
        {...props}
      />
    </View>
  );
}

SearchInput.defaultProps = {
  placeholder: 'Search',
  containerStyle: null,
};

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
});

export default SearchInput;
