import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import { RootNavigationType } from '..';
import NewsFeedLayout from '../../Home/NewsFeed/NewsFeedLayout';

const styles = StyleSheet.create({
  container: {
  },
});

function PostCard(props: any) {
  const {item} = props;
  const navigation = useNavigation<RootNavigationType>();
  return (
    <View style={styles.container}>
      <NewsFeedLayout
        isMember
        from="home"
        key={item.documentId}
        navigation={navigation}
        newsFeed={item}
        showComments={false}
      />
    </View>
  );
}

export default PostCard;
