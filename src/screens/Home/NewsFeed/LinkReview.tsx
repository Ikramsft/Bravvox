import {Text, CloseIcon, View, useTheme} from 'native-base';
import React, {useState} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {ILinkPreview, useFetchPreviewLink} from './Queries/useFetchPreviewLink';

interface LinkReviewProps {
  url: string;
  from: string;
  showClose?: boolean;
  darkBorder?: boolean;
}

function LinkReview(props: LinkReviewProps) {
  const {url, from, showClose, darkBorder} = props;
  const {fetchPreviewLinkData} = useFetchPreviewLink();
  const [urlData, setUrlData] = useState<ILinkPreview | null>(null);
  const [show, setShow] = React.useState(true);

  const {colors} = useTheme();


  React.useEffect(() => {
    (async () => {
      const result = await fetchPreviewLinkData(url, from);
      if (!result?.data?.length) return;
      const data: any = result?.data?.[0];
      const previewData: ILinkPreview = {
        title: data?.title,
        description: data?.description,
        image: data?.image[0]?.url || '',
        siteName: data?.site_name,
        hostname: data?.title,
        url: data?.url || url,
        width: data?.image[0]?.width || 0,
        isVideo: data?.video?.length > 0,
        videoURL: data?.video?.[0] || [],
      };
      setUrlData(previewData);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = () => {
    if (urlData) {
      Linking.openURL(urlData?.url?.replace(/"/g, ''));
    }
  };

  return (
    <View mt={1}>
      {show && urlData && (
        <TouchableOpacity activeOpacity={0.9} onPress={handleRedirect}>
          <View
            borderColor={darkBorder ? colors.black[300] : colors.gray[100]}
            borderRadius={8}
            borderWidth={1}
            pb={2}
            pt={5}
            px={5}>
            {showClose && (
              <TouchableOpacity
                style={[styles.buttonStyle, {backgroundColor: colors.black}]}
                onPress={() => setShow(false)}>
                <CloseIcon color={colors.white} size={3} />
              </TouchableOpacity>
            )}
            {urlData ? (
              urlData?.image ? (
                <Image source={{uri: urlData.image}} style={styles.img} />
              ) : null
            ) : null}
            <Text color={colors.gray[900]} fontSize={15} fontWeight="700">
              {urlData?.title}
            </Text>
            <Text color={colors.blue[800]} textDecorationLine="underline">
              {urlData?.title}
            </Text>
            <Text>{urlData?.description}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

LinkReview.defaultProps = {
  showClose: false,
  darkBorder: false,
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 360,
    position: 'absolute',
    right: -5,
    top: -5,
  },
  img: {
    height: 150,
    width: '100%',
    borderRadius: 8,
  },
});

export default React.memo(LinkReview);
