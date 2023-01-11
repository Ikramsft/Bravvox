/**
 * @format
 */
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  openFullPostView,
  closeFullPostView,
} from '../../redux/reducers/fullPostView/FullPostViewActions';
import {IFullScreenPostData} from '../../redux/reducers/fullPostView/FullPostViewInterface';
import {RootNavigationType} from '../../screens/Home';

export const useFullScreenPost = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationType>();
  const showPost = (data: IFullScreenPostData) => {
    dispatch(openFullPostView(data));
    navigation.navigate('FullScreenPost')

  };

  const hidePost = () => {
    dispatch(closeFullPostView());
    navigation.goBack()
  };

  return {showPost, hidePost};
};
