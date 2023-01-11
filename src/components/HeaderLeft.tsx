/**
 * @format
 */
import React from 'react';
import {View, ChevronLeftIcon} from 'native-base';
import SafeTouchable from './SafeTouchable';

interface IHeaderLeftProps {
  onPress?: () => void;
}

function HeaderLeft(props: IHeaderLeftProps) {
  const {onPress} = props;

  return (
    <SafeTouchable activeOpacity={0.9} onPress={onPress}>
      <View
        alignItems="flex-start"
        height={35}
        justifyContent="center"
        width={35}>
        <ChevronLeftIcon size="20px" />
      </View>
    </SafeTouchable>
  );
}

HeaderLeft.defaultProps = {
  onPress: null,
};

export default HeaderLeft;
