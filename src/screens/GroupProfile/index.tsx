import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Spinner, Text, View, Button, useTheme} from 'native-base';
import {TabBarProps, Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';

import Posts from './posts';
import Photos from './photos';
import Members from './members';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import Events from './events';
import About from './about';
import {useGroupProfile} from './Queries/useGroupDetail';
import {OptionIcon, ProgressImage} from '../../components/Common';
import Error from '../../components/Error';
import UserAvatar from '../../components/UserAvatar';
import {useGroupMemberCheck} from './Queries/useGroupMemberCheck';
import {Title} from '../../components/Typography';
import {GroupMemberStatus, GroupRoles, GroupStatus} from '../Groups/types/GroupInterfaces';
import Private from '../../components/Private';
import FloatingButton from '../../components/FloatingButton';
import {useMemberOperations} from './Queries/useMemberOperations';
import GroupEllipseOptions from './groupEllipseOptions';
import {useGroupOperations} from './Queries/useGroupOperations';
import {SCREEN_WIDTH} from '../../constants/common';
import {IGroupFormType} from '../Groups/AddGroup/useGroupForm';
import SafeTouchable from '../../components/SafeTouchable';
import {useImageGallery} from '../../components/ImageGallery/useImageGallery';
import {useGroupMember} from './Queries/useGroupMember';
import {BravvoxBIcon} from '../../assets/svg/index';
import HeaderTitle from '../../components/HeaderTitle';
import HeaderLeft from '../../components/HeaderLeft';
import {PicCroppedDetails} from '../../redux/reducers/user/UserInterface';
import {useConfirmModal} from '../../components/CofirmationModel';

const PROFILE_IMAGE_SIZE = 100;

export type GroupProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'GroupProfile'>;

const {OWNER, ADMIN, DEFAULT} = GroupRoles;
const {ACCEPTED, INVITED, PENDING} = GroupMemberStatus;
const {DEACTIVATED} = GroupStatus;

function GroupProfile(props: GroupProfileScreenProps) {
  const {route, navigation} = props;
  const {groupId} = route.params || '';
  const ref = React.useRef();
  const {isLoading, data: profile, isError, isRefetching, refetch} = useGroupProfile(groupId);
  const isPrivate = !isLoading && profile?.error && profile.status === 403;
  const isNotFound = !isLoading && profile?.error && profile.status === 404;
  const isGroupActive = !isLoading && profile?.data?.status === 'active';
  const checkMember = !isLoading && !isPrivate;
  const {
    isLoading: isLoadingMember,
    isRefetching: isRefetchingMember,
    data: dataMember,
  } = useGroupMemberCheck(groupId, checkMember);
  const confirm = useConfirmModal();

  const {colors} = useTheme();

  const {onOpen, isOpen, onClose} = useMemberOperations();
  const {handleReActivateGroup} = useGroupOperations();
  const {
    handleJoinGroupActivity,
    handleCancelRequestActivity,
    handleAcceptRejectRequest,
    isLoadingShow,
  } = useGroupMember();

  const {showGallery} = useImageGallery();

  const isMember =
    dataMember?.data?.status === ACCEPTED &&
    [OWNER, ADMIN, DEFAULT].includes(dataMember?.data?.role as GroupRoles);

  const isInviteeOfPrivateGroup = profile?.data?.isPrivate && dataMember?.data?.status === INVITED;

  const isPending: boolean =
    dataMember?.data?.role === DEFAULT && dataMember?.data?.status === PENDING;

  const onClickReactivate = () => handleReActivateGroup(groupId);
  React.useLayoutEffect(() => {
    let title = '';
    if (profile?.data?.name) {
      const name = profile?.data?.name;
      const maxLength = 30;
      title = name.length >= maxLength ? `${name.slice(0, maxLength)}...` : name;
    }

    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => (
      <HeaderTitle title={title} titleTextProps={{textTransform: 'none'}} />
    );

    navigation.setOptions({
      headerShown: true,
      headerTitle,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation, profile]);

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  if (isError) {
    return <Error retry={refetch} />;
  }
  const onFollow = () => handleJoinGroupActivity(groupId);
  const onCancel = () => handleCancelRequestActivity(groupId, dataMember?.data?.id);

  const handleAcceptGroup = () => {
    confirm?.show?.({
      title: <Title fontSize={18}>Accept Group Invite</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to accept the group invite?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleAcceptRejectRequest(groupId, dataMember?.data?.id, 'accept');
      },
      onCancel: () => {
        handleAcceptRejectRequest(groupId, dataMember?.data?.id, 'reject');
      },
      submitLabel: 'Accept',
      cancelLabel: 'Reject',
    });
  };

  const onNewPostPress = () => {
    const tab = ref?.current?.getFocusedTab();
    if (tab !== 'Events')
      navigation.navigate('NewPost', {
        from: 'groups',
        id: groupId,
        title: profile?.data?.name || '',
      });
  };
  const isOwner: boolean = dataMember?.data?.role === OWNER;
  const isAdmin: boolean = dataMember?.data?.role === ADMIN;
  const showCreateContent = isMember && profile?.data?.postingIsPublic ? true : isOwner || isAdmin;

  const profilePic = profile?.data?.avatarReadURL ? profile?.data?.avatarReadURL : '';
  const coverPic = profile?.data?.pictureReadURL ? profile?.data?.pictureReadURL : '';

  const onEdit = () => {
    const groupData = profile?.data;
    if (groupData) {
      const {
        name,
        handle,
        tagline,
        about,
        guidelines,
        webUrl,
        email,
        phone,
        postingIsPublic,
        isPrivate: isGroupPrivate,
        isModerated,
        requireMemberApproval,
      } = groupData;

      const groupInfo: IGroupFormType = {
        name,
        handle,
        tagline,
        about,
        guidelines,
        webUrl,
        email,
        phone,
        postingIsPublic,
        isPrivate: isGroupPrivate,
        isModerated,
        requireMemberApproval,
        avatar: {uri: profilePic, name: '', type: ''},
        cover: {uri: coverPic, name: '', type: ''},
        cropData: {} as PicCroppedDetails,
        cropCoverData: {} as PicCroppedDetails,
      };
      navigation.navigate('EditGroup', {groupId, groupInfo});
    }
  };

  const isProfileDisable = (imageURL: string) => {
    if (imageURL && (isMember || !profile?.data?.isPrivate)) {
      return false;
    }
    return true;
  };

  const handleTapUserAvatar = () => {
    const avatarReadURL = [{uri: profile?.data?.avatarReadURL}];
    const info = {visible: true, imageData: avatarReadURL};
    showGallery(info);
  };

  const handleTapGroupCover = () => {
    const pictureReadURL = [{uri: profile?.data?.pictureReadURL}];
    const info = {visible: true, imageData: pictureReadURL};
    showGallery(info);
  };

  const onManageRoles = () => {
    navigation.navigate('ManageRoles', {id: groupId, from: 'group'});
  };

  const renderHeader = () => {
    const info = profile?.data;
    return (
      <View style={styles.topHeader}>
        {info?.pictureReadURL ? (
          <View style={styles.coverView}>
            <SafeTouchable
              disabled={isProfileDisable(info?.pictureReadURL)}
              onPress={handleTapGroupCover}>
              <ProgressImage source={{uri: info?.pictureReadURL}} style={styles.coverImage} />
            </SafeTouchable>
          </View>
        ) : (
          <View style={styles.coverViewBlank} />
        )}
        <View style={styles.metaView}>
          <View style={styles.absUserView}>
            <View style={styles.absUserContent}>
              <SafeTouchable
                disabled={isProfileDisable(info?.avatarReadURL ? info?.avatarReadURL : '')}
                style={styles.profileImageView}
                onPress={handleTapUserAvatar}>
                <UserAvatar
                  profilePic={info?.avatarReadURL}
                  size={PROFILE_IMAGE_SIZE}
                  style={styles.profileImage}
                />
              </SafeTouchable>
              <Text color={colors.black[900]} mx={10} noOfLines={1} style={styles.nameText}>
                {info?.name}
              </Text>
              {info?.handle && info.handle !== '' && (
                <Text color={colors.black[900]} style={styles.usernameText}>
                  @Group_{info.handle}
                </Text>
              )}
              <Text color={colors.black[900]} style={styles.usernameText}>
                {info?.tagline}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text color={colors.black[900]} style={styles.countText}>
                {info?.totalMembersCount}
              </Text>
              <Text color={colors.black[500]} style={styles.metaText}>
                followers
              </Text>
            </View>
          </View>
          {!isRefetchingMember &&
            !isRefetching &&
            profile &&
            dataMember &&
            (isMember ? (
              <View style={styles.ellipse}>
                <OptionIcon size={20} onOpen={onOpen} />
              </View>
            ) : profile?.data?.status === DEACTIVATED ? (
              <View style={styles.reactivate}>
                <Button onPress={onClickReactivate}>Reactivate</Button>
              </View>
            ) : dataMember?.data?.status === INVITED ? (
              <View style={styles.reactivate}>
                <Button size="sm" onPress={handleAcceptGroup}>
                  Accept Invite
                </Button>
              </View>
            ) : (
              <View style={styles.reactivate}>
                <Button
                  _loading={{
                    bg: theme.colors.blue[500],
                    _text: {
                      color: theme.colors.white,
                      fontSize: 11,
                    },
                  }}
                  _spinner={{
                    color: theme.colors.white,
                  }}
                  isLoading={isLoadingShow}
                  size="sm"
                  onPress={isPending ? onCancel : onFollow}>
                  {isMember ? 'Invite' : isPending ? 'Cancel Request' : 'Join Group'}
                </Button>
              </View>
            ))}
        </View>
      </View>
    );
  };

  const renderTabBar = (params: TabBarProps<TabName>) => {
    return (
      <MaterialTabBar
        {...params}
        scrollEnabled
        activeColor={theme.colors.black[900]}
        contentContainerStyle={styles.tabContainerStyle}
        getLabelText={(name: TabName) => name.toString()}
        inactiveColor={theme.colors.black[300]}
        indicatorStyle={[
          styles.tabBarIndicator,
          isInviteeOfPrivateGroup
            ? {width: Dimensions.get('window').width / 2.3}
            : {width: Dimensions.get('window').width / 7},
        ]}
        labelStyle={styles.tabBarLabel}
        style={styles.tabBar}
        tabStyle={
          isInviteeOfPrivateGroup
            ? {width: Dimensions.get('window').width / 2}
            : {width: Dimensions.get('window').width / 5}
        }
      />
    );
  };

  if (isNotFound) {
    return (
      <View alignItems="center" flex={1} justifyContent="center">
        <Title fontSize="2xl">Group Not Found</Title>
      </View>
    );
  }

  if (isPrivate) {
    return (
      <Private subtitle="You need to be invited to see the group's feed" title="Private Group" />
    );
  }

  return (
    <>
      {isInviteeOfPrivateGroup ? (
        <Tabs.Container
          headerContainerStyle={styles.headerContainerStyle}
          headerHeight={400}
          pagerProps={{keyboardShouldPersistTaps: 'always'}}
          ref={ref}
          renderHeader={renderHeader}
          renderTabBar={renderTabBar}>
          <Tabs.Tab name="Groups">
            <Private
              containerStyle={styles.privateView}
              subtitle="Please accept the invite to see the group's feed."
              title="Private Group"
            />
          </Tabs.Tab>

          <Tabs.Tab name="About">
            <About {...props} data={profile?.data} />
          </Tabs.Tab>
        </Tabs.Container>
      ) : (
        <Tabs.Container
          headerContainerStyle={styles.headerContainerStyle}
          headerHeight={400}
          pagerProps={{keyboardShouldPersistTaps: 'always'}}
          ref={ref}
          renderHeader={renderHeader}
          renderTabBar={renderTabBar}>
          <Tabs.Tab name="Groups">
            <Posts {...props} groupId={groupId} isGroupActive={isGroupActive} isMember={isMember} />
          </Tabs.Tab>
          <Tabs.Tab name="Media">
            <Photos {...props} groupId={groupId} isMember={isMember} loading={isLoadingMember} />
          </Tabs.Tab>
          <Tabs.Tab name="Members">
            <Members
              {...props}
              groupId={groupId}
              isMember={isMember}
              isPrivate={profile?.data?.isPrivate || false}
              loading={isLoadingMember}
              role={dataMember?.data?.role ?? ''}
            />
          </Tabs.Tab>
          <Tabs.Tab name="Events">
            <Events
              {...props}
              groupId={groupId}
              isMember={isMember}
              isPrivate={profile?.data?.isPrivate || false}
              loading={isLoadingMember}
              role={dataMember?.data?.role ?? ''}
            />
          </Tabs.Tab>
          <Tabs.Tab name="About">
            <About {...props} data={profile?.data} />
          </Tabs.Tab>
        </Tabs.Container>
      )}
      {showCreateContent && (
        <FloatingButton
          bgColor={theme.colors.red[900]}
          icon={<BravvoxBIcon height={20} width={20} />}
          onPress={onNewPostPress}
        />
      )}
      <GroupEllipseOptions
        dataMember={dataMember}
        groupId={groupId}
        isOpen={isOpen}
        role={dataMember?.data?.role ?? ''}
        status={profile?.data?.status ?? ''}
        onClose={onClose}
        onEdit={onEdit}
        onManageRoles={onManageRoles}
      />
    </>
  );
}

export default GroupProfile;

const styles = StyleSheet.create({
  topHeader: {
    flex: 2,
    minHeight: 200,
  },
  coverView: {
    flex: 2,
    backgroundColor: theme.colors.white,
  },
  coverViewBlank: {
    flex: 2,
    backgroundColor: theme.colors.gray[600],
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.4,
  },
  coverImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: 'cover',
  },
  absUserView: {
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absUserContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaView: {
    position: 'relative',
    flex: 3,
    backgroundColor: theme.colors.white,
  },
  profileImageView: {
    position: 'absolute',
    top: -(PROFILE_IMAGE_SIZE / 2),
  },
  profileImage: {
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: theme.colors.white,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    backgroundColor: theme.colors.white,
  },
  nameText: {
    fontSize: 18,
    marginTop: PROFILE_IMAGE_SIZE / 2 + 5,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 13,
  },
  metaRow: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 16,
    marginVertical: 2,
  },
  metaText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  tabBar: {
    backgroundColor: theme.colors.appWhite[700],
    textTransform: 'capitalize',
    height: 51,
    borderColor: theme.colors.gray[100],
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 11.5,
    fontFamily: 'DMSans-Medium',
    color: theme.colors.black[900],
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  tabBarIndicator: {
    backgroundColor: theme.colors.red[900],
    marginRight: 15,
    marginLeft: 15,
    height: 3,
    borderRadius: 45,
  },
  tabContainerStyle: {
    alignItems: 'center',
  },
  headerContainerStyle: {
    shadowOpacity: 0,
    elevation: 0,
    borderColor: theme.colors.gray[100],
    borderBottomWidth: 1,
  },
  reactivate: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  ellipse: {
    position: 'absolute',
    right: 22,
    top: 25,
  },
  privateView: {
    flex: 1,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingTop: 80,
  },
});
