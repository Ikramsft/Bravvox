/**
 * @format
 */
import React from 'react';
import {TextInput, View} from 'react-native';
import {useField} from 'formik';

import {FloatingInputProps} from './FloatingInput';
import MaterialInput from './MaterialInput';

interface MaterialInputProps extends Omit<FloatingInputProps, 'error'> {
  name: string;
  isMandatory?: boolean;
  error?: string;
  onPosition?: (y: number) => void;
}

const AutoFocusMaterialInput = React.forwardRef<TextInput, MaterialInputProps>(
  (props: MaterialInputProps, ref) => {
    const {name, onPosition, isMandatory, error} = props;

    const [field, meta, helpers] = useField(name);
    const {onBlur} = field;
    const {value, touched} = meta;
    const {setValue} = helpers;
    const viewRef = React.useRef<View>(null);

    const onLayout = () => {
      if (viewRef.current && onPosition) {
        viewRef.current.measure((_x, _y, _width, _height, _px, py) => onPosition(py));
      }
    };
    const handleBlur = () => {
      onBlur?.(name);
    };
    return (
      <View ref={viewRef}>
        <MaterialInput
          error={touched ? error : ''}
          isMandatory={isMandatory}
          ref={ref}
          value={value}
          onChangeText={setValue}
          onLayout={onLayout}
          {...props}
        />
      </View>
    );
  },
);

AutoFocusMaterialInput.defaultProps = {
  onPosition: undefined,
  isMandatory: false,
  error: '',
};

export default AutoFocusMaterialInput;
