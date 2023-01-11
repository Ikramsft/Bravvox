import {useNavigation} from '@react-navigation/native';
import {Text, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import SafeTouchable from '../../../components/SafeTouchable';
import {SubTitle} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import {dateFormatter} from '../../../utils';
import {RootNavigationType} from '../../Home';
import {IEventData} from '../Queries/useEventList';
import {LocationHandleIcon, AteendeHandleIcon} from '../../../assets/svg';
import {theme} from '../../../theme';

type Props = {
  item: IEventData;
};

function EventListCard(props: Props) {
  const {colors} = useTheme();
  const {item} = props;

  const navigation = useNavigation<RootNavigationType>();

  const navigateToGroupProfile = async () => {
    navigation.push('EventProfile', {EventId: item.id, title: item.title});
  };

  return (
    <SafeTouchable activeOpacity={0.5} onPress={navigateToGroupProfile}>
      <View style={[styles.cardContainer, {backgroundColor: colors.white}]}>
        <UserAvatar profilePic={item.croppedAvatarURL || item.avatarURL} />
        <View style={styles.centerContainer}>
          <Text ellipsizeMode="tail" fontWeight="semibold" numberOfLines={1}>
            {item.title}
          </Text>
          <SubTitle numberOfLines={1}>
            {item.eventStartTime && dateFormatter(item.eventStartTime, 'EventList')}
          </SubTitle>
          <View style={[styles.viewDirection, styles.marginView]}>
            {item?.location && (
              <View style={styles.viewDirection}>
                <LocationHandleIcon height={20} width={15} />
                <Text
                  ellipsizeMode="tail"
                  fontWeight="semibold"
                  maxWidth="90%"
                  numberOfLines={1}
                  style={styles.locationText}>
                  {item?.location}
                </Text>
              </View>
            )}
            <View style={styles.viewDirection}>
              <AteendeHandleIcon height={20} width={15} />
              <Text
                ellipsizeMode="tail"
                fontWeight="semibold"
                maxWidth="90%"
                numberOfLines={1}
                style={styles.attendeesText}>
                {item.totalAttendees} Attendees
              </Text>
            </View>
          </View>
        </View>
        {item.status !== 'active' && (
          <View style={styles.indicateButton}>
            <View borderRadius={3} p={2}>
              <Text
                color={item.status === 'canceled' ? theme.colors.red[800] : theme.colors.blue[500]}
                fontSize={12}
                fontWeight="500">
                {item.status?.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeTouchable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  indicateButton: {justifyContent: 'center', alignItems: 'center'},
  centerContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  viewDirection: {
    flexDirection: 'row',
  },
  marginView: {
    marginTop: 5,
  },
  locationText: {
    width: 100,
    marginLeft: 5,
    fontSize: 14,
  },
  attendeesText: {
    width: 250,
    marginLeft: 5,
    fontSize: 14,
  },
});

export default EventListCard;
