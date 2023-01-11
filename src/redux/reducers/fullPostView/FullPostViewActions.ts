import {Dispatch} from 'redux';
import {IFullScreenPostActions, IFullScreenPostData} from './FullPostViewInterface';
import {FullScreenPostTypes} from './FullPostViewTypes';

export const openFullPostView = (data: IFullScreenPostData) => {
  return (dispatch: Dispatch<IFullScreenPostActions>) => {
    dispatch({
      type: FullScreenPostTypes.OPENPOSTVIEW,
      payload: data,
    });
  };
};

export const closeFullPostView = () => {
  return (dispatch: Dispatch<IFullScreenPostActions>) => {
    dispatch({
      type: FullScreenPostTypes.HIDEPOSTVIEW,
    });
  };
};
