/**
 * @format
 */
import React, {useCallback} from 'react';
import {useScrollToTop, useNavigation} from '@react-navigation/native';

import {Spinner, Text, theme, View} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {RootStackParamList} from '../../navigation';
import {INewsFeedData} from './types/NewsFeedInterface';
import NewsFeedLayout from './NewsFeed/NewsFeedLayout';
import {useNewsFeed} from './useNewsFeed';
import {DrawerParamList} from '../../navigation/DrawerMenu';
import {KEYBOARD_EXTRA_HEIGHT} from '../../constants/common';
import {Title} from '../../components/Typography';
import UserCard from './NewsFeed/UserCard';
import {useConnectionPeople} from '../ConnectWithPeople/Queries/useConnectionPeople';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RootNavigationType = NativeStackNavigationProp<RootStackParamList, any>;
export type DrawerNavigationType = DrawerNavigationProp<DrawerParamList, any>;

function Home() {
  const navigation = useNavigation<RootNavigationType>();

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useNewsFeed();
  const {peopleList, deleteConnection, deletePeopleFromCache} = useConnectionPeople();

  const renderSeparator = () => <View width={1} />;

  const renderUserItem: ListRenderItem<any> = ({item}) => (
    <UserCard
      deleteConnection={deleteConnection}
      deletePeopleFromCache={deletePeopleFromCache}
      item={item}
    />
  );

  const keyUserExtractor = useCallback((item: any, index: number) => `key-${index}-${item.id}`, []);

  const onSeeAllPress = () => navigation.navigate('ConnectWithPeople');

  const renderItem = (item: INewsFeedData, index: number) => {
    return index === 3 ? (
      <View style={styles.mainContainerStyle}>
        <View style={styles.titleContainerStyle}>
          <Title color={theme.colors.black[500]} fontSize="sm" fontWeight="bold">
            Connections People
          </Title>
          <TouchableOpacity activeOpacity={0.9} onPress={onSeeAllPress}>
            <Text color="blue.500" fontSize="sm" fontWeight="normal">
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userContainerStyle}>
          <FlatList
            horizontal
            data={peopleList}
            extraData={peopleList}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyUserExtractor}
            ref={ref}
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    ) : (
      <NewsFeedLayout
        isMember
        from="home"
        key={item.documentId}
        navigation={navigation}
        newsFeed={item}
      />
    );
  };

  const keyExtractor = useCallback(
    (item: INewsFeedData, index: number) => `key-${index}-${item.documentId}`,
    [],
  );

  return (
    <KeyboardAwareFlatList
      data={feedList}
      extraHeight={KEYBOARD_EXTRA_HEIGHT}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
      ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
      ref={ref}
      refreshing={isLoading}
      renderItem={({item, index}) => renderItem(item, index)}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  titleContainerStyle: {justifyContent: 'space-between', flexDirection: 'row', padding: 10},
  userContainerStyle: {flexDirection: 'row', justifyContent: 'space-between'},
  mainContainerStyle: {padding: 10},
});

export default Home;
