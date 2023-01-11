import {useNavigation} from '@react-navigation/native';
import {Text, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import {SubTitle} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '../../Home';
import {IGroupCardInfo} from '../types/GroupInterfaces';

type Props = {
  item: IGroupCardInfo;
};

function GroupListCard(props: Props) {
  const {colors} = useTheme();
  const {item} = props;

  const navigation = useNavigation<RootNavigationType>();

  const navigateToGroupProfile = async () => navigation.push('GroupProfile', {groupId: item.id});

  return (
    <SafeTouchable activeOpacity={0.5} onPress={navigateToGroupProfile}>
      <View style={[styles.cardContainer, {backgroundColor: colors.white}]}>
        <UserAvatar profilePic={item.avatarReadURL} />
        <View style={styles.centerContainer}>
          <Text ellipsizeMode="tail" fontWeight="semibold" maxWidth="90%" numberOfLines={1}>
            {item.name}
          </Text>
          <View alignItems="center" flexDirection="row">
            <SimpleLineIcons color={colors.black[500]} name="people" size={12} />
            <SubTitle marginX={2}>{item.totalMembers} Members</SubTitle>
          </View>
        </View>
      </View>
    </SafeTouchable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  centerContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default GroupListCard;
