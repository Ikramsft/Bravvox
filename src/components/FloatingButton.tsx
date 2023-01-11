/**
 * @format
 */
import React from 'react';
import {IconButton, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../theme';

interface IFloatingButtonProps extends IViewProps {
  onPress: () => void;
  name?: string;
  icon?: JSX.Element;
  bgColor?: string;
  size?: number;
}

function FloatingButton(props: IFloatingButtonProps) {
  const {icon, name, onPress, bgColor, size, ...others} = props;

  return (
    <View bottom={10} position="absolute" right={6} {...others}>
      <IconButton
        _icon={{color: theme.colors.white}}
        _pressed={{bg: bgColor, _icon: {color: theme.colors.white}}}
        alignItems="center"
        backgroundColor={bgColor}
        borderRadius="full"
        icon={
          icon ?? <MaterialCommunityIcons color={theme.colors.white} name={name ?? ''} size={24} />
        }
        justifyContent="center"
        size={size}
        zIndex={9999}
        onPress={onPress}
      />
    </View>
  );
}

FloatingButton.defaultProps = {
  icon: undefined,
  name: 'plus',
  bgColor: theme.colors.blue[500],
  size: 10,
};

export default FloatingButton;
