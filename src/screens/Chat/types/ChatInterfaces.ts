/**
 * @format
 */

import {IMessage} from 'react-native-gifted-chat';

export interface IChannelMessage extends IMessage {
  channel: string;
  content: string;
  id: string;
  self: boolean;
  senderID: string;
  type: string;
  createAt: string;
  updateAt: string;
  text: string;
  isDeleted?: boolean;
}

export interface IMemberData {
  userId: string;
  name: string;
  profilePic: string;
  isOwner: boolean;
  isOnline: boolean;
  influencerStatus: boolean;
}

export interface IChannelListData {
  channelId: string;
  lastMessage: string;
  lastMessageByUser: string;
  memebers: IMemberData[];
  messageDate: string;
  unReadedCount: number;
  isMuted: boolean;
}

export interface IChannelListResponseData {
  data: IChannelListData[];
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IChannelHistoryResponseData {
  data: IChannelMessage[];
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}
