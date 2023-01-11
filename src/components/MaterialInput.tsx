/**
 * @format
 */
import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {useTheme} from 'native-base';

import FloatingInput, {FloatingInputProps} from './FloatingInput';

const errorViewStyle: IViewProps = {ml: 0};

const MaterialInput = React.forwardRef<TextInput, FloatingInputProps>(
  (props: FloatingInputProps, ref) => {
    const {customHeight} = props;

    const {colors} = useTheme();
    const inputStyles = {
      minHeight: 30,
      color: colors.black[600],
    };
    const customStyles = {
      maxHeight: 72,
      minHeight: 30,
      color: colors.black[600],
    };
    return (
      <FloatingInput
        ref={ref}
        {...props}
        containerStyles={styles.containerStyles}
        customLabelStyles={{
          colorBlurred: colors.black[300],
        }}
        errorViewStyle={errorViewStyle}
        inputStyles={customHeight ? customStyles : inputStyles}
        labelStyles={styles.labelStyles}
        viewStyle={styles.viewStyle}
      />
    );
  },
);

export default MaterialInput;

const styles = StyleSheet.create({
  viewStyle: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRadius: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  labelStyles: {
    marginLeft: -5,
  },
  containerStyles: {
    paddingHorizontal: 0,
    paddingTop: 30,
  },
});
