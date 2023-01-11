/**
 * @format
 */
import React, {useCallback} from 'react';
import {Divider, Spinner, View} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {IBusinessData, useBusinessList} from '../Queries/useBusinessList';
import BusinessListCard from './BusinessListCard';
import SearchInput from '../../../components/SearchInput';

function Recent() {
  const {businessList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useBusinessList('popular');

  const keyExtractor = useCallback(
    (item: IBusinessData, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const renderItem: ListRenderItem<IBusinessData> = ({item}) => <BusinessListCard item={item} />;

  const renderSeparator = () => <Divider my="0.2" />;

  return (
    <View style={styles.container}>
      <SearchInput />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={businessList}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
        ref={ref}
        refreshing={isLoading}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: 50,
  },
});

export default Recent;
