/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {View, useTheme, HStack, Text} from 'native-base';

import {Title} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import SafeTouchable from '../../../components/SafeTouchable';
import {ISearchUser} from './useSearchUser';
import {truncateUsername} from '../../../utils';

type NewMessageItemProps = {
  item: ISearchUser;
  onSelect: (item: ISearchUser) => void;
};

function NewMessageItem(props: NewMessageItemProps) {
  const {item, onSelect} = props;
  const {name, username, avatar} = item;

  const {colors} = useTheme();

  const onPress = () => onSelect(item);

  return (
    <SafeTouchable onPress={onPress}>
      <HStack
        borderBottomColor={colors.gray[100]}
        borderBottomWidth={0.5}
        flexDirection="row"
        justifyContent="space-between"
        style={styles.container}>
        <HStack alignItems="center">
          <UserAvatar key={avatar} profilePic={avatar} />
          <View ml="3">
            <Title>{name}</Title>
            <Text color={colors.black[500]} fontSize={12}>
              @{truncateUsername(username)}
            </Text>
          </View>
        </HStack>
      </HStack>
    </SafeTouchable>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 18,
    paddingVertical: 14,
  },
});

export default NewMessageItem;
