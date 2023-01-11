import React from 'react';
import {View, Divider} from 'native-base';
import {FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationType} from '../Home';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import ActivityCard from './ActivityCard';
import {theme} from '../../theme';
import {Title} from '../../components/Typography';

function RecentActivity() {
  const navigation = useNavigation<RootNavigationType>();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Recent Activity" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerTitle,
      headerRight: () => null,
    });
  }, [navigation]);

  const renderItem = () => <ActivityCard />;

  const renderSeparator = () => <Divider my="0.2" />;

  return (
    <View style={styles.container}>
      <Title ml={4} mt={4} pb={2}>
        Recent Activity
      </Title>
      <Divider my="0.2" />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainerStyle: {
    paddingBottom: 50,
  },
});

export default RecentActivity;
