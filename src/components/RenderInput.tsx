import {
  Box,
  FormControl,
  IInputProps,
  Input,
  Text,
  theme,
  View,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {StyleSheet, TextInput, TextStyle, ViewStyle} from 'react-native';

interface IRenderInputProps extends IInputProps {
  label?: string;
  error?: string;
  labelStyles?: TextStyle;
  containerStyles?: ViewStyle;
}

const RenderInput = React.forwardRef<TextInput, IRenderInputProps>(
  (props: IRenderInputProps, ref) => {
    const {error, label, labelStyles, containerStyles, style, ...restProps} = props;

    return (
      <Box alignItems="center" style={containerStyles}>
        <FormControl isInvalid={Boolean(error)}>
          {label ? <FormControl.Label style={labelStyles}>{label}</FormControl.Label> : null}
          <Input autoCapitalize="none" ref={ref} style={[styles.input, style]} {...restProps} />
          {error ? (
            <View flexDirection="row" mt={2} width="100%">
              <WarningOutlineIcon size="xs" style={styles.errorIconStyle} />
              <Text color={theme.colors.red[600]}>{error}</Text>
            </View>
          ) : null}
        </FormControl>
      </Box>
    );
  },
);

RenderInput.defaultProps = {
  label: undefined,
  error: undefined,
  labelStyles: {},
  containerStyles: {},
};

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
  },
  errorIconStyle: {color: theme.colors.red[600], marginTop: 5, marginRight: 5},
});

export default RenderInput;
