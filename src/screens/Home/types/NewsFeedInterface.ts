/**
 * @format
 */
export interface IUserInfo {
  documentId?: string;
  name: string;
  profilePic: string;
  userName: string;
  profilePicThumb: string;
  setting: {privacy: string};
  status: string;
  influencerStatus: boolean;
}

export interface IComments {
  userInfo: IUserInfo;
  // commentLikeCount: number;
  commentText: string;
  commentsDeleted: null;
  contentId: string;
  createdAt: string;
  documentId: string;
  replies: null;
  type: string;
  updatedAt: string;
  userId: string;
  isLiked: boolean;
  isDisLiked: boolean;
  likesCount: number;
  unLikesCount: number;
  finalModRating: number;
}

type ContentDataType = 'video' | 'image' | 'text' | '';
type ContentStatusType = 'SUSPENDED' | '' | null | 'PUBLISHED' | 'EYE';

interface IRevoxUserInfo {
  documentId: string;
  name: string;
  userName: string;
  status: string;
  profilePic: string;
  profilePicThumb: string;
  setting: {
    privacy: string;
  };
  influencerStatus: string;
}

export interface IGroupInfo {
  documentID: string;
  avatarReadUrl: string;
  name: string;
}

export interface IEventInfo {
  documentID: string;
  avatarReadUrl: string;
  name: string;
}

type PostType = 'group' | 'event' | 'profile';
export interface INewsFeedData {
  type: PostType;
  groupInfo?: IGroupInfo;
  eventInfo?: IEventInfo;
  caption: string;
  isEye: boolean;
  contentStatus: ContentStatusType;
  isEyeView?: boolean | undefined;
  comments: IComments[];
  commentsCount: number;
  contentDataType: ContentDataType;
  createdAt: string;
  documentId: string;
  isDisLiked: boolean;
  isLiked: boolean;
  isFlagged: boolean;
  likesCount: number;
  imageContentLink: IImageContentLink[];
  videoContentLink: IVideoContentLink[];
  shareCount: number;
  shareWith: string;
  tags: string;
  textContent: string;
  unLikesCount: number;
  updatedAt: string;
  userId: string;
  userInfo: IUserInfo;
  revoxingUserInfo: IRevoxUserInfo;
  isRevox: boolean;
  finalModRating: number;
}

export interface IState {
  loading: boolean;
  isCommentLoading: boolean;
  isContentCreationLoading: boolean;
  isPopularNowLoading: boolean;
  isReportAbuseLoading: boolean;
  newsFeedPage: number;
  newsFeedData: INewsFeedData[];
  loadNextPage: boolean;
  initialLoad: boolean;
  popularNowData: IPopularNowData[];
}

export interface IContentCreationRequestData {
  mediaContent: string | Blob | null;
  tags: string;
  contentDataType: string;
  textContent: string;
  shareWith: string;
}

export interface INewsFeedPayload {
  data: INewsFeedData[];
  pageNumber: number;
  loadNextPage: boolean;
}

export interface INewsFeedResponseData {
  data: INewsFeedData[];
  error: boolean;
  isFromCache: boolean;
  message: string;
  pageNo: number;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

export interface IPopularNowData {
  commentsCount: number;
  contentDataType: string;
  createdAt: string;
  documentId: string;
  likesCount: number;
  shareCount: number;
  shareWith: string;
  tags: string;
  textContent: string;
  unLikesCount: number;
  updatedAt: string;
  userId: string;
  userInfo: IUserInfo;
  imageContentLink: IImageContentLink[];
  videoContentLink: IVideoContentLink[];
}

export interface IImageContentLink {
  high?: string;
  imageSize?: number;
  original?: string;
  small?: string;
  overlay?: string;
}

type EncodedStatusType = 'complete' | '' | null;

export interface IVideoContentLink {
  VideoPath?: string;
  VideoSize?: number;
  displayImageLink?: string;
  displayImageSize?: number;
  videoEncodeStatus?: EncodedStatusType;
  original: string;
}

export interface IPopularNowResponseData {
  data: IPopularNowData[];
  error: boolean;
  message: string;
  status: number;
}

export interface ICommentCreateRequestData {
  contentId: string;
  comment: string;
  commentId: string;
}

export interface IReportComment {
  commentId: string;
  contentId: string;
  contentType: string;
  reason: string;
}

export interface ICommentUpdateRequestData {
  contentId: string;
  commentId: string;
  comment: string;
}

export interface ICommentDeleteRequestData {
  contentId: string;
  commentId: string;
}

export type ReactionType = 'nil' | 'like' | 'dislike' | '';

export interface ILikeDisLikeRequestData {
  contentId: string;
  like: boolean;
  dislike: boolean;
  reaction: ReactionType;
}
export interface ILikeDisLikeGroupRequestData {
  id: string;
  contentId: string;
  isLike: boolean;
  isLikeReaction: boolean;
  isDisLikeReaction: boolean;
  like: boolean;
  dislike: boolean;
  reaction: ReactionType;
}

export interface ILikeDisLikeComment {
  contentId: string;
  commentId: string;
  dislike: boolean;
  like: boolean;
  reaction: ReactionType;
}

export interface IFollowings {
  documentId: string;
  name: string;
  profilePicThumb: string;
  relationship: string;
  userId: number;
  userName: string;
  influencerStatus: boolean;
}

export interface IReportAbuseRequestData {
  reason: string;
  contentType: ContentDataType;
  contentId: string;
}
