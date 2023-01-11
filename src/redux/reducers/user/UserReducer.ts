import {IUserState, IUserActions, IUserData} from './UserInterface';
import {UserTypes} from './UserTypes';

const initialState: IUserState = {
  loading: false,
  isLoggedIn: false,
  isFirstLogin: true,
  token: null,
  refreshToken: null,
  documentId: null,
  username: null,
  verifyingEmail: false,
  user: {} as IUserData,
  isWizardPassed: false,
};

const userReducer = (state: IUserState = initialState, action: IUserActions) => {
  switch (action.type) {
    case UserTypes.REFRESH_TOKEN_PENDING:
      return {
        ...state,
        loading: true,
      };
    case UserTypes.REFRESH_TOKEN_FULFILLED: {
      const {data} = action?.payload || {};
      return {
        ...state,
        token: data.accessToken,
        loading: false,
        isLoggedIn: data.accessToken && data.accessToken !== '',
      };
    }
    case UserTypes.REFRESH_TOKEN_REJECTED:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        loading: false,
        isFirstLogin: false,
        documentId: null,
        username: null,
        verifyingEmail: false,
        user: {} as IUserData,
      };

    case UserTypes.SIGNUP_PENDING:
      return {
        ...state,
        loading: true,
      };
    case UserTypes.SIGNUP_FULFILLED:
      return {
        ...state,
        loading: false,
      };
    case UserTypes.SIGNUP_REJECTED:
      return {
        ...state,
        loading: false,
      };
    case UserTypes.LOGIN_PENDING:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
      };
    case UserTypes.LOGIN_FULFILLED: {
      return {
        ...state,
        ...action.payload.data,
      };
    }
    case UserTypes.LOGIN_REJECTED:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
      };
    case UserTypes.GET_PROFILE_PENDING:
      return {
        ...state,
        loading: true,
      };
    case UserTypes.GET_PROFILE_FULFILLED:
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.data[0],
        },
      };
    case UserTypes.GET_PROFILE_REJECTED:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
      };
    case UserTypes.UPDATE_PROFILE_PIC:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case UserTypes.UPDATE_COVER_PIC:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case UserTypes.GET_MESSENGER_PROFILE_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          haveNewMessages: action.payload.data.haveNewMessages,
        },
      };
    case UserTypes.UPDATE_MESSENGER_INDICATOR:
      return {
        ...state,
        user: {
          ...state.user,
          haveNewMessages: action.payload.haveNewMessages,
        },
      };
    case UserTypes.UPDATE_USER_FIRST_LOGIN:
      return {
        ...state,
        isFirstLogin: false,
        isWizardPassed: true, // TODO: Update this based on user profile response (GET_PROFILE_FULFILLED) It should be in api response // Check CON-22899
      };
    case UserTypes.UPDATE_USER_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          userName: action.payload.userName,
          name: action.payload.name,
        },
      };
    case UserTypes.UPDATE_USER_NAME_FIRST_SCREEN: {
      const {username, name} = action?.payload || {};
      return {
        ...state,
        user: {...state.user, username, name},
      };
    }
    case UserTypes.FORGET_PASSWORD_PENDING:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
      };
    case UserTypes.FORGET_PASSWORD_FULFILLED:
      return {
        ...state,
        loading: false,
      };
    case UserTypes.FORGET_PASSWORD_REJECTED:
      return {
        ...state,
        loading: false,
      };
    case UserTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        loading: false,
        isFirstLogin: false,
        documentId: null,
        username: null,
        verifyingEmail: false,
        user: {} as IUserData,
      };
    case UserTypes.UPDATE_PROFILE_ACCOUNT:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          name: action.payload.name,
          website: action.payload.website,
          bio: action.payload.bio,
          location: action.payload.location,
          profileTagline: action.payload.profileTagline,
          facebookAccount: action.payload.facebookAccount,
          twitterAccount: action.payload.twitterAccount,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
