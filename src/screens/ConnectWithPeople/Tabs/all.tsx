/**
 * @format
 */
import React from 'react';
import {ScrollView, Text, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {RefreshControl, StyleSheet} from 'react-native';
import {theme} from '../../../theme';
import {useConnectionAll} from '../Queries/useConnectionAll';
import UserCard from '../Cards/UserCard';

function All() {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const {data, isLoading, refetch} = useConnectionAll();

  const renderAccountContainer = () => {
    return data?.data?.People.map((item: any) => <UserCard from="connectionAll" item={item} />);
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      style={styles.container}>
      {data?.data?.People && (
        <View style={styles.titleView}>
          <Text style={styles.textContent}>People</Text>
          {renderAccountContainer()}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    paddingVertical: 12,
  },
  textContent: {
    fontSize: 14,
    fontFamily: 'DMSANS-Regular',
    paddingHorizontal: 24,
    paddingBottom: 5,
    marginBottom: 5,
    color: theme.colors.gray['600'],
  },
});

export default All;
