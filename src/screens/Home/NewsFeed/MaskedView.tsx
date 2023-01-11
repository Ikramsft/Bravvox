import {useNavigation} from '@react-navigation/native';
import {isNumber} from 'lodash';
import {Button, Text, useTheme, View} from 'native-base';
import React, {ReactElement, useCallback, useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, ViewProps, ViewStyle} from 'react-native';
import {RootNavigationType} from '..';
import {RestrictedContentEyeIcon} from '../../../assets/svg';
import {SubTitle, Title} from '../../../components/Typography';
import useUserInfo from '../../../hooks/useUserInfo';
import {useSettings} from '../../GetStarted/Queries/useSettings';
import {IComments, INewsFeedData} from '../types/NewsFeedInterface';

const RESTRICTED_MEDIA_BACKGROUD_COLOR = 'rgba(39,50,62,.93)';
const RESTRICTED_POST_BACKGROUD_COLOR = 'rgba(248,249,250, 1)';

const styles = StyleSheet.create({
  mediaConatiner: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RESTRICTED_MEDIA_BACKGROUD_COLOR,
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RESTRICTED_MEDIA_BACKGROUD_COLOR,
    padding: 20,
    marginTop: 10,
  },
  maskTitle: {
    fontSize: 20,
  },
  maskSubText: {
    fontSize: 13,
  },
  mediaMaskTitle: {
    fontSize: 10,
    lineHeight: 12,
  },
  mediaMaskSubTitle: {
    fontSize: 8,
    lineHeight: 10,
  },
  maskIconView: {
    paddingVertical: 20,
  },
  textMaskView: {
    backgroundColor: RESTRICTED_POST_BACKGROUD_COLOR,
    padding: 20,
    margin: 10,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  commentMaskView: {
    backgroundColor: RESTRICTED_POST_BACKGROUD_COLOR,
    padding: 10,
    marginVertical: 5,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
});

interface IMaskedViewProps extends ViewProps {
  newsFeed?: INewsFeedData;
  comment?: IComments;
  isMedia?: boolean;
  containerStyle?: ViewStyle;
}

function MaskedView(props: IMaskedViewProps): ReactElement<any, any> {
  const {newsFeed, comment, isMedia, containerStyle, children} = props;
  const {colors} = useTheme();
  const {finalModRating, contentDataType, userId} = newsFeed || comment || {};
  const {data: settings} = useSettings();
  const navigation = useNavigation<RootNavigationType>();
  const {user} = useUserInfo();
  const [masked, setMasked] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isNumber(settings?.data?.cmc) && isNumber(finalModRating)) {
      let defaultMasked = true;
      if (userId === user.documentId) {
        // console.log('my content should not be masked');
        defaultMasked = false;
      } else if (finalModRating <= settings?.data?.cmc) {
        defaultMasked = false;
      }
      setMasked(defaultMasked);
    }
  }, [finalModRating, settings?.data?.cmc, user.documentId, userId]);

  const viewPost = useCallback(() => {
    setMasked(false);
  }, []);

  const openCMC = useCallback(() => navigation.navigate('ControlMyContent'), [navigation]);

  if (masked) {
    if (isMedia) {
      if (showTerms) {
        return (
          <View style={[styles.mediaConatiner, containerStyle]}>
            <Title
              color="white"
              mb={1}
              mt={1}
              style={[styles.mediaMaskTitle, {color: colors.white}]}
              textAlign="center">
              Restricted Content Notice
            </Title>
            <SubTitle color="white" style={styles.mediaMaskSubTitle} textAlign="center">
              This media has been filtered due to your content control settings. if you would like
              to change your settings{' '}
            </SubTitle>
            <Text
              color="white"
              style={styles.mediaMaskSubTitle}
              textDecorationLine="underline"
              onPress={openCMC}>
              click here
            </Text>
            <Button
              _text={{color: 'white', fontWeight: 'bold'}}
              color="white"
              mt={2}
              size="xs"
              variant="ghost"
              onPress={viewPost}>
              View Media
            </Button>
          </View>
        );
      }
      return (
        <View style={[styles.mediaConatiner, containerStyle]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.maskIconView}
            onPress={() => setShowTerms(true)}>
            <RestrictedContentEyeIcon color="white" height={18} width={26} />
          </TouchableOpacity>
        </View>
      );
    }
    if (comment) {
      // console.log(comment)
      return (
        <View style={[styles.commentMaskView, {borderColor: colors.gray[500]}, containerStyle]}>
          <View flex={1}>
            <Title fontSize={10}>Restricted Content Notice</Title>
            <SubTitle fontSize={10}>
              Some comments have been filtered due to your content control settings.
            </SubTitle>
            <SubTitle fontSize={10}>
              If you would like to change your settings{' '}
              <Text textDecorationLine="underline" onPress={openCMC}>
                click here
              </Text>
            </SubTitle>
          </View>
          <View alignItems="center" justifyContent="center">
            <Button size="xs" variant="ghost" onPress={viewPost}>
              View
            </Button>
          </View>
        </View>
      );
    }
    if (contentDataType === 'text') {
      return (
        <View style={[styles.textMaskView, {borderColor: colors.gray[500]}, containerStyle]}>
          <View flex={1}>
            <Title mb={3}>Restricted Content Notice</Title>
            <SubTitle>This Post has been filtered due to your content control settings.</SubTitle>
            <SubTitle>
              If you would like to change your settings{' '}
              <Text textDecorationLine="underline" onPress={openCMC}>
                click here
              </Text>
            </SubTitle>
          </View>
          <View alignItems="center" justifyContent="center">
            <Button variant="ghost" onPress={viewPost}>
              View
            </Button>
          </View>
        </View>
      );
    }
    return (
      <View mt={1} style={[styles.container, containerStyle]}>
        <View style={styles.maskIconView}>
          <RestrictedContentEyeIcon color="white" height={36} width={52} />
        </View>
        <Title mb={4} style={[styles.maskTitle, {color: colors.white}]} textAlign="center">
          Restricted Content Notice
        </Title>
        <SubTitle color="white" style={styles.maskSubText} textAlign="center">
          This media has been filtered due to your content control settings
        </SubTitle>
        <SubTitle color="white" style={styles.maskSubText} textAlign="center">
          if you would like to change your settings{' '}
          <Text textDecorationLine="underline" onPress={openCMC}>
            click here
          </Text>
        </SubTitle>
        <Button _text={{color: 'white'}} color="white" mt={8} variant="outline" onPress={viewPost}>
          View Media
        </Button>
      </View>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

MaskedView.defaultProps = {
  newsFeed: undefined,
  comment: undefined,
  isMedia: false,
  containerStyle: null,
};

export default MaskedView;
