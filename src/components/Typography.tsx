import {IInputProps, Text} from 'native-base';
import React from 'react';

export function Caption(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text color="#818488" fontSize="sm" {...rest}>
      {children}
    </Text>
  );
}

export function Title(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text
      _dark={{color: '#fff'}}
      _light={{color: 'black.900'}}
      fontSize="sm"
      fontWeight="bold"
      {...rest}>
      {children}
    </Text>
  );
}

export function SubTitle(props: IInputProps) {
  const {children, ...rest} = props;

  return (
    <Text color="black.500" fontSize="sm" fontWeight="light" {...rest}>
      {children}
    </Text>
  );
}
