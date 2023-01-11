import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {Spinner, Text, View, useDisclose, ChevronDownIcon, useTheme} from 'native-base';
import {TabBarProps, Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import {OptionIcon, ProgressImage} from '../../components/Common';
import Error from '../../components/Error';
import UserAvatar from '../../components/UserAvatar';
import {Caption, Title} from '../../components/Typography';
import Private from '../../components/Private';
import {SCREEN_WIDTH} from '../../constants/common';
import SafeTouchable from '../../components/SafeTouchable';
import {useImageGallery} from '../../components/ImageGallery/useImageGallery';
import Details from './details';
import Media from './media';
import Attendees from './attendees';
import Event from './event';
import {useEventProfile} from './Queries/useEventProfile';
import {checkIfEventStarted, dateFormatter} from '../../utils';
import EventEllipseOptions from './eventEllipseOptions';
import {useEventMemberCheck} from './Queries/useEventMemberCheck';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {
  EventRoles,
  EventMemberStatus,
  IEventData,
  EventStatus,
} from '../Events/types/EventInterfaces';
import {useEventOperations} from './Queries/useEventOperations';
import AttendEventOption from './attendEventOption';
import FloatingButton from '../../components/FloatingButton';
import {BravvoxBIcon} from '../../assets/svg';
import {useEventEllipsisOptions} from './Queries/useEventEllipsisOptions';

const PROFILE_IMAGE_SIZE = 100;
const {OWNER, ADMIN, DEFAULT} = EventRoles;
const {ACCEPTED, INVITED, PENDING} = EventMemberStatus;
const {CANCELLED} = EventStatus;
export type EventProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'EventProfile'>;

export enum EventResponseCodes {
  BLOCKED_ATTENDEE_CODE = 10001,
  DEACTIVATED_EVENT_CODE = 10002,
  REACTIVATED_EVENT_CODE = 10003,
  BLOCKED_MEMBER_CODE = 10001,
  CANCELLED_EVENT_CODE = 10004,
}
const {DEACTIVATED_EVENT_CODE} = EventResponseCodes;
function EventProfile(props: EventProfileScreenProps) {
  const {handleReActivateEvent} = useEventEllipsisOptions();
  const sheetActions = useDisclose();
  const {isOpen, onClose, onOpen} = useDisclose();
  const {route, navigation} = props;
  const {EventId, from} = route.params || '';
  const ref = React.useRef();
  const {colors} = useTheme();

  const {isLoading, data: profile, isError, refetch, isRefetching} = useEventProfile(EventId);
  const isPrivate = !isLoading && profile?.error && profile.status === 403;
  const isNotFound = !isLoading && profile?.error && profile.status === 404;
  const {showGallery} = useImageGallery();
  const checkMember = !isLoading && !isPrivate;
  const {isRefetching: isRefetchingMember, data: dataMember} = useEventMemberCheck(
    EventId,
    checkMember,
  );
  let isDeactivate: boolean;

  if (dataMember) {
    isDeactivate = dataMember?.code === DEACTIVATED_EVENT_CODE;
  }

  const checkEventStart = checkIfEventStarted(profile?.data?.eventStartTime);
  const {eventCancelAttendRequest} = useEventOperations();
  const isMember =
    dataMember?.data?.status === ACCEPTED &&
    [OWNER, ADMIN, DEFAULT].includes(dataMember?.data?.role as EventRoles);
  const isInviteeOfEvent = isPrivate && dataMember?.data?.status === INVITED;
  const isOwner: boolean = dataMember?.data?.role === OWNER;
  const isAdmin: boolean = dataMember?.data?.role === ADMIN;
  const showCreateContent = isMember && profile?.data?.isPublic ? true : isOwner || isAdmin;

  const isPending: boolean =
    dataMember?.data?.role === DEFAULT && dataMember?.data?.status === PENDING;

  React.useLayoutEffect(() => {
    let title = '';
    if (profile?.data?.title) {
      const name = profile?.data?.title;
      const maxLength = 30;
      title = name.length >= maxLength ? `${name.slice(0, maxLength)}...` : name;
    }

    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => (
      <HeaderTitle title={title} titleTextProps={{textTransform: 'none'}} />
    );

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerTitleAlign: 'center',
      headerRight: () => null,
    });
  }, [navigation, profile]);

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  if (isError) {
    return <Error retry={refetch} />;
  }

  const isProfileDisable = (imageURL: string) => {
    if (imageURL && profile?.data?.isPublic) {
      return false;
    }
    return true;
  };
  const handleTapUserAvtar = () => {
    const avatarReadURL = [
      {
        uri: profile?.data?.croppedAvatarURL,
      },
    ];
    const datas = {
      visible: true,
      imageData: avatarReadURL,
    };
    showGallery(datas);
  };

  const handleTapGroupCover = () => {
    const pictureReadURL = [
      {
        uri: profile?.data?.croppedPictureURL,
      },
    ];
    const datas = {
      visible: true,
      imageData: pictureReadURL,
    };
    showGallery(datas);
  };

  const openEditEvent = () => {
    const data: IEventData = {
      edit: false,
      data: profile?.data,
    };
    navigation.navigate('AddEvent', {
      eventData: data as IEventData,
    });
  };
  const handleOpenAttend = () => {
    if (isPending) {
      eventCancelAttendRequest(profile?.data?.id, dataMember?.data?.id);
      return;
    }
    onOpen();
  };
  const onManageRoles = () => {
    navigation.navigate('ManageRoles', {id: EventId, from: 'event'});
  };

  const handleReactivate = () => {
    handleReActivateEvent(EventId);
  };
  const isActive = profile && profile?.data?.status === 'active';

  const onNewPostPress = () => {
    const tab = ref?.current?.getFocusedTab();

    navigation.navigate('NewPost', {
      from: 'events',
      id: EventId,
      title: profile?.data?.name || '',
    });
  };

  const renderHeader = () => {
    const info = profile?.data;

    if (!info) {
      return null;
    }
    return (
      <View style={styles.topHeader}>
        {info?.croppedPictureURL ? (
          <View style={styles.coverView}>
            <SafeTouchable
              disabled={isProfileDisable(info?.croppedPictureURL)}
              onPress={handleTapGroupCover}>
              <ProgressImage source={{uri: info?.croppedPictureURL}} style={styles.coverImage} />
            </SafeTouchable>
          </View>
        ) : (
          <View style={styles.coverViewBlank} />
        )}
        <View style={styles.metaView}>
          <View style={styles.absUserView}>
            <View style={styles.absUserContent}>
              <SafeTouchable
                disabled={isProfileDisable(info?.croppedAvatarURL ? info?.croppedAvatarURL : '')}
                style={styles.profileImageView}
                onPress={handleTapUserAvtar}>
                <UserAvatar
                  profilePic={info?.croppedAvatarURL}
                  size={PROFILE_IMAGE_SIZE}
                  style={styles.profileImage}
                />
              </SafeTouchable>
              <Text color={colors.black[950]} mx={10} noOfLines={1} style={styles.nameText}>
                {info?.title}
              </Text>
              <Text color={colors.black[900]} style={styles.dateTimeText}>
                {info.eventStartTime && dateFormatter(info.eventStartTime, 'EventDetails')}
              </Text>
              <Text color={colors.black[500]} style={styles.usernameText}>
                {info?.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text color={colors.black[950]} style={styles.countText}>
                {info?.totalAttendees}
              </Text>
              <Text color={colors.black[500]} style={styles.metaText}>
                attendees
              </Text>
            </View>
          </View>

          {isDeactivate && (
            <View style={styles.metabuttonRow}>
              <TouchableOpacity activeOpacity={0.9} onPress={handleReactivate}>
                <View
                  alignItems="center"
                  bg={theme.colors.blue[500]}
                  borderRadius={5}
                  // flexDirection="row"
                  height={8}
                  justifyContent="center"
                  p={2}
                  width={90}>
                  <Caption color={theme.colors.white} fontSize={11} textAlign="center" width="100%">
                    Reactivate
                  </Caption>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.metabuttonRow}>
            {!isRefetchingMember &&
              !isRefetching &&
              !isInviteeOfEvent &&
              !checkEventStart &&
              profile &&
              isActive &&
              dataMember &&
              profile?.data?.status !== CANCELLED && (
                <TouchableOpacity activeOpacity={0.9} onPress={handleOpenAttend}>
                  <View
                    alignItems="center"
                    bg={theme.colors.blue[500]}
                    borderRadius={5}
                    flexDirection="row"
                    height={8}
                    p={2}>
                    <Caption color={theme.colors.white} fontSize={11} mr={2}>
                      {isPending ? 'Cancel Request' : !isMember && 'Attend'}
                      {!isPending &&
                      isMember &&
                      dataMember.data?.attendeeResponseStatus === 'attending'
                        ? 'Attending'
                        : !isPending && dataMember.data?.attendeeResponseStatus === 'not_attending'
                        ? 'Not Attending'
                        : !isPending && dataMember.data?.attendeeResponseStatus === 'maybe'
                        ? 'Maybe'
                        : null}
                    </Caption>
                    {isPending ? null : <ChevronDownIcon color={theme.colors.white} size={5} />}
                  </View>
                </TouchableOpacity>
              )}
          </View>

          {!isRefetchingMember &&
            !isRefetching &&
            !isInviteeOfEvent &&
            profile &&
            isActive &&
            (!checkEventStart || dataMember?.data?.role === OWNER) &&
            dataMember &&
            (isMember ? (
              <View style={styles.ellipse}>
                <OptionIcon size={20} onOpen={sheetActions.onOpen} />
              </View>
            ) : !isPending ? (
              <View style={styles.reactivate}>
                <OptionIcon size={20} onOpen={handleOpenAttend} />
              </View>
            ) : null)}
        </View>
        <AttendEventOption
          from={from}
          isMember={isMember}
          isOpen={isOpen}
          profile={profile?.data}
          responseStatus={dataMember?.data?.attendeeResponseStatus}
          onClose={onClose}
        />
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
        indicatorStyle={styles.tabBarIndicator}
        labelStyle={styles.tabBarLabel}
        style={styles.tabBar}
        tabStyle={{width: Dimensions.get('window').width / 4}}
      />
    );
  };

  if (isNotFound) {
    return (
      <View alignItems="center" flex={1} justifyContent="center">
        <Title fontSize="2xl">Event Not Found</Title>
      </View>
    );
  }

  if (isPrivate) {
    return <Private subtitle="You need an event invite to view this page" title="Private Event" />;
  }

  return (
    <>
      <Tabs.Container
        headerContainerStyle={styles.headerStyle}
        // headerHeight={400}
        pagerProps={{keyboardShouldPersistTaps: 'always'}}
        ref={ref}
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}>
        <Tabs.Tab name="Event">
          <Event {...props} eventId={EventId} isMember={isMember} />
        </Tabs.Tab>
        <Tabs.Tab name="Attendees">
          <Attendees {...props} data={profile?.data} role={dataMember?.data?.role ?? ''} />
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <Media {...props} data={profile?.data} />
        </Tabs.Tab>
        <Tabs.Tab name="Details">
          <Details {...props} data={profile?.data} />
        </Tabs.Tab>
      </Tabs.Container>
      {showCreateContent && (
        <FloatingButton
          bgColor={theme.colors.red[900]}
          icon={<BravvoxBIcon height={20} width={20} />}
          onPress={onNewPostPress}
        />
      )}

      <EventEllipseOptions
        dataMember={dataMember}
        eventId={EventId}
        eventTitle={profile?.data?.title ?? ''}
        handleEditPress={openEditEvent}
        isOpen={sheetActions.isOpen}
        isPrivate={isPrivate}
        role={dataMember?.data?.role ?? ''}
        status={profile?.data?.status ?? ''}
        onClose={sheetActions.onClose}
        onManageRoles={onManageRoles}
      />
    </>
  );
}

EventProfile.propTypes = {};

export default EventProfile;

const styles = StyleSheet.create({
  headerStyle: {
    elevation: 0,
    shadowColor: theme.colors.white,
  },
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
  dateTimeText: {
    fontSize: 14,
  },
  usernameText: {
    fontSize: 12,
    opacity: 0.7,
  },
  metaRow: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metabuttonRow: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  metaCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 18,
    marginVertical: 2,
  },
  metaText: {
    fontSize: 10,
    opacity: 0.7,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  tabBar: {
    backgroundColor: theme.colors.appWhite[700],
    textTransform: 'capitalize',
    height: 51,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[800],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[800],
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
    width: Dimensions.get('window').width / 6,
    marginRight: 18,
    marginLeft: 18,
    height: 3,
    borderRadius: 45,
  },
  tabContainerStyle: {
    alignItems: 'center',
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
  metabuttonRow: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    height: 30,
  },
});
