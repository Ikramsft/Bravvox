import React from 'react';
import EventCard from './Cards/EventCard';
import GroupCard from './Cards/GroupCard';
import PostCard from './Cards/PostsCard';
import UserCard from './Cards/UserCard';

type Props = {
  item: any;
  section: any;
  searchParams?: any;
};

function SearchListCard(props: Props) {
  const {item, section, searchParams} = props;

  if (section?.type === 'accounts') {
    return <UserCard item={item} searchParams={searchParams} />;
  }

  if (section?.type === 'events') {
    return <EventCard item={item} />;
  }

  if (section?.type === 'groups') {
    return <GroupCard item={item} />;
  }

  if (section?.type === 'posts') {
    return <PostCard item={item} />;
  }

  return null;
}

SearchListCard.defaultProps = {
  searchParams: null,
};

export default SearchListCard;
