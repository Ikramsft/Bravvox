import React from 'react';
import {StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {Text, View} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {theme} from '../theme';

interface IDropDownInputProps {
  onPress: () => void;
  label: string;
  value: string;
  containerStyle?: ViewStyle;
}

function DropDownInput(props: IDropDownInputProps) {
  const {onPress, label, value, containerStyle} = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[containerStyle, styles.selectSocialView]}
      onPress={onPress}>
      <View style={styles.textStyle}>
        <Text style={styles.labelStyle}>{label}</Text>
        <Text>{value}</Text>
      </View>
      <Feather
        color={theme.colors.blue[600]}
        name="chevron-down"
        size={18}
        style={styles.downArrowStyle}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectSocialView: {
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    borderBottomColor: theme.colors.gray[300],
    alignItems: 'center',
    paddingBottom: 6,
  },
  textStyle: {
    flex: 1,
  },
  labelStyle: {
    fontSize: 10,
    color: theme.colors.blue[600],
  },
  downArrowStyle: {
    marginEnd: 6,
    marginTop: 10,
  },
});

DropDownInput.defaultProps = {
  containerStyle: {},
};

export default DropDownInput;
