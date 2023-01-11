import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '..';
import {Title} from '../../../components/Typography';
import {useProfileOperations} from '../../Profile/Queries/useProfileOperations';
import {FollowerTypes} from '../../Profile/profileEllipseOptions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
  },
  followBackText: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
});

interface RelationShipButton {
  item?: any;
}

const {FOLLOW} = FollowerTypes;

function RelationShipButton(props: any) {
  const {item, searchParams, deletePeopleFromCache} = props;
  const {handleFollow} = useProfileOperations(searchParams);

  const userId = item?.userId;
  const userName = item?.userName;

  const followUser = () => {
    Keyboard.dismiss();
    handleFollow(
      userId,
      userName,
      '',
      'connectionPeople',
      item.sortId,
      item.processingId,
      deletePeopleFromCache,
    );
  };

  // const textStyle = getClassNameByRelationship(item?.relationship);

  switch (item?.relationship?.toLowerCase()) {
    case 'follow':
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={followUser}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW}
          </Text>
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={followUser}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW}
          </Text>
        </TouchableOpacity>
      );
  }
}

function UserCard(props: any) {
  const {item, searchParams, deleteConnection, deletePeopleFromCache} = props;
  const {colors} = useTheme();
  const navigation = useNavigation<RootNavigationType>();

  const navigateToProfile = async () => {
    Keyboard.dismiss();
    navigation.navigate('Profile', {userName: item?.userName, userId: item?.userId});
  };

  const deleteConnectionAction = () => {
    const {sortId, processingId, userId} = item;
    deleteConnection(sortId, processingId, userId);
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <View alignItems="flex-end" alignSelf="flex-end" height={25} width={25}>
          <SafeTouchable onPress={deleteConnectionAction}>
            <Icon as={<MaterialIcons name="close" />} color={colors.black[950]} size={15} />
          </SafeTouchable>
        </View>
        <SafeTouchable onPress={navigateToProfile}>
          <UserAvatar alignItems="center" profilePic={item.profilePic} size={54} />
        </SafeTouchable>
        <View alignItems="center" flex={1} mr={4} mt={1} pl={4}>
          <TouchableOpacity onPress={navigateToProfile}>
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
          </TouchableOpacity>

          <Text
            alignItems="center"
            color={colors.black[1000]}
            flex={1}
            fontSize={12}
            maxWidth={100}
            numberOfLines={1}>
            {item?.location}
          </Text>

          <Text
            alignItems="center"
            color={colors.black[1000]}
            flex={1}
            fontSize={12}
            mt={2}
            numberOfLines={1}>{`${item.count} Mutual Follower${item.count > 1 ? 's' : ''}`}</Text>
        </View>
        <View alignItems="center">
          <RelationShipButton
            deletePeopleFromCache={deletePeopleFromCache}
            item={item}
            searchParams={searchParams}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UserCard;
