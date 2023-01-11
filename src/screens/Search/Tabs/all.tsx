/**
 * @format
 */
import React, {useCallback, useMemo} from 'react';
import {Divider, SectionList, Spinner, Text, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {SectionListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';
import {isArray, isObject, take} from 'lodash';
import SearchListCard from '../SearchListCard';
import {useSearchAll} from '../Queries/useSearchAll';

export const defaultNewData = [
  {
    type: 'accounts',
    dataKey: 'accountContainer',
    data: [],
    total: 0,
    title: 'People',
  },
  {
    type: 'groups',
    dataKey: 'groupContainer',
    data: [],
    total: 0,
    title: 'Groups',
  },
  {
    type: 'events',
    dataKey: 'eventContainer',
    data: [],
    total: 0,
    title: 'Events',
  },
  {
    type: 'posts',
    dataKey: 'postContainer',
    data: [],
    total: 0,
    title: 'Posts',
  },
];

interface AllTabProps {
  jumpTo: (key: string) => void,
  searchText: string,
  onSearch: (text: string) => void,
  route: {
    key: string;
    title: string;
  }
}

function All({jumpTo, searchText, onSearch, route}: AllTabProps): JSX.Element {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const enabled = route.key === 'all'

  const searchParams = {
    keyword: searchText ? searchText.toLowerCase() : '',
  };
  const {isLoading, refetch, data: searchData} = useSearchAll(searchParams, enabled);
  const keyExtractor = useCallback((item: any, index: number) => `key-${index}-${item.id}`, []);

  const renderItem: SectionListRenderItem<any> = ({item, index, section}) => {
    return <SearchListCard item={item} searchParams={searchParams} section={section} />;
  };

  const renderSeparator = () => <Divider my="0.2" />;

  const data = useMemo(() => {
    const newData = defaultNewData;

    if (searchData && searchData?.data) {
      const nSearchData = searchData?.data;
      newData.map(ele => {
        const {type: dType, dataKey} = ele;
        const allowedKeys = [
          'accountContainer',
          'groupContainer',
          'eventContainer',
          'postContainer',
        ];
        if (allowedKeys.indexOf(dataKey) > -1) {
          const {[dataKey]: dKeyData} = nSearchData;
          if (isObject(dKeyData) && isArray(dKeyData[dType])) {
            const {[dType]: dArray} = dKeyData;
            let maxCount = 5;
            if (dType === 'posts') {
              maxCount = 3;
            }
            ele.data = take(dArray, maxCount);
            ele.total = dKeyData.total;
          }
        }
        return true;
      });
    }
    return newData;
  }, [searchData]);

  const seeAll = (section: any) => {
    if (section?.type === 'accounts') {
      jumpTo('people');
    }

    if (section?.type === 'events') {
      jumpTo('events');
    }

    if (section?.type === 'groups') {
      jumpTo('groups');
    }
  };

  const emptyContent = () => {
    if (!isLoading) {
      if (searchText && searchText !== '' && searchText.length >= 3) {
        return (
          <View style={styles.emptyContainer}>
            <Text>No exact matches found</Text>
          </View>
        );
      }
    }
    return <View style={styles.emptyContainer} />;
  };

  const renderSectionHeader = ({section}: {section: any}) => {
    if (isLoading || !searchText || searchText === '') {
      return null;
    }

    if (!section.total) {
      return null;
    }
    return (
      <View style={styles.sectionView}>
        <View style={styles.sectionTextContainer}>
          <Text fontSize="sm" fontWeight={700}>
            {section.title}
          </Text>
        </View>

        <View style={styles.sectionTextContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => seeAll(section)}>
            <Text color="blue.500" fontSize="sm">{`See All (${section.total})`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={renderSeparator}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyContent}
        ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
        ref={ref}
        refreshing={isLoading}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={data}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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
    paddingBottom: 100,
  },
  emptyContainer: {
    minHeight: '50%',
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionView: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  sectionTextContainer: {
    paddingHorizontal: 5,
  },
});

export default All;
