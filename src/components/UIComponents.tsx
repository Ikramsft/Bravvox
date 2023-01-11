import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import React from 'react';

export function Container(props: IViewProps) {
  const {children, ...restProps} = props;
  return (
    <View _dark={{bg: '#000'}} _light={{bg: '#fff'}} style={{flexGrow: 1}} {...restProps}>
      {children}
    </View>
  );
}
