/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import {SubTitle} from './Typography';

interface IEmptyProps {
  title?: string;
  containerStyle?: IViewProps;
}

function Empty(props: IEmptyProps) {
  const {title, containerStyle} = props;

  return (
    <View alignItems="center" justifyContent="center" mt="4" {...containerStyle}>
      <SubTitle fontFamily="heading" fontSize="md">
        {title}
      </SubTitle>
    </View>
  );
}

Empty.defaultProps = {
  title: 'No Data Found',
  containerStyle: {},
};

export default Empty;
