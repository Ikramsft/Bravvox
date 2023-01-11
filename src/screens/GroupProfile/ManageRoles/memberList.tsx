/**
 * @format
 */
import React, {useCallback, useState} from 'react';
import {StyleSheet, ListRenderItem, FlatList, Keyboard} from 'react-native';
import {KeyboardAvoidingView, Spinner, Text, useDisclose, View} from 'native-base';
import _ from 'lodash';
import {IMembersData} from '../../Groups/types/GroupInterfaces';
import {theme} from '../../../theme';
import Empty from '../../../components/EmptyComponent';
import SearchInput from '../../../components/SearchInput';
import AddGroupAdmin, {PickerHandle} from './AddGroupAdmin';
import FloatingButton from '../../../components/FloatingButton';
import GroupAdminListItem from './GroupAdminListItem';
import AdminEllipseOptions from './AdminEllipseOptions';
import {ACTIONFROM} from '../Queries/useGroupMember';
import {SubTitle} from '../../../components/Typography';

interface IMemberList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  id: string;
  userId: string;
  from: ACTIONFROM;
  refetch: () => void;
  onEndReached: () => void;
}
function MemberList(props: IMemberList) {
  const {list, navigation, refetch, onEndReached, isFetchingNextPage, userId, isLoading, id, from} =
    props;
  console.log('props', JSON.stringify(props, null, 2));
  const {isOpen, onOpen, onClose} = useDisclose();
  const [search, setSearch] = useState('');
  const [member, setMember] = useState<IMembersData | undefined>(undefined);

  const addGroupAdmin = React.useRef<PickerHandle>(null);

  const openProfile = useCallback(
    (item: IMembersData) => {
      const {user_id, userName} = item;
      navigation.push('Profile', {userName, userId: user_id});
    },
    [navigation],
  );

  const onOptionPress = useCallback(
    (item: IMembersData) => {
      Keyboard.dismiss();
      setMember(item);
      onOpen();
    },
    [onOpen],
  );

  const renderItem: ListRenderItem<IMembersData> = ({item}) => {
    return (
      <GroupAdminListItem
        showMenu
        memberInfo={item}
        openProfile={openProfile}
        userId={userId}
        onOptionPress={onOptionPress}
      />
    );
  };

  const keyExtractor = useCallback(
    (item: IMembersData, index: number) => `group-member-${index}-${item.id}`,
    [],
  );

  const openAddGroupAdmin = () => {
    if (addGroupAdmin?.current) {
      addGroupAdmin?.current?.onPickerSelect();
    }
  };

  const strIncludes = (str1: string, str2: string) => {
    return str1.toLowerCase().includes(str2.toLowerCase());
  };

  const filterData = () => {
    if (list && list.length) {
      if (search && search.trim() !== '') {
        const searchStr = search.trim();
        const filterFn = (i: IMembersData) => {
          return strIncludes(i.name, searchStr) || strIncludes(i.userName, searchStr);
        };
        return _.filter(list, filterFn);
      }
    }
    return list;
  };

  const subTitle = () => {
    switch (from) {
      case 'group':
        return `There needs to be at least one Owner of a Group. After you add a new Admin user you'll be able to make them Owners of the Group.`;
      case 'business':
        return `There can be only one Owner of a Business page. After you add a new Admin user you'll be able to make them the Owner of the Business page.`;
      case 'event':
        return `There needs to be at least one Owner of an Event. After you add a new Admin user you'll be able to make them Owners of the Event.`;
      default:
        return '';
    }
  };
  const listData = filterData();

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={350} style={styles.flex}>
      <FlatList
        data={listData}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          isLoading ? null : (
            <Empty title={from === 'event' ? 'No Attendee yet..' : 'No Members yet..'} />
          )
        }
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={
          <>
            <Text
              alignSelf="center"
              fontSize="md"
              fontWeight="bold"
              pb="3"
              pt="3"
              textAlign="center">
              Manage Roles
            </Text>
            {from === 'business' ? (
              <View pb={2} px={15}>
                <SubTitle textAlign="center">
                  There can be only one Owner of a Business page. After you add a new Admin user
                  you'll be able to make them the Owner of the Business page.
                </SubTitle>
              </View>
            ) : from === 'event' ? (
              <View pb={2} px={15}>
                <SubTitle textAlign="center">
                  There needs to be at least one Owner of an Event. After you add a new Admin user
                  you'll be able to make them Owners of the Event.
                </SubTitle>
              </View>
            ) : (
              <View pb={2} px={15}>
                <SubTitle textAlign="center">
                  There needs to be at least one Owner of a Group. After you add a new Admin user
                  you'll be able to make them Owners of the Group.
                </SubTitle>
              </View>
            )}
            <SearchInput value={search} onChangeText={val => setSearch(val)} />
          </>
        }
        refreshing={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
      <AdminEllipseOptions from={from} id={id} isOpen={isOpen} member={member} onClose={onClose} />
      <AddGroupAdmin from={from} id={id} ref={addGroupAdmin} />
      <FloatingButton onPress={openAddGroupAdmin} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: 0,
    marginTop: 0,
    backgroundColor: theme.colors.white,
  },
  flex: {
    flex: 1,
  },
});

export default MemberList;
