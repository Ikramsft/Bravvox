export interface IComments {
  userInfo: IUserInfo;
  commentLikeCount: number;
  commentText: string;
  status: string;
  commentsDeleted: null;
  contentId: string;
  createdAt: string;
  documentId: string;
  replies: null;
  type: string;
  updatedAt: string;
  userId: string;
}

export interface INewsFeedData {
  caption: string;
  contentStatus: string;
  comments: IComments[];
  commentsCount: number;
  contentDataType: string;
  createdAt: string;
  documentId: string;
  isDisLiked: boolean;
  isLiked: boolean;
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

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

export interface IContentCreationRequestData {
  mediaContent: string | Blob | File | null;
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

export interface IUserInfo {
  documentId?: string;
  name: string;
  profilePic: string;
  userName: string;
}

export interface IImageContentLink {
  high?: string;
  imageSize?: number;
  original?: string;
  small?: string;
}

export interface IVideoContentLink {
  VideoPath?: string;
  VideoSize?: number;
  displayImageLink?: string;
  displayImageSize?: number;
  videoEncodeStatus?: string;
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

export interface ILikeDisLikeRequestData {
  contentId: string;
  like: boolean;
  dislike: boolean;
  reaction: string;
}
