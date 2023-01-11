/**
 * @format
 */
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {userLogout} from './UserActions';

export const useUserLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const logoutUser = async () => {
    await dispatch(userLogout());
    queryClient.cancelQueries();
    queryClient.clear();
  };

  return {
    logoutUser,
  };
};
