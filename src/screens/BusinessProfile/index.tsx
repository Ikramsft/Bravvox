import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Text, View, Button, Spinner} from 'native-base';
import {TabBarProps, Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';
import {RootStackParamList} from '../../navigation';
import {useBusinessProfile} from './Queries/useBusinessDetail';
import SafeTouchable from '../../components/SafeTouchable';
import UserAvatar from '../../components/UserAvatar';
import {OptionIcon, ProgressImage} from '../../components/Common';
import {SCREEN_WIDTH} from '../../constants/common';
import {theme} from '../../theme';
import {useImageGallery} from '../../components/ImageGallery/useImageGallery';
import {Title} from '../../components/Typography';
import Posts from './Tabs/Posts';
import Media from './Tabs/Media';
import Followers from './Tabs/Followers';
import Events from './Tabs/Events';
import {useBusinessCheckMember} from './Queries/useBusinessCheckMember';
import Private from '../../components/Private';
import About from './Tabs/About';
import {useBusinessOperations} from './Queries/useBusinessOperations';
import BusinessEllipseOptions from './businessEllipseOptions';
import {
  BusinessPageFollowerStatus,
  BusinessPageRoles,
  BusinessPageStatus,
  IBusinessData,
} from './types/BusinessInterfaces';
import Error from '../../components/Error';
import FloatingButton from '../../components/FloatingButton';
import {useBusinessMember} from './Queries/useBusinessMember';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';

export type BusinessProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessProfile'
>;

const PROFILE_IMAGE_SIZE = 100;
const {OWNER, ADMIN, DEFAULT} = BusinessPageRoles;
const {ACCEPTED, INVITED, PENDING} = BusinessPageFollowerStatus;
const {DEACTIVATED} = BusinessPageStatus;

function BusinessProfile(props: BusinessProfileScreenProps) {
  const {route, navigation} = props;
  const {title, businessId} = route.params || '';
  const {onOpen, isOpen, onClose, handleReActivateBusiness} = useBusinessOperations();

  const {handleJoinBusinessActivity, handleCancelRequestActivity, isLoadingShow} =
    useBusinessMember();
  const {showGallery} = useImageGallery();

  const {isLoading, data: profile, isError, isRefetching, refetch} = useBusinessProfile(businessId);
  const isPrivate = !isLoading && profile?.error && profile.status === 403;
  const isNotFound = !isLoading && profile?.error && profile.status === 404;
  const isBusinessActive = !isLoading && profile?.data?.status === 'active';
  const checkMember = !isLoading && !isPrivate;
  const {isRefetching: isRefetchingMember, data: dataMember} = useBusinessCheckMember(
    businessId,
    checkMember,
  );
  const isMember =
    dataMember?.data?.status === ACCEPTED &&
    [OWNER, ADMIN, DEFAULT].includes(dataMember?.data?.role as BusinessPageRoles);

  const isInviteeOfPrivateBusiness = isPrivate && dataMember?.data?.status === INVITED;

  const isPending: boolean =
    dataMember?.data?.role === DEFAULT && dataMember?.data?.status === PENDING;

  const onClickReactivate = () => handleReActivateBusiness(businessId);
  const onFollow = () => handleJoinBusinessActivity(businessId);
  const onCancel = () => handleCancelRequestActivity(businessId, dataMember?.data?.id);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => (
      <HeaderTitle title={title} titleTextProps={{textTransform: 'none'}} />
    );
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation, title]);

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }
  if (isError) {
    return <Error retry={refetch} />;
  }
  const onNewPostPress = () =>
    navigation.navigate('NewPost', {from: 'business', id: businessId, title});
  const isOwner: boolean = dataMember?.data?.role === OWNER;
  const isAdmin: boolean = dataMember?.data?.role === ADMIN;
  const showCreateContent = isMember && profile?.data?.postingIsPublic ? true : isOwner || isAdmin;
  const isProfileDisable = (imageURL: string) => {
    if (imageURL && (isMember || !profile?.data?.isPrivate)) {
      return false;
    }
    return true;
  };

  const handleTapBusinessAvtar = () => {
    const avatarReadURL = [
      {
        uri: profile?.data?.avatarReadURL,
      },
    ];
    const datas = {
      visible: true,
      imageData: avatarReadURL,
    };
    showGallery(datas);
  };

  const handleTapBusinessCover = () => {
    const pictureReadURL = [
      {
        uri: profile?.data?.pictureReadURL,
      },
    ];
    const datas = {
      visible: true,
      imageData: pictureReadURL,
    };
    showGallery(datas);
  };

  const onManageRoles = () => {
    navigation.navigate('ManageRoles', {id: businessId, from: 'business'});
  };

  const openEditBusiness = () => {
    const data: IBusinessData = {
      edit: false,
      data: profile?.data,
    };
    navigation.navigate('BusinessCreate', {
      businessData: data as IBusinessData,
    });
  };

  if (isNotFound) {
    return (
      <View alignItems="center" flex={1} justifyContent="center">
        <Title fontSize="2xl">Business Page Not Found</Title>
      </View>
    );
  }
  if (isPrivate) {
    return (
      <Private subtitle="You need to be invited to see the Page's feed" title="Private Page" />
    );
  }

  const renderHeader = () => {
    const info = profile?.data;
    return (
      <View style={styles.topHeader}>
        {info?.pictureReadURL ? (
          <View style={styles.coverView}>
            <SafeTouchable
              disabled={isProfileDisable(info?.pictureReadURL)}
              onPress={handleTapBusinessCover}>
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
                onPress={handleTapBusinessAvtar}>
                <UserAvatar
                  influencerStatus={info?.influencerStatus}
                  profilePic={info?.avatarReadURL}
                  size={PROFILE_IMAGE_SIZE}
                  style={styles.profileImage}
                />
              </SafeTouchable>
              <Text mx={10} noOfLines={1} style={styles.nameText}>
                {info?.name}
              </Text>
              <Text style={styles.usernameText}>{info?.tagline}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.countText}>{info?.totalFollowersCount}</Text>
              <Text style={styles.metaText}>followers</Text>
            </View>
          </View>

          {!isRefetchingMember &&
            !isRefetching &&
            !isInviteeOfPrivateBusiness &&
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
                  {isMember ? 'Invite' : isPending ? 'Cancel Request' : 'Follow'}
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
        indicatorStyle={styles.tabBarIndicator}
        labelStyle={styles.tabBarLabel}
        style={styles.tabBar}
        tabStyle={{width: Dimensions.get('window').width / 5}}
      />
    );
  };
  return (
    <>
      <Tabs.Container
        headerHeight={400}
        pagerProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}>
        <Tabs.Tab name="Posts">
          <Posts
            businessId={businessId}
            isBusinessActive={isBusinessActive}
            isMember={isMember}
            navigation={navigation}
            route={route}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <Media
            businessId={businessId}
            isInviteeOfPrivateBusiness={isInviteeOfPrivateBusiness}
            isMember={isMember}
            navigation={navigation}
            route={route}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Followers">
          <Followers
            businessId={businessId}
            isMember={isBusinessActive}
            loading={isLoading}
            navigation={navigation}
            role={dataMember?.data?.role ?? ''}
            route={route}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Events">
          <Events />
        </Tabs.Tab>
        <Tabs.Tab name="About">
          <About data={profile?.data} {...props} />
        </Tabs.Tab>
      </Tabs.Container>
      <BusinessEllipseOptions
        businessId={businessId}
        handleEditPress={openEditBusiness}
        isOpen={isOpen}
        memberId={dataMember?.data?.id ?? ''}
        role={dataMember?.data?.role ?? ''}
        status={profile?.data?.status ?? ''}
        onClose={onClose}
        onManageRoles={onManageRoles}
      />
      {showCreateContent && <FloatingButton name="pencil" onPress={onNewPostPress} />}
    </>
  );
}
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
    fontSize: 12,
    opacity: 0.5,
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
    fontSize: 18,
    marginVertical: 2,
  },
  metaText: {
    fontSize: 10,
    opacity: 0.5,
    textTransform: 'uppercase',
  },
  tabBar: {
    backgroundColor: theme.colors.appWhite[700],
    textTransform: 'capitalize',
    height: 51,
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
});
export default BusinessProfile;
