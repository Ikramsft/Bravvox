/**
 * @format
 */
import React, {useEffect} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Spinner} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useNotificationsList, notificationViewed} from '../Queries/useNotificationsList';
import {INotificationData} from '../Types/NoticiationInterface';
import NotificationElement from '../NotificationElement';
import Empty from '../../../components/EmptyComponent';
import {withRedirection} from '../HOC/withRedirection';
import {INotificationProps} from './AllNotification';

function Follows(props: INotificationProps) {
  const {data, isLoading, refetch} = useNotificationsList('follows');
  const {openProfile, onPressMsg} = props;

  useEffect(() => {
    notificationViewed();
  }, []);

  const renderItem: ListRenderItem<INotificationData> = ({item}) => {
    return (
      <NotificationElement notification={item} openProfile={openProfile} onPressMsg={onPressMsg} />
    );
  };

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={item => item.notificationId.toString()}
      ListEmptyComponent={
        !isLoading && data?.length===0 ? (
          <Empty containerStyle={styles.emptyContainer} title="Records not found" />
        ) : null
      }
      ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
      refreshing={isLoading}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      onRefresh={refetch}
    />
  );
}

export default withRedirection(Follows);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  content: {
    minHeight: 1,
  },
  emptyContainer: {
    marginTop: 70,
  },
});
