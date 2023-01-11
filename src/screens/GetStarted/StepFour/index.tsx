import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Spinner, Text, useTheme, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption} from '../../../components/Typography';
import {RootStackParamList} from '../../../navigation';
import {showSnackbar} from '../../../utils/SnackBar';
import AuthHeader from '../../Auth/Components/AuthHeader';
import {ISubCategory, useSubCategories} from '../Queries/useSubCategories';
import {IRequestSubCatPayload, useUpdateInterests} from '../Queries/useUpdateInterests';
import StepHeader from '../StepHeader';
import SubCategory from './SubCategory';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStartedStepFour'>;

function GetStartedStepFour(props: Props) {
  const {navigation, route} = props;

  const {colors} = useTheme();

  const {updateSubInterests} = useUpdateInterests();

  const {data: subCategories, isLoading} = useSubCategories({
    categories: JSON.stringify(route?.params?.selectedCategories) || '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = React.useState<string[]>([]);
  const [dataPayload, setDataPayload] = useState<IRequestSubCatPayload[]>([]);

  useEffect(() => {
    const newPayload: IRequestSubCatPayload[] | undefined = route?.params?.selectedCategories?.map(
      item => ({category: item, subcategories: []}),
    );

    if (newPayload) {
      setDataPayload(newPayload);
    }
  }, [route?.params?.selectedCategories]);

  const onSubmit = () => {
    setLoading(true);
    (async () => {
      const response = await updateSubInterests(dataPayload);
      if (response.status === 200) {
        showSnackbar({message: response?.message});
        navigation.navigate('GetStartedStepFive');
      }
    })();
    setLoading(false);
  };

  const handleSelected = (item: {category: string; subcategory: string}) => {
    const {subcategory, category} = item;
    if (!selectedList.includes(subcategory)) {
      const temp = JSON.parse(JSON.stringify(selectedList));
      const tempPayload = dataPayload.map(x => {
        if (x.category === category) {
          x.subcategories?.push(subcategory);
          return x;
        }
        return x;
      });
      temp.push(subcategory);
      setDataPayload(tempPayload);
      setSelectedList(temp);
    } else {
      let temp = JSON.parse(JSON.stringify(selectedList));
      temp = temp.filter((x: string) => x !== subcategory);
      const tempPayload = dataPayload.map(x => {
        if (x.category === category) {
          if (x.subcategories) {
            x.subcategories = x.subcategories?.filter((y: string | undefined) => y !== subcategory);
          }
          return x;
        }
        return x;
      });
      setDataPayload(tempPayload);
      setSelectedList(temp);
    }
  };

  const handleSkip = () => navigation.navigate('GetStartedStepFive');

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader step="3" totalStep="5" onBack={handleBack} />
        <View mb="6" mt="2">
          <Text fontFamily="heading" fontSize={24} fontWeight="500">
            What are you interested in?
          </Text>
          <Text fontSize={16} mt="2">
            Choose your interests for an experience just for you.
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}>
          {isLoading ? (
            <Spinner mb={20} mt={20} />
          ) : (
            subCategories?.data.map((item: ISubCategory, index: number) => {
              return (
                <View key={index?.toString()}>
                  <Text fontSize={16} fontWeight="500" mb={3} mt={index === 0 ? 0 : 5}>
                    {item.category.title}
                  </Text>
                  <SubCategory
                    handleSelected={handleSelected}
                    item={item}
                    selectedList={selectedList}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
      <View style={styles.actionContainer}>
        <Button
          backgroundColor={colors.black[1000]}
          isLoading={loading}
          style={styles.buttonStyle}
          width="100%"
          onPress={onSubmit}>
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

export default GetStartedStepFour;
