import {IFullScreenPostState, IFullScreenPostActions} from './FullPostViewInterface';
import {FullScreenPostTypes} from './FullPostViewTypes';

const initialState: IFullScreenPostState = {
  visible: false,
  fullScreenPost: undefined,
  id: '',
  from: '',
  isMember: false,
  userName: '',
};

const fullScreenPostReducer = (
  state: IFullScreenPostState = initialState,
  action: IFullScreenPostActions,
) => {
  switch (action.type) {
    case FullScreenPostTypes.OPENPOSTVIEW:
      return {
        ...state,
        visible: action.payload.visible,
        fullScreenPost: action.payload.fullScreenPost,
        id: action.payload.id,
        from: action.payload.from,
        isMember: action.payload.isMember,
        userName: action.payload.userName,
      };
    case FullScreenPostTypes.HIDEPOSTVIEW:
      return {
        ...state,
        visible: false,
        fullScreenPost: undefined,
        id: '',
        from: '',
        isMember: false,
      };
    default:
      return state;
  }
};

export default fullScreenPostReducer;
