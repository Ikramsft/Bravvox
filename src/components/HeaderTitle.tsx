/**
 * @format
 */
import React from 'react';
import {TextStyle} from 'react-native';
import {View, IInputProps} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {Title} from './Typography';

interface IHeaderTitleProps extends IViewProps {
  title?: string;
  LeftElement?: JSX.Element | JSX.Element[] | undefined;
  RightElement?: JSX.Element | JSX.Element[] | undefined;
  render?: JSX.Element | JSX.Element[] | undefined;
  titleTextProps?: IInputProps;
  style?: TextStyle | undefined;
}

function HeaderTitle(props: IHeaderTitleProps) {
  const {title, LeftElement, RightElement, render, titleTextProps, ...others} = props;

  if (render) {
    return (
      <View alignItems="center" flexDirection="row" justifyContent="center" {...others}>
        {render}
      </View>
    );
  }

  return (
    <View alignItems="center" flexDirection="row" justifyContent="center" {...others}>
      {LeftElement}
      <Title fontSize="17" ml={1} textTransform="capitalize" {...titleTextProps}>
        {title}
      </Title>
      {RightElement}
    </View>
  );
}

HeaderTitle.defaultProps = {
  title: '',
  LeftElement: undefined,
  RightElement: undefined,
  render: undefined,
  titleTextProps: undefined,
  style: undefined,
};

export default HeaderTitle;
