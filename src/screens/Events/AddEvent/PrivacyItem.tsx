/**
 * @format
 */
import React from 'react';
import {View, Switch, theme} from 'native-base';

import {SubTitle} from '../../../components/Typography';

interface ISwitchItemProps {
  title: string;
  value: boolean;
  onToggle: () => any;
  fontWeight?: string;
  color?: string;
  titleSize?: string;
}

export function PrivacyItem(props: ISwitchItemProps) {
  const {title, value, onToggle, fontWeight, color, titleSize} = props;
  return (
    <View flexDirection="row" justifyContent="space-between" mt={5}>
      <SubTitle color={color} fontSize={titleSize} fontWeight={fontWeight}>
        {title}
      </SubTitle>
      <Switch isChecked={value} onToggle={onToggle} />
    </View>
  );
}
PrivacyItem.defaultProps = {
  fontWeight: 'thin',
  color: theme.colors.black[500],
  titleSize: 'md',
};
