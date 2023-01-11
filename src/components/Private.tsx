/**
 * @format
 */
import {ITextProps, useTheme, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import React from 'react';
import Icons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {Title, SubTitle} from './Typography';

interface IPrivateProps {
  title?: string;
  subtitle?: string;
  containerStyle?: IViewProps;
}

function Private(props: IPrivateProps) {
  const {title, subtitle, containerStyle} = props;
  const {colors} = useTheme();
  return (
    <View {...containerStyle}>
      <SimpleLineIcons color={colors.black[900]} name="lock" size={100} style={iconStyle} />
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>
    </View>
  );
}

const containerStyle: IViewProps = {alignItems: 'center', mt: '10'};
const iconStyle = {marginVertical: 10};
Private.defaultProps = {
  title: 'Private',
  subtitle: 'Access required',
  containerStyle,
};

export default Private;
