/**
 * @format
 */
import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, useDisclose, useTheme, Button} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  IComments,
  ILikeDisLikeGroupRequestData,
  INewsFeedData,
  IReportAbuseRequestData,
  ReactionType,
} from '../types/NewsFeedInterface';
import Heading from './Heading';
import ImageVideo from './ImageVideo';
import Comments from './Comments';
import {RootStackParamList} from '../../../navigation';
import {FromType, Interactions} from './Interactions';
import {useFeedActions} from './useToggleLike';
import ReportAbuseDialog from './ReportAbuseDialog';
import TextContentView from './TextContentView';
import MaskedView from './MaskedView';
import {Caption, Title} from '../../../components/Typography';
import TermsAndConditionDialog from './TremsAndConditionDialog';
import details from './termsandcondition.json';
import ReportAppealDialog from './ReportAppealDialog';

const RESTRICTED_MEDIA_BACKGROUD_COLOR = 'rgba(39,50,62,.93)';

interface NewsFeedProps {
  newsFeed: INewsFeedData;
  navigation:
    | NativeStackNavigationProp<RootStackParamList, 'GroupProfile'>
    | NativeStackNavigationProp<RootStackParamList, 'Profile'>
    | NativeStackNavigationProp<RootStackParamList, 'BusinessProfile'>
    | NativeStackNavigationProp<RootStackParamList, 'SinglePost'>
    | NativeStackNavigationProp<RootStackParamList, 'EventProfile'>;
  from: FromType;
  id?: string;
  isMember: boolean;
  businessId?: string;
  showComments?: boolean;
  isSinglePostView?: boolean;
  handleShowPost?: () => void;
  addTopSpace?: boolean;
}

const styleProps: IViewProps = {flex: 1, py: 2.5, width: '100%'};

export type NavigateItemType = 'profile' | 'group' | 'event';

export default function NewsFeedLayout(props: NewsFeedProps) {
  const {
    newsFeed,
    navigation,
    from,
    id = '',
    isMember,
    showComments,
    isSinglePostView,
    handleShowPost,
    addTopSpace,
  } = props;

  const {
    groupInfo,
    eventInfo,
    userInfo,
    contentStatus,
    textContent,
    documentId,
    comments,
    userId,
    isLiked,
    isDisLiked,
    videoContentLink,
    imageContentLink,
  } = newsFeed;

  const {colors} = useTheme();

  const [isTermsOpen, setTermsOpen] = useState(false);

  const closeDialog = () => setTermsOpen(!isTermsOpen);
  const openTermsAndConditionDialog = () => setTermsOpen(true);

  const {toggleLikePost, postReportAbuse} = useFeedActions();
  const {isOpen: isOpenDialog, onToggle: toggleAbuseDialog} = useDisclose();
  const {isOpen: isOpenAppealDialog, onToggle: toggleAppeal} = useDisclose();
  const {postAppeal} = useFeedActions();

  const [isLikeLoading, setIsLikeLoading] = useState<{type: ReactionType; isLoading: boolean}>({
    type: '',
    isLoading: false,
  });

  const isMedia = imageContentLink?.length || videoContentLink?.length;
  const numOfLines = isMedia ? 5 : 10;

  const extractType = (to: string) => {
    let type = from;
    let epId = id;
    switch (newsFeed.type) {
      case 'group':
        type = to === 'toSinglePost' ? (newsFeed.type as FromType) : 'homeGroup';
        epId = newsFeed.groupInfo?.documentID || '';
        break;
      case 'event':
        type = to === 'toSinglePost' ? (newsFeed.type as FromType) : 'homeEvent';
        epId = newsFeed.eventInfo?.documentID || '';
        break;
      default:
        break;
    }
    return {type, epId: epId as FromType};
  };

  const navigateToItem = (type: NavigateItemType) => () => {
    const {userName} = userInfo;
    switch (type) {
      case 'profile':
        navigation.push('Profile', {userName, userId});
        break;
      case 'group':
        if (groupInfo) {
          navigation.push('GroupProfile', {groupId: groupInfo.documentID});
        }
        break;
      case 'event':
        if (eventInfo) {
          navigation.push('EventProfile', {EventId: eventInfo.documentID, title: eventInfo.name});
        }
        break;
      default:
        break;
    }
  };

  const openCommentatorProfile = useCallback(
    (comment: IComments) => {
      const {userName} = comment.userInfo;
      const {userId: commentUserId} = comment;
      navigation.push('Profile', {userName, userId: commentUserId});
    },
    [navigation],
  );

  const toggleLikeHandler = async (type: ReactionType) => {
    setIsLikeLoading({type, isLoading: true});
    const {type: tempType, epId} = extractType('fromHome');
    const data: ILikeDisLikeGroupRequestData = {
      id: epId || '',
      contentId: documentId || '',
      isLike: type === 'like',
      reaction: isLiked ? 'like' : isDisLiked ? 'dislike' : 'nil',
      isLikeReaction: type === 'like' ? !isLiked : false,
      isDisLikeReaction: type === 'dislike' ? !isDisLiked : false,
      like: type === 'like' ? !isLiked : false,
      dislike: type === 'dislike' ? !isDisLiked : false,
    };
    await toggleLikePost(data, tempType);
    setIsLikeLoading({type, isLoading: false});
  };

  const handleReportAbuse = async (reason: string) => {
    try {
      const data: IReportAbuseRequestData = {
        contentId: newsFeed?.documentId,
        contentType: newsFeed?.contentDataType,
        reason,
      };
      await postReportAbuse(data);
      toggleAbuseDialog();
    } catch (error) {
      toggleAbuseDialog();
    }
  };

  const [appealSubmitted, setAppealSubmitted] = useState<boolean>(false);
  const [appealResponse, setAppealResponse] = useState<string>('');
  const handleAppeal = async (reason: string, otherValue: string) => {
    try {
      const data: IAppealPost = {
        contentId: documentId,
        reasonType: otherValue ? 'custom' : 'predefined',
        reason: otherValue || reason,
      };
      await postAppeal(data, (value: string) => {
        setAppealResponse(value);
      });
      toggleAppeal();
      setAppealSubmitted(true);
    } catch (error) {
      toggleAppeal();
    }
  };

  const onSelectAbuse = () => toggleAbuseDialog();

  const openSinglePostView = (focus = false, editComment?: IComments) => {
    if (isSinglePostView && newsFeed.contentDataType === 'image' && handleShowPost) {
      handleShowPost();
    } else {
      const {type, epId} = extractType('toSinglePost');
      navigation.navigate('SinglePost', {
        documentId,
        userName: userInfo.userName,
        from: type,
        isMember,
        id: epId,
        focus,
        editComment,
      });
    }
  };
  const [viewContent, setViewContent] = useState<boolean>(false);

  const toggleSuspendedContent = () => {
    setViewContent(true);
  };

  const onCommentPress = () => {
    if (from && showComments) {
      openSinglePostView(true);
    }
  };
  return (
    <View
      {...styleProps}
      _dark={{bg: colors.black[40]}}
      _light={{bg: colors.white}}
      mt={addTopSpace ? 1 : 0}>
      <ReportAbuseDialog
        handleClose={toggleAbuseDialog}
        handleSubmit={handleReportAbuse}
        open={isOpenDialog}
      />
      <ReportAppealDialog
        handleClose={toggleAppeal}
        handleSubmit={handleAppeal}
        open={isOpenAppealDialog}
      />
      <TermsAndConditionDialog body={details?.terms} handleClose={closeDialog} open={isTermsOpen} />
      <Heading
        from={from}
        isMember={isMember}
        navigateToItem={navigateToItem}
        navigation={navigation}
        newsFeed={newsFeed}
        onSelectAbuse={onSelectAbuse}
      />

      {contentStatus === 'SUSPENDED' && !viewContent ? (
        <View>
          {appealSubmitted ? (
            <View style={styles.container}>
              <Text color="white" mt="1.5" mx="5" style={styles.maskSubText} textAlign="center">
                {appealResponse}
              </Text>
              <Button
                _text={{color: 'white'}}
                color="white"
                mt={5}
                variant="outline"
                onPress={() => setAppealSubmitted(false)}>
                Close
              </Button>
            </View>
          ) : newsFeed.contentDataType === 'image' || newsFeed.contentDataType === 'video' ? (
            <View style={styles.container}>
              <Title
                mt="1.5"
                mx="5"
                style={[styles.maskTitle, {color: colors.white}]}
                textAlign="center">
                Suspended Content Notice
              </Title>
              <Text color="white" mt="1.5" mx="5" style={styles.maskSubText} textAlign="center">
                This content has been suspended for violating our
                <Caption
                  underline
                  color="white"
                  style={styles.maskSubText}
                  onPress={() => openTermsAndConditionDialog()}>
                  {'  '}Terms & Conditions.
                </Caption>
                <Text> Only you can see this message.</Text>
                <Text> If you would like to appeal this decision </Text>
                <Text underline onPress={() => toggleAppeal()}>
                  click here.
                </Text>
              </Text>
              <Button
                _text={{color: 'white'}}
                color="white"
                mt={8}
                variant="outline"
                onPress={toggleSuspendedContent}>
                View Media
              </Button>
            </View>
          ) : (
            <>
              <Title mt="1.5" mx="5">
                Suspended Content Notice
              </Title>
              <Text mt="1.5" mx="5">
                This content has been suspended for violating our
                <Caption underline color="blue.900" onPress={() => openTermsAndConditionDialog()}>
                  {' '}
                  Terms & Conditions.
                </Caption>
                <Text> Only you can see this message.</Text>
              </Text>
              <Text color="blue.900" mt="1.5" mx="5" onPress={() => toggleSuspendedContent()}>
                View
              </Text>
            </>
          )}
        </View>
      ) : (
        <>
          <MaskedView newsFeed={newsFeed}>
            <TouchableOpacity onPress={() => openSinglePostView()}>
              {textContent ? (
                <TextContentView
                  collapse
                  content={textContent}
                  from={from}
                  numOfLines={numOfLines}
                />
              ) : null}
              <ImageVideo
                isSinglePostView={false}
                newsFeed={newsFeed}
                onOutSidePress={openSinglePostView}
              />
            </TouchableOpacity>
            <Interactions
              from={from}
              isLikeLoading={isLikeLoading}
              isMember={isMember}
              newsFeed={newsFeed}
              toggleLike={(type: string) => toggleLikeHandler(type as ReactionType)}
              onCommentPress={onCommentPress}
            />
          </MaskedView>
          {showComments ? (
            <Comments
              comments={comments}
              documentId={documentId}
              from={from}
              handleEdit={item => openSinglePostView(true, item)}
              id={id || ''}
              isMember={isMember}
              openCommentatorProfile={openCommentatorProfile}
              userId={id}
              onPressComment={() => openSinglePostView(true)}
            />
          ) : null}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RESTRICTED_MEDIA_BACKGROUD_COLOR,
    padding: 20,
    marginTop: 10,
  },
  maskTitle: {
    fontSize: 20,
  },
  maskSubText: {
    fontSize: 13,
  },
});
NewsFeedLayout.defaultProps = {
  businessId: '',
  id: '',
  showComments: true,
  isSinglePostView: false,
  handleShowPost: () => null,
  addTopSpace: true,
};
