export interface INotificationData {
  commentId: string;
  notificationAt: string;
  inviterUsername: string;
  businessPageTitle: string;
  inviteeUsername: string;
  userPicThumb: string;
  postName: string;
  hasClicked: number;
  name: string;
  notificationId: string;
  postId: string;
  senderId: string;
  senderPicThumb: string;
  type: number;
  username: string;
  groupPicThumb: string;
  posterProfilePicThumb: string;
  eventThumbPic: string;
  milestoneAmount: string;
  groupName: string;
  posterName: string;
  posterId: string;
  msg: string;
  inviterName: string;
  groupId: string;
  eventTitle: string;
  eventId: string;
  inviterId: string;
  influencerStatus: boolean;
}
export interface IResponseData {
  data: INotificationData[];
  error: boolean;
  isFromCache: boolean;
  message: string;
  status: number;
  pageNo: number;
}
