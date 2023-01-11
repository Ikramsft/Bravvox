import {FromType} from '../../../screens/Home/NewsFeed/Interactions';
import {INewsFeedData} from '../../../screens/Home/types/NewsFeedInterface';
import {FullScreenPostTypes} from './FullPostViewTypes';

interface IFullScreenPostOpen {
  type: FullScreenPostTypes.OPENPOSTVIEW;
  payload: IFullScreenPostData;
}
interface IFullScreenPostStateHide {
  type: FullScreenPostTypes.HIDEPOSTVIEW;
}

export interface IFullScreenPostData {
  visible: boolean;
  fullScreenPost: INewsFeedData | undefined;
  id: string;
  from: FromType;
  isMember: boolean;
  userName:string;
}
export interface IFullScreenPostState {
  visible: boolean;
  fullScreenPost: INewsFeedData | undefined;
  id: string;
  from: FromType|'';
  isMember: boolean;
  userName:string;
}
export type IFullScreenPostActions = IFullScreenPostOpen | IFullScreenPostStateHide;
