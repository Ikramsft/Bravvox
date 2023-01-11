import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {SubTitle, Title} from '../../../components/Typography';
import {RootNavigationType} from '../../Home';
import {theme} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: theme.colors.gray[500],
    borderBottomWidth: 0.6,
  },
  dot: {
    height: 2,
    width: 2,
    borderRadius: 1,
    paddingHorizontal: 5,
  },
});

function EventCard(props: any) {
  const {colors} = useTheme();
  const item = {
    groupId: 'abc123456',
    name: 'Sunshine State Cup Tournament',
    venue: 'Advent Health Center Ice',
    date: 'Friday, August 6th at 7pm EST',
    avatarReadURL: '',
    attendeesCount: 25,
    location: 'Tempa, FL',
  };
  const navigation = useNavigation<RootNavigationType>();

  const navigateToGroupProfile = async () => {
    navigation.push('GroupProfile', {groupId: item?.groupId});
  };

  return (
    <View
      alignItems="center"
      flexDirection="row"
      style={[styles.container, {backgroundColor: colors.white}]}>
      <SafeTouchable onPress={navigateToGroupProfile}>
        <UserAvatar profilePic={item.avatarReadURL} size={54} />
      </SafeTouchable>
      <View flex={1} pl={4}>
        <Title
          color={colors.black[1000]}
          flexShrink={1}
          fontSize={12}
          lineHeight={16}
          marginBottom={1}
          numberOfLines={1}
          textTransform="capitalize">
          {item.name}
        </Title>
        <SubTitle
          color={colors.black[1000]}
          flexShrink={1}
          fontSize={12}
          lineHeight={16}
          marginBottom={1}
          numberOfLines={1}
          textTransform="capitalize">
          {item.venue}
        </SubTitle>
        <SubTitle
          color={colors.black[400]}
          flexShrink={1}
          fontSize={11}
          lineHeight={14}
          marginBottom={1}
          numberOfLines={1}
          textTransform="capitalize">
          {item.date}
        </SubTitle>
        <View flexDirection="row">
          <View alignItems="center" flexDirection="row">
            <Icon
              as={<SimpleLineIcons name="location-pin" />}
              color={colors.black[1000]}
              mr={1}
              size={11}
            />
            <Text color={colors.black[1000]} fontSize={12} lineHeight={16}>
              {item.location}
            </Text>
          </View>
          <View style={styles.dot} />
          <View alignItems="center" flexDirection="row">
            <Icon
              as={<SimpleLineIcons name="user" />}
              color={colors.black[1000]}
              mr={1}
              size={11}
            />
            <Text
              color={colors.black[1000]}
              fontSize={12}
              lineHeight={16}>{`${item.attendeesCount} Attendees`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default EventCard;
