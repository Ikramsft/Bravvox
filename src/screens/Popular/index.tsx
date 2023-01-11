import React from 'react';
import {useWindowDimensions} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {TabView, SceneMap} from 'react-native-tab-view';
import {HomeTabParamList} from '../../navigation/HomeTabs';
import All from './Tabs/All';
import Post from './Tabs/Post';
import Hashtags from './Tabs/Hashtags';
import People from './Tabs/People';
import CustomTopTabBar from '../../components/CustomTopTabBar';

export type GroupsScreenProps = BottomTabScreenProps<HomeTabParamList, 'Popular'>;

const TABS = [
  {key: 'all', title: 'All'},
  {key: 'post', title: 'Post'},
  {key: 'hashtags', title: '#Hashtags'},
  {key: 'people', title: 'People'},
];

function Popular() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <Post /> // Changed this to single view as per discussed with Steph over call as API is not ready.
    // <TabView
    //   initialLayout={{width: layout.width}}
    //   navigationState={{index, routes: TABS}}
    //   renderScene={SceneMap({all: All, post: Post, hashtags: Hashtags, people: People})}
    //   renderTabBar={props1 => <CustomTopTabBar {...props1} />}
    //   onIndexChange={setIndex}
    // />
  );
}

export default Popular;
