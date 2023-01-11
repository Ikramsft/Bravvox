/* eslint-disable @typescript-eslint/no-explicit-any */
import {useNavigation, CommonActions} from '@react-navigation/native';
import React, {useCallback} from 'react';
import useUserInfo from '../../../hooks/useUserInfo';
import {getNotificationType} from '../../../utils';
import {RootNavigationType} from '../../Home';
import {INotificationData} from '../Types/NoticiationInterface';

export function withRedirection(WrappedComponent: any) {
  function ComponentWithRedirection(props: any) {
    const navigation = useNavigation<RootNavigationType>();
    const {user} = useUserInfo();
    const openProfile = useCallback(
      (userName: string, userId: string) => {
        navigation.push('Profile', {userName, userId});
      },
      [navigation],
    );

    const onPressMsg = (selected: INotificationData) => {
      const {type} = selected;
      const userName = selected?.username || selected?.posterName;
      const userId = selected?.senderId || selected?.posterId;
      switch (getNotificationType(type)) {
        case 'profile':
          navigation.replace('Profile', {userName, userId});
          break;
        case 'post':
          navigation.replace('SinglePost', {
            documentId: selected.postId,
            userName,
            from: 'home',
            isMember: true,
            id: selected.senderId,
            focus: false,
          });
          break;
        case 'selfPost':
          navigation.replace('SinglePost', {
            documentId: selected.postId,
            userName: user.userName,
            from: 'profile',
            id: selected.senderId,
            focus: false,
            isMember: true,
          });
          break;
        case 'groupProfile':
          navigation.replace('GroupProfile', {groupId: selected?.groupId});
          break;
        case 'groupProfileSingleScreen':
          navigation.dispatch(
            CommonActions.reset({
              index: 2,
              routes: [
                {name: 'DrawerMenu'},
                {
                  name: 'GroupProfile',
                  params: {groupId: selected?.groupId},
                },
                {
                  name: 'SinglePost',
                  params: {
                    documentId: selected.postId,
                    userName,
                    from: 'group',
                    isMember: true,
                    id: selected.groupId,
                    focus: false,
                  },
                },
              ],
            }),
          );
          break;
        case 'eventProfile':
          navigation.replace('EventProfile', {
            EventId: selected?.eventId,
            title: selected?.eventTitle,
            from: 'notifications',
          });
          break;
        case 'eventProfileSingleScreen':
          navigation.dispatch(
            CommonActions.reset({
              index: 2,
              routes: [
                {name: 'DrawerMenu'},
                {
                  name: 'EventProfile',
                  params: {
                    EventId: selected?.eventId,
                    title: selected?.eventTitle,
                    from: 'notifications',
                  },
                },
                {
                  name: 'SinglePost',
                  params: {
                    documentId: selected.postId,
                    userName,
                    from: 'event',
                    isMember: true,
                    id: selected.eventId,
                    focus: false,
                  },
                },
              ],
            }),
          );
          break;
        default:
          break;
      }
    };
    return <WrappedComponent {...props} openProfile={openProfile} onPressMsg={onPressMsg} />;
  }

  return ComponentWithRedirection;
}
