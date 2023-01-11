import React from 'react';
import EventCard from './Cards/EventCard';
import GroupCard from './Cards/GroupCard';
import UserCard from './Cards/UserCard';

type Props = {
  item: any;
};

function ConnectListCard(props: Props) {
  const {item} = props;

  if (item?.type === 'user') {
    return <UserCard item={item} />;
  }

  if (item?.type === 'group') {
    return <GroupCard item={item} />;
  }

  if (item?.type === 'event') {
    return <EventCard item={item} />;
  }

  return null;
}

export default ConnectListCard;
