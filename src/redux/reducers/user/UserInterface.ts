import {UserTypes} from './UserTypes';

interface ISignUp {
  type: UserTypes.SIGNUP;
}

interface ISignUpRequest {
  type: UserTypes.SIGNUP_PENDING;
}

interface ISignUpSuccess {
  type: UserTypes.SIGNUP_FULFILLED;
  payload: ISignUpResponse;
}

interface ISignUpError {
  type: UserTypes.SIGNUP_REJECTED;
}
interface ILogin {
  payload: any;
  type: UserTypes.LOGIN;
}
interface ILoginRequest {
  type: UserTypes.LOGIN_PENDING;
}
interface ILoginSuccess {
  type: UserTypes.LOGIN_FULFILLED;
  payload: {
    data: {
      token: string;
      documentId: string;
      username: string;
      refreshToken: string;
      isFirstLogin: boolean;
      isWizardPassed: boolean;
    };
  };
}
interface ILoginError {
  type: UserTypes.LOGIN_REJECTED;
}

interface IRefreshToken {
  payload: any;
  type: UserTypes.REFRESH_TOKEN;
}
interface IRefreshTokenRequest {
  type: UserTypes.REFRESH_TOKEN_PENDING;
}
interface IRefreshTokenSuccess {
  type: UserTypes.REFRESH_TOKEN_FULFILLED;
  payload: {
    data: {
      accessToken: string;
    };
  };
}
interface IRefreshTokenError {
  type: UserTypes.REFRESH_TOKEN_REJECTED;
}

interface IGetProfile {
  payload: any;
  type: UserTypes.GET_PROFILE;
}

interface IGetProfileRequest {
  type: UserTypes.GET_PROFILE_PENDING;
}
interface IGetProfileSuccess {
  type: UserTypes.GET_PROFILE_FULFILLED;
  payload: {data: IUserData[]};
}
interface IGetProfileError {
  type: UserTypes.GET_PROFILE_REJECTED;
}

interface IGetMessengerProfile {
  payload: any;
  type: UserTypes.GET_MESSENGER_PROFILE;
}

interface IGetMessengerProfileRequest {
  type: UserTypes.GET_MESSENGER_PROFILE_PENDING;
}

interface IGetMessengerProfileSuccess {
  type: UserTypes.GET_MESSENGER_PROFILE_FULFILLED;
  payload: {
    data: {
      documentId: string;
      haveNewMessages: boolean;
      isMuted: boolean;
      onlineIndicator: boolean;
    };
  };
}
interface IGetMessengerProfileError {
  type: UserTypes.GET_MESSENGER_PROFILE_REJECTED;
}

interface IUpdateProfilePic {
  payload: {profilePic: string};
  type: UserTypes.UPDATE_PROFILE_PIC;
}
interface IUpdateCoverPic {
  payload: {coverPic: string};
  type: UserTypes.UPDATE_COVER_PIC;
}
interface IUpdateUsername {
  payload: {userName: string | undefined; name: string | undefined};
  type: UserTypes.UPDATE_USER_NAME;
}

interface IUpdateMessengerIndicator {
  payload: {haveNewMessages: boolean};
  type: UserTypes.UPDATE_MESSENGER_INDICATOR;
}

interface ILogout {
  type: UserTypes.LOGOUT;
}

interface IUpdateUsernameFirstScreen {
  payload: {username: string | undefined; name: string | undefined};
  type: UserTypes.UPDATE_USER_NAME_FIRST_SCREEN;
}

interface IReset {
  type: UserTypes.RESET;
}

interface IResetRequest {
  type: UserTypes.RESET_PENDING;
}

interface IResetSuccess {
  type: UserTypes.RESET_FULFILLED;
  payload: IResetData;
}

interface IResetError {
  type: UserTypes.RESET_REJECTED;
}

interface IForget {
  type: UserTypes.FORGET_PASSWORD;
}

interface IForgetRequest {
  type: UserTypes.FORGET_PASSWORD_PENDING;
}

interface IForgetSuccess {
  type: UserTypes.FORGET_PASSWORD_FULFILLED;
  // payload: IForgetData;
}

interface IForgetError {
  type: UserTypes.FORGET_PASSWORD_REJECTED;
}
interface IFirstLogin {
  type: UserTypes.UPDATE_USER_FIRST_LOGIN;
}
interface IUpdateAccount {
  type: UserTypes.UPDATE_PROFILE_ACCOUNT;
  payload: {
    name: string;
    website: string;
    bio: string;
    location: string;
    profileTagline: string;
    facebookAccount: string;
    twitterAccount: string;
  };
}

export type IUserActions =
  | IRefreshToken
  | IRefreshTokenRequest
  | IRefreshTokenSuccess
  | IRefreshTokenError
  | ISignUp
  | ISignUpRequest
  | ISignUpSuccess
  | ISignUpError
  | ILogin
  | ILoginRequest
  | ILoginSuccess
  | ILoginError
  | IGetProfile
  | IGetProfileRequest
  | IGetProfileSuccess
  | IGetProfileError
  | IGetMessengerProfile
  | IGetMessengerProfileRequest
  | IGetMessengerProfileSuccess
  | IGetMessengerProfileError
  | IUpdateProfilePic
  | IUpdateUsername
  | IUpdateMessengerIndicator
  | IUpdateUsernameFirstScreen
  | ILogout
  | IReset
  | IResetRequest
  | IResetSuccess
  | IResetError
  | IForget
  | IForgetRequest
  | IForgetSuccess
  | IUpdateAccount
  | IUpdateCoverPic
  | IForgetError
  | IFirstLogin;

export interface ISignUpResponse {
  documentId: string;
  username: string;
}

export interface ILoginRequestData {
  Username: string;
  password: string;
}

export interface IResetState {
  loading: boolean;
  ResetPwdResponse: IResetData;
}

export interface IResetData {
  password: string;
  token: any;
}

export interface IForgetState {
  loading: boolean;
  forgetPwdResponse: IForgetData;
}

export interface IForgetData {
  username: string;
}

export interface IUserState {
  loading: boolean;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  isWizardPassed: boolean;
  token: string | null;
  refreshToken: string | null;
  documentId: string | null;
  username: string | null;
  verifyingEmail: boolean;
  user: IUserData;
}

export type RelationShip =
  | 'self'
  | 'requested'
  | 'none'
  | 'follow'
  | 'follower'
  | 'following me'
  | 'following'
  | 'approve follower'
  | 'follow back'
  | 'reject'
  | 'blocked'
  | 'unblock';

export interface IRelationshipInfo {
  FollowedCount: number;
  FollowingCount: number;
  Relationship: RelationShip;
}

export type CropperAttributes = {
  canvasData: {
    height: number;
    left: number;
    naturalHeight: number;
    naturalWidth: number;
    top: number;
    width: number;
  };
  cropBoxData: {
    height: number;
    left: number;
    top: number;
    width: number;
  };
  data: {
    height: number;
    rotate: number;
    scaleX: number;
    scaleY: number;
    width: number;
    x: number;
    y: number;
  };
};

export interface PicCroppedDetails extends CropperAttributes {
  minZoom: number;
  zoom: number;
}

export interface IUserData {
  aboveThirteen: boolean;
  bio: string;
  city: string;
  college: string;
  coverPic: string;
  coverCroppedPic: string;
  dob: string;
  documentId: string;
  education: string;
  email: string;
  emailVerificationCount: number;
  gender: string;
  homeTown: string;
  isVerified: boolean;
  isVerifiedTemp: boolean;
  location: string;
  name: string;
  notificationPreference: string;
  phone: string;
  profilePic: string;
  profilePicThumb: string;
  profileTagline: string;
  relationshipInfo: IRelationshipInfo;
  setFollower: boolean;
  setSubscriber: boolean;
  status: string;
  tempEmail: string;
  tncAccepted: boolean;
  updatedAt: string;
  userName: string;
  influencerStatus: boolean;
  verifiedUsing: string;
  website: string;
  facebookAccount: string;
  twitterAccount: string;
  profileCroppedPic: string;
  profilePicCroppedDetails: PicCroppedDetails;
  coverPicCroppedDetails: PicCroppedDetails;
  haveNewMessages: boolean;
}

export interface ISignUpRequestData {
  // name: string;
  // username: string;
  email: string;
  password: string;
  aboveThirteen: boolean;
  tncAccepted: boolean;
  referralCode?: string;
  isContentCreator?: boolean;
  isVerified?: boolean;
}

export interface IUPdateUserNameFirstScreen {
  name: string;
  username: string;
}

export interface IUpdateAccountRequestData {
  name: string;
  website: string;
  bio: string;
  location: string;
  profileTagline: string;
  facebookAccount: string;
  twitterAccount: string;
}
export interface IUpdateProfilePhoto {
  data: string;
  canvasData: string;
  cropBoxData: string;
  minZoom: string;
  zoom: string;
  originalFile: string;
  croppedFile: string;
}
