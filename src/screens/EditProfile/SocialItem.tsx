/**
 * @format
 */
import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../theme';

interface ISocialItemProps {
  ICON: JSX.Element;
  title: string;
  url: string;
  onLink: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SocialItem(props: ISocialItemProps) {
  const {ICON, title, url, onLink, onEdit, onDelete} = props;
  return (
    <View>
      <View mt={2} style={styles.socialLinkView}>
        <View style={styles.iconCircleView}>{ICON}</View>
        <View style={styles.userNameView}>
          <Text numberOfLines={1}>{title}</Text>
          <TouchableOpacity onPress={onLink}>
            <Text color={theme.colors.blue[600]} numberOfLines={1}>
              {url}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{backgroundColor: theme.colors.blue[500], ...styles.editIcon}}
          onPress={onEdit}>
          <MaterialIcons color={theme.colors.gray[500]} name="edit" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{backgroundColor: theme.colors.red[500], ...styles.editIcon}}
          onPress={onDelete}>
          <Entypo color={theme.colors.gray[500]} name="cross" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  socialLinkView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    height: 24,
    width: 24,
    margin: 2,
  },
  userNameView: {flex: 1, marginStart: 8},
  iconCircleView: {
    backgroundColor: theme.colors.gray[100],
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
