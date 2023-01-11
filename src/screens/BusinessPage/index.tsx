import React from 'react';
import {useWindowDimensions} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {HomeTabParamList} from '../../navigation/HomeTabs';
import Popular from './Tabs/popular';
import Recent from './Tabs/recent';
import MyBusiness from './Tabs/MyBusiness';
import {RootNavigationType} from '../Home';
import FloatingButton from '../../components/FloatingButton';
import {IBusinessData} from '../BusinessProfile/types/BusinessInterfaces';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import HeaderTitle from '../../components/HeaderTitle';
import HeaderLeft from '../../components/HeaderLeft';

export type GroupsScreenProps = BottomTabScreenProps<HomeTabParamList, 'BusinessPages'>;

const TABS = [
  {key: 'popular', title: 'Popular'},
  {key: 'recent', title: 'Recent'},
  {key: 'myBusinessPages', title: 'My Pages'},
];

function BusinessPages() {
  const layout = useWindowDimensions();

  const navigation = useNavigation<RootNavigationType>();

  const [index, setIndex] = React.useState(0);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Business" />;
    navigation.setOptions({
      headerLeft,
      headerTitle,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerShown: true,
    });
  }, [navigation]);

  const onAddPress = () => {
    const data: IBusinessData = {edit: false, data: null};
    navigation.navigate('BusinessCreate', {businessData: data as IBusinessData});
  };

  return (
    <>
      <TabView
        initialLayout={{width: layout.width}}
        navigationState={{index, routes: TABS}}
        renderScene={SceneMap({popular: Popular, recent: Recent, myBusinessPages: MyBusiness})}
        renderTabBar={props1 => <CustomTopTabBar {...props1} />}
        onIndexChange={setIndex}
      />
      <FloatingButton bottom={4} right={4} onPress={onAddPress} />
    </>
  );
}

export default BusinessPages;
