import React from 'react';
import {useWindowDimensions} from 'react-native';
import {View} from 'native-base';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap} from 'react-native-tab-view';

import {HomeTabParamList} from '../../navigation/HomeTabs';
import Popular, {RootNavigationType} from './Tabs/popular';
import Recent from './Tabs/recent';
import MyGroups from './Tabs/myGroups';
import FloatingButton from '../../components/FloatingButton';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import {BravvoxBRedIcon} from '../../assets/svg';
import {SCREEN_FLOATING_BUTTON} from '../../constants/common';

export type GroupsScreenProps = BottomTabScreenProps<HomeTabParamList, 'Groups'>;

const TABS = [
  {key: 'popular', title: 'Popular'},
  {key: 'recent', title: 'Recent'},
  {key: 'myGroups', title: 'My Groups'},
];

function Groups() {
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

  const onAddPress = () => navigation.navigate('AddGroup');

  return (
    <>
      <TabView
        initialLayout={{width: layout.width}}
        navigationState={{index, routes: TABS}}
        renderScene={SceneMap({popular: Popular, recent: Recent, myGroups: MyGroups})}
        renderTabBar={props1 => <CustomTopTabBar {...props1} />}
        onIndexChange={setIndex}
      />
      <FloatingButton bottom={SCREEN_FLOATING_BUTTON} right={4} onPress={onAddPress} />
    </>
  );
}

export default Groups;
