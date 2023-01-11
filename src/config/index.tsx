import Config from 'react-native-config';

export const config = {
  AUTH_API_URL: `${Config.BASE_URL}/auth/v1/`,
  USER_PROFILE_API_URL: `${Config.BASE_URL}/account/v1/accounts/`,
  GROUP_API_URL: `${Config.BASE_URL}/group/v1/`,
  CONTENT_API_URL: `${Config.BASE_URL}/content/v1/`,
  NEWSFEED_API_URL: `${Config.BASE_URL}/newsfeed/v1/`,
  COMMENT_API_URL: `${Config.BASE_URL}/content/v1/`,
  PRIVACY_API_URL: `${Config.BASE_URL}/account/v1/accounts/`,
  EVENTS_API_URL: `${Config.BASE_URL}/event/v1/`,
  RELATIONSHIP_API_URL: `${Config.BASE_URL}/relationship/v1/`,
  CONTENT_MODERATION_API_URL: `https://moderation.bravvox.com/services/admin/v1/`,
  NEW_CONTENT_MODERATION_API_URL: `https://newmoderation.bravvox.com/services/admin/v1/`,
  BUSINESS_PAGE_API_URL: `${Config.BASE_URL}/businessPage/v1/`,
  NOTIFICATION_PAGE_API_URL: `${Config.BASE_URL}/notification/v1/`,
  GROUP_PROFILE_DETAIL_API_URL: `${Config.BASE_URL}/group/v1/`,
  UPDATE_ACCOUNT_API_URL: `${Config.BASE_URL}/account/v1/accounts/update`,
  UPLOAD_PROFILE_PHOTO: `${Config.BASE_URL}/account/v1/accounts/uploadphoto`,
  UPLOAD_COVER_PHOTO: `${Config.BASE_URL}/account/v1/accounts/uploadcoverphoto`,
  UPDATE_USER_DETAIL: `${Config.BASE_URL}/account/v1/accounts/updateuserdetails`,
  GROUP_LIKE_API_URL: `${Config.BASE_URL}/group/v1/group/`,
  EVENT_LIKE_API_URL: `${Config.BASE_URL}/event/v1/event/`,
  USER_NAME_UPDATE: `${Config.BASE_URL}/account/v1/accounts/update-name-and-username`,
  MESSENGER_API_URL: `${Config.BASE_URL}/messenger/v1/`,
  SEARCH_API_URL: `${Config.BASE_URL}/search/v1/`,
  POST_API_URL: `${Config.BASE_URL}/popular/posts?`,
  CONNECTIONS_API_URL: `${Config.BASE_URL}/connections/v1/`,
};

export const APP_BASE_URL = Config.BASE_URL;
