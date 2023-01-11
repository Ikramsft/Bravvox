import React from 'react';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Orientation from 'react-native-orientation';
import RNBootSplash from 'react-native-bootsplash';
import {useColorMode} from 'native-base';
import {useDispatch} from 'react-redux';

import SignUp from '../screens/Auth/SignUp';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import Login from '../screens/Auth/Login';
import CheckEmail from '../screens/Auth/CheckEmail';
import Profile from '../screens/Profile/index';
import {navTheme} from '../theme';
import HomeTabs from './HomeTabs';
import DrawerMenu from './DrawerMenu';
import PostCreation from '../screens/PostCreation';
import Notifications from '../screens/Notifications';
import GroupProfile from '../screens/GroupProfile';
import Comments from '../screens/Comments';
import EditProfile from '../screens/EditProfile';
import useUserInfo from '../hooks/useUserInfo';
import {navigationRef} from './navigationRef';
import {FromType} from '../screens/Home/NewsFeed/Interactions';
import AddGroup from '../screens/Groups/AddGroup';
import AddEvent from '../screens/Events/AddEvent';
import EditGroup from '../screens/Groups/EditGroup';
import ManageRoles from '../screens/GroupProfile/ManageRoles/ManageRoles';
import {IGroupFormType} from '../screens/Groups/AddGroup/useGroupForm';
import AccountDetails from '../screens/Settings/AccountDetails';
import Security from '../screens/Security';
import BusinessProfile from '../screens/BusinessProfile';
import BusinessCreate from '../screens/BusinessCreate';
import {ACTIONFROM} from '../screens/GroupProfile/Queries/useGroupMember';
import InviteFriends from '../screens/InviteFriends';
import NotificationSettings from '../screens/NotificationSettings';
import {IBusinessData} from '../screens/BusinessProfile/types/BusinessInterfaces';
import EditPost from '../screens/EditPost';
import {IComments, INewsFeedData} from '../screens/Home/types/NewsFeedInterface';
import SinglePost from '../screens/SinglePost';
import EventProfile from '../screens/EventProfile';
import {IEventData} from '../screens/Events/types/EventInterfaces';
import Privacy from '../screens/Privacy';
import Theme from '../screens/Theme';
import ChatList from '../screens/Chat/ChatList';
import ChatDetail from '../screens/Chat/ChatDetail';
import Settings from '../screens/Settings/index';
import Help from '../screens/Help';
import ControlMyContent from '../screens/ControlMyContent';
import BusinessPages from '../screens/BusinessPage';
import GetStartedStepOne from '../screens/GetStarted/StepOne';
import GetStartedStepTwo from '../screens/GetStarted/StepTwo';
import GetStartedStepThree from '../screens/GetStarted/StepThree';
import GetStartedStepFour from '../screens/GetStarted/StepFour';
import GetStartedStepFive from '../screens/GetStarted/StepFive';
import GetStartedStepSix from '../screens/GetStarted/StepSix';
import GetStartedStepSeven from '../screens/GetStarted/StepSeven';
import ChangePassword from '../screens/Auth/ChangePassword';
import Landing from '../screens/Auth/Landing';
import {IChannelListData} from '../screens/Chat/types/ChatInterfaces';
import NewMessage from '../screens/Chat/NewMessage';
import RecentActivity from '../screens/RecentActivity';
import {getUserProfile, getMessengerProfile} from '../redux/reducers/user/UserServices';
import {IUserData} from '../redux/reducers/user/UserInterface';
import FullScreenPost from '../components/FullScreenPost';

export type PostCreationTypeFrom = 'profile' | 'home' | 'business' | 'groups' | 'group'| 'events';
export type NewPostParams = {from: PostCreationTypeFrom; id?: string; title: string};
export type EditPostParams = {
  from: PostCreationTypeFrom;
  id?: string;
  title: string;
  newsFeed: INewsFeedData;
};
export type deletePostParams = {
  from: PostCreationTypeFrom;
  id?: string;
};

export type SinglePostParams = {
  documentId?: string;
  userName: string;
  from: FromType;
  isMember: boolean;
  id?: string;
  focus?: boolean | undefined;
  editComment?: IComments | undefined;
  feedData?: INewsFeedData;
};

export type RootStackParamList = {
  HomeTabs: undefined;
  Landing: undefined;
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  CheckEmail: {email: string};
  ForgotPassword: undefined;
  GetStartedStepOne: undefined;
  GetStartedStepTwo: undefined;
  GetStartedStepThree: undefined;
  GetStartedStepFour: {selectedCategories?: string[]};
  GetStartedStepFive: undefined;
  GetStartedStepSix: undefined;
  GetStartedStepSeven: undefined;
  NewPost: NewPostParams;
  Profile: {userName: string; userId: string};
  Notifications: undefined;
  GroupProfile: {groupId: string};
  AddEvent: {eventData: IEventData};
  AddGroup: undefined;
  EditGroup: {groupId: string; groupInfo: IGroupFormType};
  ManageRoles: {id: string; from: ACTIONFROM};
  Comments: {documentId: string; from: FromType; id: string; isMember?: boolean};
  DrawerMenu: undefined;
  EditProfile: undefined;
  AccountDetails: undefined;
  Security: undefined;
  BusinessProfile: {businessId: string; title: string};
  InviteFriends: undefined;
  NotificationSettings: undefined;
  BusinessCreate: {businessData: IBusinessData};
  Events: undefined;
  EditPost: EditPostParams;
  EventProfile: {EventId: string; title: string; from?: string};
  SinglePost: SinglePostParams;
  Privacy: undefined;
  ChatList: undefined;
  NewMessage: undefined;
  ChatDetail: {chatMessage: IChannelListData};
  Settings: undefined;
  Help: undefined;
  ControlMyContent: undefined;
  BusinessPages: undefined;
  ChangePassword: {tokenId: string};
  Search: undefined;
  RecentActivity: undefined;
  Theme: undefined;
  FullScreenPost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefixes: string[] = ['bravvox://*.bravvox.com/', 'bravvox://bravvox.com/', 'bravvox://'];

const linking: LinkingOptions<RootStackParamList> = {
  prefixes,
  config: {
    screens: {
      ChangePassword: {
        path: '/update-password/:tokenId',
      },
      GroupProfile: {
        path: 'groups/:groupId',
      },
    },
  },
};

function NavContainer() {
  const {colorMode} = useColorMode();

  const {isLoggedIn, documentId, isFirstLogin, isWizardPassed} = useUserInfo();
  const dispatch = useDispatch();

  React.useEffect(() => {
    Orientation.lockToPortrait();
    if (isLoggedIn && documentId) {
      dispatch(getUserProfile(documentId));
      dispatch(getMessengerProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReady = () => RNBootSplash.hide({fade: true});

  const showWizard = isFirstLogin || !isWizardPassed;

  return (
    <NavigationContainer
      independent
      linking={linking}
      ref={navigationRef}
      theme={navTheme[colorMode || 'light']}
      onReady={onReady}>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen component={Landing} name="Landing" />
            <Stack.Screen component={Login} name="Login" />
            <Stack.Screen component={SignUp} name="SignUp" />
            <Stack.Screen component={ForgotPassword} name="ForgotPassword" />
            <Stack.Screen component={CheckEmail} name="CheckEmail" />
            <Stack.Screen component={ChangePassword} name="ChangePassword" />
          </Stack.Group>
        ) : null}
        {showWizard ? (
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen component={GetStartedStepOne} name="GetStartedStepOne" />
            <Stack.Screen component={GetStartedStepTwo} name="GetStartedStepTwo" />
            <Stack.Screen component={GetStartedStepThree} name="GetStartedStepThree" />
            <Stack.Screen component={GetStartedStepFour} name="GetStartedStepFour" />
            <Stack.Screen component={GetStartedStepFive} name="GetStartedStepFive" />
            <Stack.Screen component={GetStartedStepSix} name="GetStartedStepSix" />
            <Stack.Screen component={GetStartedStepSeven} name="GetStartedStepSeven" />
          </Stack.Group>
        ) : null}
        {isLoggedIn && !showWizard ? (
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen component={DrawerMenu} name="DrawerMenu" />
            <Stack.Screen component={EditProfile} name="EditProfile" />
            <Stack.Screen component={HomeTabs} name="HomeTabs" />
            <Stack.Screen component={PostCreation} name="NewPost" />
            <Stack.Screen component={Profile} name="Profile" />
            <Stack.Screen component={Notifications} name="Notifications" />
            <Stack.Screen component={GroupProfile} name="GroupProfile" />
            <Stack.Screen component={AddGroup} name="AddGroup" />
            <Stack.Screen component={AddEvent} name="AddEvent" />
            <Stack.Screen component={EditGroup} name="EditGroup" />
            <Stack.Screen component={ManageRoles} name="ManageRoles" />
            <Stack.Screen component={Comments} name="Comments" />
            <Stack.Screen component={AccountDetails} name="AccountDetails" />
            <Stack.Screen component={Security} name="Security" />
            <Stack.Screen component={BusinessProfile} name="BusinessProfile" />
            <Stack.Screen component={InviteFriends} name="InviteFriends" />
            <Stack.Screen component={NotificationSettings} name="NotificationSettings" />
            <Stack.Screen component={BusinessCreate} name="BusinessCreate" />
            <Stack.Screen component={EditPost} name="EditPost" />
            <Stack.Screen component={SinglePost} name="SinglePost" />
            <Stack.Screen component={EventProfile} name="EventProfile" />
            <Stack.Screen component={Privacy} name="Privacy" />
            <Stack.Screen component={Theme} name="Theme" />
            <Stack.Screen component={ChatList} name="ChatList" />
            <Stack.Screen component={NewMessage} name="NewMessage" />
            <Stack.Screen component={ChatDetail} name="ChatDetail" />
            <Stack.Screen component={Settings} name="Settings" />
            <Stack.Screen component={Help} name="Help" />
            <Stack.Screen component={ControlMyContent} name="ControlMyContent" />
            <Stack.Screen component={BusinessPages} name="BusinessPages" />
            <Stack.Screen component={RecentActivity} name="RecentActivity" />
            <Stack.Screen component={FullScreenPost} name="FullScreenPost" />
          </Stack.Group>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavContainer;
