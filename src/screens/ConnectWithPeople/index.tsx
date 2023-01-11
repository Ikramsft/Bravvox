import React from 'react';
import {View} from 'native-base';
import {useWindowDimensions} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {SceneMap, TabView} from 'react-native-tab-view';
import {HomeTabParamList} from '../../navigation/HomeTabs';
import {BravvoxBRedIcon} from '../../assets/svg';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import {RootNavigationType} from '../Home';
import All from './Tabs/all';
import People from './Tabs/people';
import Groups from './Tabs/groups';
import Events from './Tabs/events';

export type ConnectScreenProps = BottomTabScreenProps<HomeTabParamList, 'ConnectWithPeople'>;

const TABS = [
  {key: 'all', title: 'All'},
  {key: 'people', title: 'People'},
  {key: 'groups', title: 'Groups'},
  {key: 'events', title: 'Events'},
];

function ConnectWithPeople() {
  const layout = useWindowDimensions();

  const navigation = useNavigation<RootNavigationType>();
  const [index, setIndex] = React.useState(0);

  React.useLayoutEffect(() => {
    const headerTitle = () => (
      <View ml={-3} width={10}>
        <BravvoxBRedIcon height={40} width={20} />
      </View>
    );
    navigation.setOptions({headerTitle, headerTitleAlign: 'left'});
  }, [navigation]);

  return (
    <TabView
      initialLayout={{width: layout.width}}
      navigationState={{index, routes: TABS}}
      renderScene={SceneMap({all: All, people: People, groups: Groups, events: Events})}
      renderTabBar={props1 => <CustomTopTabBar {...props1} isConnection />}
      onIndexChange={setIndex}
    />
  );
}
export default ConnectWithPeople;
