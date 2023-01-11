/**
 * @format
 */
import React from 'react';
import {View, HStack, Text} from 'native-base';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {INewsFeedData} from '../types/NewsFeedInterface';
import {Title} from '../../../components/Typography';

import PostOptions, {PickerHandle} from './PostOptions';
import {PostCreationTypeFrom, RootStackParamList} from '../../../navigation';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {useDeletePost} from './Queries/useDeletePost';
import {GroupHeader, EventHeader, ProfileHeader} from './Headers';
import {NavigateItemType} from './NewsFeedLayout';
import SafeTouchable from '../../../components/SafeTouchable';

interface IHeadingProps {
  navigateToItem: (type: NavigateItemType) => () => void;
  onSelectAbuse: () => void;
  from: string;
  isMember?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  newsFeed: INewsFeedData;
}

export default function Heading(props: IHeadingProps) {
  const {navigation, newsFeed, navigateToItem, onSelectAbuse, isMember, from} = props;
  const {userInfo} = newsFeed;
  const postOptions = React.useRef<PickerHandle>(null);
  const screenName = from as PostCreationTypeFrom;
  const confirm = useConfirmModal();
  const onOptionsClick = () => postOptions.current?.onPickerSelect();

  const onSelectEdit = () =>
    navigation.navigate('EditPost', {
      from: screenName,
      id: newsFeed.documentId,
      title: 'Edit Post',
      newsFeed: newsFeed as INewsFeedData,
    });

  const {deleteData} = useDeletePost({from: screenName, id: newsFeed.documentId});

  const onSelectDelete = () => {
    confirm?.show?.({
      title: <Title fontSize={18}>Delete Post</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to Delete Post?</Text>
        </Text>
      ),
      onConfirm: () => deleteData(),
      submitLabel: 'YES',
      cancelLabel: 'CANCEL',
    });
  };

  const NewsFeedHeader =
    newsFeed.type === 'group' ? (
      <GroupHeader navigateToItem={navigateToItem} newsFeed={newsFeed} />
    ) : newsFeed.type === 'event' ? (
      <EventHeader navigateToItem={navigateToItem} newsFeed={newsFeed} />
    ) : (
      <ProfileHeader navigateToItem={navigateToItem} newsFeed={newsFeed} />
    );

  return (
    <HStack flexDirection="row" justifyContent="space-between" px="5">
      {NewsFeedHeader}
      {!isMember && (from === 'group' || from === 'business') ? null : (
        <SafeTouchable onPress={onOptionsClick}>
          <View alignItems="flex-end" justifyContent="center" minH={8} minW={8}>
            <SimpleLineIcons color="#818488" name="options" />
            <PostOptions
              ref={postOptions}
              userInfo={userInfo}
              onSelectAbuse={onSelectAbuse}
              onSelectDelete={onSelectDelete}
              onSelectEdit={onSelectEdit}
            />
          </View>
        </SafeTouchable>
      )}
    </HStack>
  );
}

Heading.defaultProps = {
  isMember: true,
};
