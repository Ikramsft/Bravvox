import {IProfileState, IProfileActions} from './ProfileInterface';
import {ProfileTypes} from './ProfileTypes';

const initialState: IProfileState = {
  loading: false,
  currentProfile: null,
};

const userReducer = (
  state: IProfileState = initialState,
  action: IProfileActions,
) => {
  switch (action.type) {
    case ProfileTypes.GET_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case ProfileTypes.GET_PROFILE_PENDING:
      return {
        ...state,
        loading: true,
      };
    case ProfileTypes.GET_PROFILE_FULFILLED:
      return {
        ...state,
        loading: false,
        currentProfile: action.payload.data[0],
      };
    case ProfileTypes.GET_PROFILE_REJECTED:
      return {
        ...state,
        loading: false,
        currentProfile: null,
      };
    default:
      return state;
  }
};

export default userReducer;
