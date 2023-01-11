import React, {useState} from 'react';
import {StyleSheet, Linking, Platform, Dimensions} from 'react-native';
import {Spinner, Text, useTheme, View} from 'native-base';
import {TabBarProps, Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Posts from './posts';
import Photos from './photos';
import Followers from './followers';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import {RootNavigationType} from '../Home';
import {ProgressImage} from '../../components/Common';
import {useUserProfile} from './Queries/useUserProfile';
import Error from '../../components/Error';
import SafeTouchable from '../../components/SafeTouchable';
import MediaPicker, {IAssetType, PickerHandle} from '../../components/MediaPicker';
import {ConditionalWrapper} from '../../components/ConditionalWrapper';
import {validateImage} from '../../utils/validator';
import {IRelationshipInfo, IUserData} from '../../redux/reducers/user/UserInterface';
import {ImageUpdateType, useUpdateAvatar} from './useUpdateAvatar';
import UserAvatar from '../../components/UserAvatar';
import FloatingButton from '../../components/FloatingButton';
import {calculateImageHeightWidth, isValidHttpUrl, truncateUsername} from '../../utils';
import About from './About';
import ProfileEllipseOptions from './profileEllipseOptions';
import {useProfileOperations} from './Queries/useProfileOperations';
import EditProfilePiker, {EditProfileHandle} from '../../components/EditProfilePiker';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {BravvoxBIcon} from '../../assets/svg/index';
import TermsAndConditionDialog from '../Home/NewsFeed/TremsAndConditionDialog';
import details from '../Home/NewsFeed/termsandcondition.json';

const PROFILE_IMAGE_SIZE = 100;

export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function Profile(props: ProfileScreenProps) {
  const {route} = props;
  const {userName, userId} = route.params;
  const navigation = useNavigation<RootNavigationType>();
  const mediaPicker = React.useRef<PickerHandle>(null);
  const {isLoading, data, isError, refetch} = useUserProfile(userName);
  const {colors}= useTheme();

  const [tabIndex, setTabIndex] = React.useState(0);

  const {onOpen, isOpen, onClose} = useProfileOperations();
  const userData = data as IUserData;
  const editProfilePicker = React.useRef<EditProfileHandle>(null);
  const [type, setType] = React.useState<ImageUpdateType>('avatar');
  const [postCount, setPostCount] = React.useState(0);
  const {coverLoading, avatarLoading, tryUpdatePicture} = useUpdateAvatar(userName, userId, type);
  const Relationship = userData?.relationshipInfo?.Relationship;
  const ownProfile = userData?.relationshipInfo.Relationship === 'self';
  const [isTermsOpen, setTermsOpen] = useState(false);

  const ellipsesPress = () => editProfilePicker.current?.onPickerSelect();

  const onOptionPress = () => {
    if (ownProfile) {
      ellipsesPress();
    } else {
      onOpen();
    }
  };

  React.useLayoutEffect(() => {
    let title = '';
    if (userData?.name) {
      const name = userData?.name;
      const maxLength = 20;
      title = name.length >= maxLength ? `${name.slice(0, maxLength)}...` : name;
    }
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={title} />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const maxLocationLength = 100;
  const userLocation: string =
    userData?.location?.length >= maxLocationLength
      ? `${userData?.location?.slice(0, maxLocationLength)}...`
      : userData?.location;

  const addressURL: any = Platform.select({
    ios: `maps:0,0?q=${userData?.location}`,
    android: `geo:0,0?q=${userData?.location}`,
  });

  const onAddressClick = () => Linking.openURL(addressURL);

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  if (isError) {
    return <Error retry={refetch} />;
  }

  const onAvatarPress = () => {
    setType('avatar');
    mediaPicker.current?.onPickerSelect();
  };

  const onCoverPress = () => {
    setType('cover');
    mediaPicker.current?.onPickerSelect();
  };

  const onSelectImage = (file: IAssetType) => {
    if (file) {
      const name = file.fileName ?? '';
      const fileType = file.type ?? '';
      const size = file.fileSize ?? 0;
      if (name !== '' && fileType !== '' && size !== 0) {
        if (validateImage(name, fileType, size, 100)) {
          tryUpdatePicture(file);
        }
      }
    }
  };

  const onNewPostPress = () => navigation.navigate('NewPost', {from: 'profile', title: ''});

  const renderHeader = () => {
    const {
      profilePic,
      coverCroppedPic,
      profileCroppedPic,
      name,
      relationshipInfo: {FollowedCount, FollowingCount} = {} as IRelationshipInfo,
    } = userData || ({} as IUserData);
    const sizeOfImage = coverCroppedPic ? calculateImageHeightWidth(coverCroppedPic) : {};
    return (
      <View style={styles.topHeader}>
        <View style={styles.coverView}>
          <ConditionalWrapper
            condition={false}
            wrapper={
              // eslint-disable-next-line react/no-unstable-nested-components
              children => (
                <SafeTouchable activeOpacity={0.9} disabled={coverLoading} onPress={onCoverPress}>
                  {children}
                </SafeTouchable>
              )
            }>
            <>
              <ProgressImage
                key={profilePic}
                source={{uri: coverCroppedPic}}
                style={{...styles.coverImage, ...sizeOfImage}}
              />
              {coverLoading && <Spinner bottom={60} color="white" position="absolute" />}
            </>
          </ConditionalWrapper>
        </View>
        <View style={styles.metaView}>
          <View style={styles.absUserView}>
            <View style={styles.absUserContent}>
              <ConditionalWrapper
                condition={false}
                wrapper={
                  // eslint-disable-next-line react/no-unstable-nested-components
                  children => (
                    <SafeTouchable
                      activeOpacity={0.9}
                      disabled={avatarLoading}
                      onPress={onAvatarPress}>
                      {children}
                    </SafeTouchable>
                  )
                }>
                <>
                  <UserAvatar
                    influencerIconStyle={styles.influencerIconStyle}
                    influencerSize={22}
                    influencerStatus={userData?.influencerStatus}
                    profilePic={profileCroppedPic}
                    size={PROFILE_IMAGE_SIZE}
                    style={styles.profileImage}
                  />
                  {avatarLoading && <Spinner bottom={40} color="white" position="absolute" />}
                </>
              </ConditionalWrapper>
            </View>
            <SafeTouchable activeOpacity={0.9} style={styles.optionIcon} onPress={onOptionPress}>
              <Entypo color={theme.colors.gray[400]} name="dots-three-horizontal" size={18} />
            </SafeTouchable>
          </View>
          <View style={styles.locationView}>
            <Text numberOfLines={3} style={styles.nameText}>
              {name}
            </Text>
            <Text style={styles.usernameText}>@{truncateUsername(userName)}</Text>
            {userData?.location && userData?.website ? (
              <View style={styles.mainDataView}>
                <Text numberOfLines={3} style={styles.fontStyle}>
                  {userLocation ? (
                    <Text numberOfLines={2} onPress={onAddressClick}>
                      <Ionicons name="location-outline" size={14} />
                      {userLocation}{' '}
                    </Text>
                  ) : null}
                  {userData?.website ? (
                    <Text color={colors.blue[500]} onPress={openUrl}>
                      <MaterialCommunityIcons color={colors.black[500]} name="web" size={14} /> {userData?.website}{' '}
                    </Text>
                  ) : null}
                </Text>
              </View>
            ) : null}
            <Text numberOfLines={2} style={styles.profileTaglineStyle}>
              {userData?.profileTagline}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.countText}>{postCount}</Text>
              <Text style={styles.metaText}>posts</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.countText}>{FollowedCount}</Text>
              <Text style={styles.metaText}>followers</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.countText}>{FollowingCount}</Text>
              <Text style={styles.metaText}>following</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const openUrl = async () => {
    if (userData?.website) {
      Linking.openURL(isValidHttpUrl(userData?.website));
    }
  };
  const openTermsAndConditionDialog = () => {
    setTermsOpen(!isTermsOpen);
  };
  const renderTabBar = (params: TabBarProps<TabName>) => {
    return (
      <MaterialTabBar
        {...params}
        activeColor={theme.colors.black[900]}
        contentContainerStyle={styles.tabContainerStyle}
        getLabelText={(name: TabName) => name.toString()}
        inactiveColor={theme.colors.black[300]}
        indicatorStyle={styles.tabBarIndicator}
        labelStyle={styles.tabBarLabel}
        scrollEnabled={false}
        style={styles.tabBar}
      />
    );
  };

  return (
    <>
      <Tabs.Container
        headerContainerStyle={styles.headerContainerStyle}
        headerHeight={400}
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}>
        <Tabs.Tab name="Posts">
          <Posts {...props} postCount={postCount} setPostCount={setPostCount} userId={userId} />
        </Tabs.Tab>
        <Tabs.Tab name="Media">
          <Photos {...props}  userId={userId} />
        </Tabs.Tab>
        <Tabs.Tab name="Followers">
          <Followers {...props} ownProfile={ownProfile} userId={userId} />
        </Tabs.Tab>
        <Tabs.Tab name="About">
          <About userInfo={userData} {...props} />
        </Tabs.Tab>
      </Tabs.Container>
      {ownProfile && tabIndex === 0 && (
        <FloatingButton
          bgColor={theme.colors.red[900]}
          icon={<BravvoxBIcon height={20} width={20} />}
          onPress={onNewPostPress}
        />
      )}
      <MediaPicker options={{mediaType: 'photo'}} ref={mediaPicker} onSelectImage={onSelectImage} />
      <EditProfilePiker
        ref={editProfilePicker}
        onSelectOption={() => navigation.navigate('EditProfile')}
      />
      <ProfileEllipseOptions
        isOpen={isOpen}
        relationship={Relationship}
        userId={userId}
        userName={userName}
        onClose={onClose}
      />
      <TermsAndConditionDialog
        body={details?.terms}
        handleClose={openTermsAndConditionDialog}
        open={isTermsOpen}
      />
    </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  topHeader: {
    flex: 2,
    minHeight: 200,
  },
  coverView: {
    flex: 2,
    backgroundColor: theme.colors.white,
  },
  coverImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 100,
    backgroundColor: theme.colors.black[200],
  },
  absUserView: {
    position: 'absolute',
    top: -(PROFILE_IMAGE_SIZE / 2),
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
  profileImage: {
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: theme.colors.white,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  nameText: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 2,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  usernameText: {
    fontSize: 12,
    opacity: 0.5,
  },
  locationView: {
    width: '100%',
    marginTop: PROFILE_IMAGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  metaRow: {
    width: '100%',
    marginTop: 20,
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
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    color: theme.colors.black[900],
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
  optionIcon: {
    position: 'absolute',
    end: 26,
    top: PROFILE_IMAGE_SIZE / 2 + 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  profileTaglineStyle: {
    marginTop: 3,
    marginHorizontal: 26,
  },
  mainDataView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  fontStyle: {
    flex: 1,
    marginTop: 3,
    textAlign: 'center',
  },
  influencerIconStyle: {
    position: 'absolute',
    bottom: 10,
    right: 5,
  },
  headerContainerStyle: {
    shadowOpacity: 0,
    elevation: 0,
    borderColor: theme.colors.gray[100],
    borderBottomWidth: 1,
  },
});
