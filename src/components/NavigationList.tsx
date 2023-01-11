/**
 * @format
 */
import React from 'react';
import {FlatList, IInputProps, Text} from 'native-base';
import {ListRenderItem, StyleProp, ViewStyle} from 'react-native';
import SafeTouchable from './SafeTouchable';

export interface INavItem {
  title: string;
  id: string;
  from: string;
}
export interface IArrayData {
  data: INavItem[];
  title: string;
  isActive: boolean;
}

interface GroupMemberItemProps {
  navItem: INavItem;
  selectedId: string;
  onSelect: (item: INavItem) => void;
}

function NavigationItem(props: GroupMemberItemProps) {
  const {navItem, selectedId, onSelect} = props;
  const {title, id} = navItem;

  const onItemPress = () => onSelect(navItem);

  const selected = selectedId === id;
  const sStyle: IInputProps = {color: selected ? 'black.1000' : 'black.500'};

  return (
    <SafeTouchable onPress={onItemPress}>
      <Text fontSize="md" textTransform="capitalize" {...sStyle} mr="3">
        {title}
      </Text>
    </SafeTouchable>
  );
}

interface INavListProps {
  data: INavItem[];
  selectedId: string;
  onSelect: (item: INavItem) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function NavigationList(props: INavListProps) {
  const {data, selectedId, onSelect, contentContainerStyle} = props;

  const renderItem: ListRenderItem<INavItem> = ({item}) => (
    <NavigationItem navItem={item} selectedId={selectedId} onSelect={onSelect} />
  );

  return (
    <FlatList
      horizontal
      contentContainerStyle={contentContainerStyle}
      data={data}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
}

NavigationList.defaultProps = {
  contentContainerStyle: undefined,
};
