import React from 'react';
import {useWindowDimensions} from 'react-native';
import {View, Text} from 'native-base';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Popular from './Tabs/popular';
import Recent from './Tabs/recent';
import MyEvents from './Tabs/MyEvents';
import {RootNavigationType} from '../Home';
import FloatingButton from '../../components/FloatingButton';
import {RootStackParamList} from '../../navigation';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import {IEventData} from './types/EventInterfaces';
import {BravvoxBRedIcon} from '../../assets/svg';
import {SCREEN_FLOATING_BUTTON} from '../../constants/common';

export type GroupsScreenProps = BottomTabScreenProps<RootStackParamList, 'Events'>;

const TABS = [
  {key: 'popular', title: 'Popular'},
  {key: 'recent', title: 'Recent'},
  {key: 'myEvents', title: 'My Events'},
];

function Events() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const navigation = useNavigation<RootNavigationType>();

  React.useLayoutEffect(() => {
    const headerTitle = () => (
      <View ml={-3} width={10}>
        <BravvoxBRedIcon height={40} width={20} />
      </View>
    );
    navigation.setOptions({headerTitle, headerTitleAlign: 'left'});
  }, [navigation]);

  const onAddPress = () => {
    const data: IEventData = {edit: false, data: null};
    navigation.navigate('AddEvent', {eventData: data as IEventData});
  };

  return (
    <>
      <TabView
        initialLayout={{width: layout.width}}
        navigationState={{index, routes: TABS}}
        renderScene={SceneMap({popular: Popular, recent: Recent, myEvents: MyEvents})}
        renderTabBar={props1 => <CustomTopTabBar {...props1} />}
        onIndexChange={setIndex}
      />
      <FloatingButton bottom={SCREEN_FLOATING_BUTTON} right={4} onPress={onAddPress} />
    </>
  );
}

export default Events;
