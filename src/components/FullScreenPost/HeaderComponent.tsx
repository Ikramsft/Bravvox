/**
 * @format
 */
import React from 'react';
import {View, Text, useDisclose} from 'native-base';
import {StyleSheet, Dimensions, TouchableOpacity, Platform, StatusBar} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {theme} from '../../theme';
import {useFullScreenPost} from './useFullScreenPost';
import PostOptions, {PickerHandle} from '../../screens/Home/NewsFeed/PostOptions';
import {FromType} from '../../screens/Home/NewsFeed/Interactions';
import {INewsFeedData, IReportAbuseRequestData} from '../../screens/Home/types/NewsFeedInterface';
import ReportAbuseDialog from '../../screens/Home/NewsFeed/ReportAbuseDialog';
import {useFeedActions} from '../../screens/Home/NewsFeed/useToggleLike';
import {navigate} from '../../navigation/navigationRef';
import {Title} from '../Typography';
import {useDeletePost} from '../../screens/Home/NewsFeed/Queries/useDeletePost';
import {useConfirmModal} from '../CofirmationModel';

const {width: WIDTH} = Dimensions.get('screen');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

interface OptionProps {
  from: FromType;
  isMember: boolean;
  feedData: INewsFeedData;
}

function HeaderComponent(props: OptionProps) {
  const {feedData, isMember, from} = props;

  const postOptions = React.useRef<PickerHandle>(null);
  const confirm = useConfirmModal();

  const onOptionsClick = () => postOptions.current?.onPickerSelect();
  const {hidePost} = useFullScreenPost();
  const {isOpen: isOpenDialog, onToggle: toggleAbuseDialog} = useDisclose();
  const {postReportAbuse} = useFeedActions();
  const {deleteData} = useDeletePost({from, id: feedData?.documentId});

  const handleReportAbuse = async (reason: string) => {
    try {
      const fromData: IReportAbuseRequestData = {
        contentId: feedData.documentId,
        contentType: feedData.contentDataType,
        reason,
      };
      await postReportAbuse(fromData);

      toggleAbuseDialog();
    } catch (error) {
      toggleAbuseDialog();
    }
  };

  const onSelectEdit = () => {
    hidePost();
    navigate('EditPost', {
      from,
      id: feedData.documentId,
      title: 'Edit Post',
      newsFeed: feedData as INewsFeedData,
    });
  };

  const onSelectDelete = () => {
    confirm?.show?.({
      title: <Title fontSize={18}>Delete Post</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to Delete Post?</Text>
        </Text>
      ),
      onConfirm: () => {
        hidePost();
        deleteData();
      },
      submitLabel: 'YES',
      cancelLabel: 'CANCEL',
    });
  };

  return (
    <>
      <View style={styles.headerView}>
        <View style={styles.userView}>
          <TouchableOpacity style={styles.closeView} onPress={hidePost}>
            <Entypo color={theme.colors.white} name="chevron-left" size={24} />
          </TouchableOpacity>
          <AntDesign color={theme.colors.white} name="user" size={18} />
          <Text color={theme.colors.white} ml={1}>
            {feedData?.userInfo?.name}
          </Text>
        </View>
        <View>
          {!isMember && (from === 'group' || from === 'business') ? null : (
            <View alignItems="flex-end" mr={4}>
              <>
                <SimpleLineIcons
                  color={theme.colors.white}
                  name="options"
                  size={15}
                  onPress={onOptionsClick}
                />
                {feedData && (
                  <PostOptions
                    ref={postOptions}
                    userInfo={feedData?.userInfo}
                    onSelectAbuse={toggleAbuseDialog}
                    onSelectDelete={onSelectDelete}
                    onSelectEdit={onSelectEdit}
                  />
                )}
              </>
            </View>
          )}
        </View>
      </View>
      <ReportAbuseDialog
        handleClose={toggleAbuseDialog}
        handleSubmit={handleReportAbuse}
        open={isOpenDialog}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerView: {
    top: 0,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: theme.colors.transparentBlack[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  },
  userView: {
    flexDirection: 'row',
    padding: 8,
    flex: 1,
    alignItems: 'center',
  },
  closeView: {
    alignSelf: 'flex-end',
    marginEnd: 10,
  },
});

export default HeaderComponent;
