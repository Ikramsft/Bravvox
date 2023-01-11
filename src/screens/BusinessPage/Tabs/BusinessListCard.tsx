import {useNavigation} from '@react-navigation/native';
import {Text, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import SafeTouchable from '../../../components/SafeTouchable';
import {Caption} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '../../Home';
import {IBusinessData} from '../Queries/useBusinessList';

type Props = {
  item: IBusinessData;
};

function BusinessListCard(props: Props) {
  const {colors} = useTheme();
  const {item} = props;

  const navigation = useNavigation<RootNavigationType>();

  const navigateToGroupProfile = async () => {
    navigation.push('BusinessProfile', {businessId: item.id,title:item.name});
  };

  return (
    <TouchableOpacity onPress={navigateToGroupProfile}>
      <View style={[styles.cardContainer, {backgroundColor: colors.white}]}>
        <SafeTouchable onPress={navigateToGroupProfile}>
          <UserAvatar profilePic={item.avatarReadURL} />
        </SafeTouchable>
        <SafeTouchable style={styles.centerContainer} onPress={navigateToGroupProfile}>
          <Text ellipsizeMode="tail" fontWeight="semibold" maxWidth="90%" numberOfLines={1}>
            {item.name}
          </Text>
        </SafeTouchable>
        <View>
          <Caption>{item.totalFollowers} Followers</Caption>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  centerContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default BusinessListCard;
