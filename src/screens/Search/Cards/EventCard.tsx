import React from 'react';
import {View, Text, Icon, useTheme, useDisclose} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '..';
import {Title} from '../../../components/Typography';
import AttendEventOption from '../../EventProfile/attendEventOption';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dot: {
    height: 2,
    width: 2,
    borderRadius: 1,
    paddingHorizontal: 5,
  },
  joinText: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
  },
});

function EventCard(props: any) {
  const {item} = props;
  const {colors} = useTheme();
  const navigation = useNavigation<RootNavigationType>();
  const {isOpen, onClose, onOpen} = useDisclose();

  const navigateToGroupProfile = async () => {
    navigation.push('EventProfile', {
      EventId: item.documentID,
      title: item.title,
    });
  };

  return (
    <View
      alignItems="center"
      flexDirection="row"
      style={[styles.container, {backgroundColor: colors.white}]}>
      <SafeTouchable onPress={navigateToGroupProfile}>
        <UserAvatar profilePic={item.avatar} size={54} />
      </SafeTouchable>
      <View flex={1} pl={4}>
        <TouchableOpacity onPress={navigateToGroupProfile}>
          <Title
            color={colors.black[1000]}
            flexShrink={1}
            fontSize={12}
            lineHeight={16}
            marginBottom={1}
            numberOfLines={1}
            textTransform="capitalize">
            {item.title}
          </Title>
        </TouchableOpacity>

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
              lineHeight={16}>{`${item.attendeeCount} Attendees`}</Text>
          </View>
        </View>
      </View>

      <View alignItems="center">
        {item.userRelationship !== 'none' ? (
          <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView}>
            <Text>{item.userRelationship}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={onOpen}>
            <Text color="blue.500" style={styles.joinText}>
              Attend
            </Text>
          </TouchableOpacity>
        )}
        <AttendEventOption
          EventId={item.documentID}
          isMember={item.userRelationship !== 'none'}
          isOpen={isOpen}
          profile={{...item, id: item.documentID, requireAttendeeApproval: true}}
          responseStatus={item.userRelationship}
          status={item.status}
          onClose={onClose}
        />
      </View>
    </View>
  );
}

export default EventCard;
