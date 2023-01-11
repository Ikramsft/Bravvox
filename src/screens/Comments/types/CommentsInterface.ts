import {IUserInfo} from '../../Home/types/NewsFeedInterface';

export interface ICommentCreateRequestData {
  contentId: string;
  comment: string;
}

export interface IComments {
  userInfo: IUserInfo;
  commentLikeCount: number;
  commentText: string;
  commentsDeleted: null;
  contentId: string;
  createdAt: string;
  documentId: string;
  replies: null;
  type: string;
  updatedAt: string;
  userId: string;
}
export interface ICommentPage {
  data: IComments[];
  pageNo: number;
  hasNext: boolean;
}
export interface ICommentPages {
  pages: ICommentPage[];
  pageParams?: number[];
}
