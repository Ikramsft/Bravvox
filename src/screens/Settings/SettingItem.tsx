/**
 * @format
 */
import React from 'react';
import {ChevronRightIcon, useTheme, View} from 'native-base';

import SafeTouchable from '../../components/SafeTouchable';
import {Title} from '../../components/Typography';

export interface ISettings {
  id: string;
  title: string;
}

type Props = {
  item: ISettings;
  onPress: (item: ISettings) => void;
};

function SettingsItem(props: Props) {
  const {item, onPress} = props;

  const {colors} = useTheme();

  const onItemPress = () => onPress && onPress(item);

  return (
    <SafeTouchable onPress={onItemPress}>
      <View
        alignItems="center"
        flexDirection="row"
        height={67}
        justifyContent="space-between"
        justifyItems="center"
        pl={6}
        pr={4}>
        <Title fontSize="lg" fontWeight="normal">
          {item.title}
        </Title>
        <ChevronRightIcon />
      </View>
    </SafeTouchable>
  );
}

export {SettingsItem};
