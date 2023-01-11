import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {TabView} from 'react-native-tab-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQueryClient} from 'react-query';
import {debounce, findIndex} from 'lodash';
import {View} from 'native-base';
import {HomeTabParamList} from '../../navigation/HomeTabs';
import All from './Tabs/all';
import People from './Tabs/people';
import Groups from './Tabs/groups';
import Events from './Tabs/events';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import HeaderTitle from '../../components/HeaderTitle';
import {RootStackParamList} from '../../navigation';
import {QueryKeys} from '../../utils/QueryKeys';
import SearchBox from './SearchBox';

export type SearchScreenProps = BottomTabScreenProps<HomeTabParamList, 'Search'>;

export type RootNavigationType = NativeStackNavigationProp<RootStackParamList, any>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    height: 50,
  },
  dotView: {
    height: 1,
    width: 1,
    position: 'relative',
  },
  flex: {flex: 1},
});

const TABS = [
  {key: 'all', title: 'All'},
  {key: 'people', title: 'People'},
  {key: 'groups', title: 'Groups'},
  {key: 'events', title: 'Events'},
];

const INTERVAL = 500;
function SearchScreen(props: SearchScreenProps) {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const layout = useWindowDimensions();

  const navigation = useNavigation<RootNavigationType>();

  const [index, setIndex] = React.useState(0);

  const searchHandler = debounce((text: string) => onSearch(text), INTERVAL, {
    leading: true,
    trailing: false,
    maxWait: INTERVAL,
  });

  const onSearch = useCallback(
    (text: string) => {
      if (text !== '' && text.length >= 3) {
        if (TABS[index].key === 'all') {
          const cacheKey = [QueryKeys.searchAll, TABS[index].key];
          queryClient.invalidateQueries(cacheKey);
        } else {
          const cacheKey = [QueryKeys.searchApi, TABS[index].key];
          queryClient.invalidateQueries(cacheKey);
        }
        setSearchText(text);
      } else {
        setSearchText(text);
      }
    },
    [index, queryClient],
  );

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      searchHandler(text);
    },
    [searchHandler],
  );

  React.useLayoutEffect(() => {
    const headerTitle = () => <HeaderTitle title="" />;
    navigation.setOptions({headerTitle});
  }, [navigation]);

  const renderScene = () => {
    const route = TABS[index];
    switch (index) {
      case 0:
        return (
          <All jumpTo={jumpTo} route={route} searchText={searchText} onSearch={handleSearch} />
        );
      case 1:
        return (
          <People jumpTo={jumpTo} route={route} searchText={searchText} onSearch={handleSearch} />
        );
      case 2:
        return (
          <Groups jumpTo={jumpTo} route={route} searchText={searchText} onSearch={handleSearch} />
        );
      case 3:
        return (
          <Events jumpTo={jumpTo} route={route} searchText={searchText} onSearch={handleSearch} />
        );
      default:
        return null;
    }
  };

  const jumpTo = (key: string) => {
    const jIndex = findIndex(TABS, i => i.key === key);
    if (jIndex > -1) {
      setIndex(jIndex);
    }
  };

  const placeholder = useMemo(() => {
    switch (index) {
      case 0:
        return 'Search for People or Content';
      case 1:
        return 'Search for People';
      case 2:
        return 'Search for Groups';
      case 3:
        return 'Search for Events';
      default:
        return 'Search';
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TabView
          initialLayout={{width: layout.width}}
          navigationState={{index, routes: TABS}}
          renderScene={() => null}
          renderTabBar={props1 => <CustomTopTabBar {...props1} isConnection />}
          sceneContainerStyle={styles.dotView}
          onIndexChange={setIndex}
        />
      </View>

      <View style={styles.flex}>
        <SearchBox defaultValue={searchText} placeholder={placeholder} onSearch={handleSearch} />
        {renderScene()}
      </View>
    </View>
  );
}

export default SearchScreen;
