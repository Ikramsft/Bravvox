/**
 * @format
 */
import * as React from 'react';
import {GestureResponderEvent, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import debounce from 'lodash.debounce';

const INTERVAL = 500;

function SafeTouchable(props: TouchableOpacityProps) {
  const {onPress, children, ...rest} = props;
  const handlePress = (e: GestureResponderEvent) => onPress?.(e);

  const debouncedClick = debounce(e => handlePress(e), INTERVAL, {
    leading: true,
    trailing: false,
    maxWait: INTERVAL,
  });

  const handleDebouncePress = (e: GestureResponderEvent) => debouncedClick(e);

  return (
    <TouchableOpacity {...rest} onPress={handleDebouncePress}>
      {children}
    </TouchableOpacity>
  );
}

export default SafeTouchable;
