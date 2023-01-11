import {useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import SafeTouchable from '../../components/SafeTouchable';
import {SubTitle, Title} from '../../components/Typography';
import UserAvatar from '../../components/UserAvatar';

function GroupListCard() {
  const {colors} = useTheme();

  return (
    <SafeTouchable activeOpacity={0.5}>
      <View style={[styles.cardContainer, {backgroundColor: colors.white}]}>
        <UserAvatar profilePic="" />

        <View style={styles.centerContainer}>
          <View flexDirection="row">
            <Title> Scott Abraham </Title>
            <SubTitle>likes your comment</SubTitle>
          </View>
          <SubTitle>"Having a great day with..."</SubTitle>
          <SubTitle>1 hr ago</SubTitle>
        </View>
      </View>
    </SafeTouchable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  centerContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default GroupListCard;
