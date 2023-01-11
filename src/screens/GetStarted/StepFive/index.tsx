/**
 * @format
 */
import React, {useCallback} from 'react';
import {FlatList, ListRenderItem, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, View, HStack, Spinner, useTheme} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQueryClient} from 'react-query';
import {Title, SubTitle, Caption} from '../../../components/Typography';
import {RootStackParamList} from '../../../navigation';
import AuthHeader from '../../Auth/Components/AuthHeader';
import UserAvatar from '../../../components/UserAvatar';
import SafeTouchable from '../../../components/SafeTouchable';
import {useRecommendations, IResponseData} from '../Queries/useRecommendations';
import {useUpdateInterests} from '../Queries/useUpdateInterests';
import {QueryKeys} from '../../../utils/QueryKeys';
import StepHeader from '../StepHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckEmail'>;

export interface IUserList {
  documentId: string;
  name: string;
  username: string;
  profileTagline: string;
  follow: boolean;
  profilePic: string;
}

interface IUserItemProps {
  item: IUserList;
  onPress: (item: IUserList) => void;
}

interface IFollowUnfollowProps {
  selected: boolean;
  onPress: () => void;
}

function FollowUnfollowButton(props: IFollowUnfollowProps) {
  const {onPress, selected} = props;
  const label = selected ? 'Following' : 'Follow';

  const {colors} = useTheme();

  return (
    <SafeTouchable onPress={onPress}>
      <View
        alignItems="center"
        bgColor={selected ? colors.blue[500] : 'transparent'}
        borderColor={colors.blue[500]}
        borderRadius={45}
        borderWidth={1}
        height={35}
        justifyContent="center">
        <Text color={selected ? colors.white : colors.blue[500]}>{label}</Text>
      </View>
    </SafeTouchable>
  );
}

function UserItem(props: IUserItemProps) {
  const {item, onPress} = props;
  const {name, username, profileTagline, profilePic, follow} = item;
  const onButtonPress = () => onPress(item);

  return (
    <HStack alignItems="center" flexDirection="row" justifyContent="space-between" mb={3}>
      <UserAvatar profilePic={profilePic} size={60} />
      <View flex={0.45} flexGrow={1} px={2}>
        <Title>{name}</Title>
        <SubTitle>@{username}</SubTitle>
        {profileTagline !== '' && <SubTitle>{profileTagline}</SubTitle>}
      </View>
      <View justifyContent="flex-end" width="110px">
        <FollowUnfollowButton selected={follow} onPress={onButtonPress} />
      </View>
    </HStack>
  );
}

function GetStartedStepFive(props: Props) {
  const {navigation} = props;

  const {colors} = useTheme();

  const queryClient = useQueryClient();
  const {data: recommendations, isLoading} = useRecommendations();
  const {followRecommendedUser} = useUpdateInterests();

  const [selectedPeople, setSelectedPeople] = React.useState<IUserList[]>([]);

  const handleBack = () => navigation.goBack();

  const handleSkip = () => navigation.navigate('GetStartedStepSix');

  const handleSubmit = () => toggleFollow();

  const toggleFollow = async () => {
    try {
      await Promise.all(
        selectedPeople.map(async (item: IUserList) => {
          const result = await followRecommendedUser({follow: item.documentId});
          return result;
        }),
      );
      navigation.navigate('GetStartedStepSix');
      return true;
    } catch (error: any) {
      navigation.navigate('GetStartedStepSix');
      return Promise.reject(error);
    }
  };

  const handleSelect = async (item: IUserList) => {
    const selected = selectedPeople.includes(item);
    if (!selected) {
      setSelectedPeople([...selectedPeople, item]);
    } else {
      const tempList = selectedPeople.filter(x => x.documentId !== item.documentId);
      setSelectedPeople(tempList);
    }
    const cacheKey = QueryKeys.recommendations;
    const response = await queryClient.getQueryData<IResponseData>(cacheKey);
    if (response) {
      const {data} = response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((elem: any) => {
        if (elem.documentId === item.documentId) {
          elem.follow = !selected;
        }
        return elem;
      });
      const updateData = {...response, data};
      queryClient.setQueryData<IResponseData>(cacheKey, updateData);
    }
  };

  const renderItem: ListRenderItem<IUserList> = ({item}) => (
    <UserItem item={item} onPress={handleSelect} />
  );

  const keyExtractor = useCallback(
    (item: IUserList, index: number) => `key-${index}-${item.documentId}`,
    [],
  );

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader step="4" totalStep="5" onBack={handleBack} />
        <View mb="6">
          <Text fontFamily="heading" fontSize={24} fontWeight="500">
            Recommended for you.
          </Text>
          <Text fontSize={16} mt="2">
            Here are some top people to follow based on your interests.
          </Text>
        </View>
        <FlatList
          contentContainerStyle={styles.scrollView}
          data={recommendations?.data}
          keyExtractor={keyExtractor}
          ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}
        />
      </View>
      <View style={styles.actionContainer}>
        <Button
          backgroundColor={colors.black[1000]}
          style={styles.buttonStyle}
          width="100%"
          onPress={handleSubmit}>
          Next
        </Button>
        <TouchableOpacity onPress={handleSkip}>
          <Caption mt="2">Skip this step</Caption>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  scrollView: {
    flexGrow: 1,
  },
  buttonStyle: {
    height: 45,
  },
  actionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    flex: 1,
  },
});

export default GetStartedStepFive;
