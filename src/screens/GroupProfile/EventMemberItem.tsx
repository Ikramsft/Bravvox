/**
 * @format
 */
import React from 'react';
import {View, HStack} from 'native-base';
import {Image, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {SubTitle, Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import {theme} from '../../theme';

export default function EventMemberListItem() {
  return (
    <HStack
      borderBottomColor={theme.colors.gray[100]}
      borderBottomWidth={0.5}
      flexDirection="row"
      justifyContent="space-between"
      pr={3}
      py="3.5">
      <View ml="3" pl={4} >
        <SafeTouchable>
          <View flexDirection="row">
            <Image
              source={{
                uri: 'https://media.cntraveler.com/photos/60596b398f4452dac88c59f8/16:9/w_3999,h_2249,c_limit/MtFuji-GettyImages-959111140.jpg',
              }}
              style={styles.img}
            />
            <View pl={4}>
              <Title flexShrink={1} fontSize={12} numberOfLines={1} textTransform="capitalize">
                Sunshine State Cup Tournament
              </Title>
              <SubTitle
                color={theme.colors.black[1000]}
                flexShrink={1}
                fontSize={11}
                numberOfLines={1}>
                Advent Health Center Ice
              </SubTitle>
              <SubTitle flexShrink={1} fontSize={11} numberOfLines={1}>
                Friday, August 6th at 7pm EST
              </SubTitle>
              <View alignItems="center" flexDirection="row" mt={2}>
                <Feather color={theme.colors.black[1000]} name="map-pin" />
                <SubTitle
                  color={theme.colors.black[1000]}
                  flexShrink={1}
                  fontSize={11}
                  ml={1}
                  numberOfLines={1}>
                  Tampa, FL
                </SubTitle>
                <View mx={2}>
                  <Entypo color={theme.colors.black[1000]} name="dot-single" />
                </View>
                <Feather color={theme.colors.black[1000]} name="user-check" />
                <SubTitle
                  color={theme.colors.black[1000]}
                  flexShrink={1}
                  fontSize={11}
                  ml={1}
                  numberOfLines={1}>
                  25 Attendees
                </SubTitle>
              </View>
            </View>
          </View>
        </SafeTouchable>
      </View>
      <View justifyContent="center" width="35%" />
    </HStack>
  );
}
const styles = StyleSheet.create({
  img: {
    height: 54,
    width: 54,
    borderRadius: 2,
  },
});
EventMemberListItem.defaultProps = {
  id: '',
};
