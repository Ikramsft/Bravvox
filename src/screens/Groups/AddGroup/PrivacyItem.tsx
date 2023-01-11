/**
 * @format
 */
import React from 'react';
import {View, Switch, theme} from 'native-base';

import {SubTitle} from '../../../components/Typography';

interface ISwitchItemProps {
  title: string;
  value: boolean;
  width?: string;
  onToggle: () => any;
  fontWeight?: string;
  color?: string;
  titleSize?: string;
}

export function PrivacyItem(props: ISwitchItemProps) {
  const {title, value, onToggle, fontWeight, width, color, titleSize} = props;
  return (
    <View flexDirection="row" justifyContent="space-between" mt={5}>
      <View width={width}>
        <SubTitle color={color} fontSize={titleSize} fontWeight={fontWeight}>
          {title}
        </SubTitle>
      </View>
      <Switch isChecked={value} onToggle={onToggle} />
    </View>
  );
}
PrivacyItem.defaultProps = {
  fontWeight: 'thin',
  color: theme.colors.black[500],
  titleSize: 'md',
  width: 'auto',
};
