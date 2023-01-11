import user from './user/UserReducer';
import profile from './profile/ProfileReducer';
import gallery from './gallery/GalleryReducer';
import fullScreenPostReducer from './fullPostView/FullPostViewReducer';

const reducers = {
  user,
  profile,
  gallery,
  fullScreenPostReducer
};

export default reducers;
