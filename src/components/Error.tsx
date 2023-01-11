/**
 * @format
 */
import React from 'react';
import {Button, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import {SubTitle, Title} from './Typography';

interface IErrorProps {
  title?: string;
  subtitle?: string;
  containerStyle?: IViewProps;
  retry?: () => void;
  retryLabel?: string;
}

function Error(props: IErrorProps) {
  const {title, subtitle, containerStyle, retry, retryLabel} = props;

  return (
    <View alignItems="center" flex={0.5} justifyContent="center" {...containerStyle}>
      <Title fontFamily="heading" fontSize="lg">
        {title}
      </Title>
      <SubTitle color="black.900">{subtitle}</SubTitle>
      {retry && (
        <Button mt={2} size="lg" variant="outline" onPress={retry}>
          {retryLabel}
        </Button>
      )}
    </View>
  );
}

Error.defaultProps = {
  title: 'Something went wrong',
  subtitle: 'Try that again',
  retryLabel: 'Retry',
  containerStyle: {},
  retry: null,
};

export default Error;
