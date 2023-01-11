import {IconButton, useColorModeValue, useTheme, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import React from 'react';

import {BravvoxLogoIcon} from '../../../assets/svg/index';

function AuthHeader(props: IViewProps) {
  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['40'], colors.white);

  return (
    <View alignItems="center" flexDirection="row" {...props}>
      <IconButton
        {...props}
        icon={<BravvoxLogoIcon color={iconColor} height={17} width={93} />}
        pl={0}
      />
    </View>
  );
}

export default AuthHeader;
