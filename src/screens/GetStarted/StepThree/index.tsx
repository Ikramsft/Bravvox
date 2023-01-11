import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Spinner, Text, useTheme, View} from 'native-base';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption} from '../../../components/Typography';
import {RootStackParamList} from '../../../navigation';
import {theme} from '../../../theme';
import {showSnackbar} from '../../../utils/SnackBar';
import AuthHeader from '../../Auth/Components/AuthHeader';
import {useCategories} from '../Queries/useCategories';
import {useUpdateInterests} from '../Queries/useUpdateInterests';
import StepHeader from '../StepHeader';
import CategoryChip from './CategoryChip';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckEmail'>;

export interface ICategory {
  documentId: string;
  title: string;
}

function GetStartedStepThree(props: Props) {
  const {navigation} = props;

  const {colors} = useTheme();
  const {updateInterests} = useUpdateInterests();
  const {data: Categories, isLoading} = useCategories();
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = React.useState<string[]>([]);

  const onSubmit = () => {
    if (selectedList) {
      setLoading(true);
      updateSelected();
      setLoading(false);
    } else {
      navigation.navigate('GetStartedStepFive');
    }
  };

  const updateSelected = async () => {
    const data = selectedList.map(item => ({category: item}));
    const response = await updateInterests({data});
    if (response.status === 200) {
      showSnackbar({message: response?.message});
      navigation.navigate('GetStartedStepFour', {selectedCategories: selectedList});
    }
  };

  const handleSelected = (item: ICategory) => {
    if (!selectedList.includes(item.documentId)) {
      const temp = JSON.parse(JSON.stringify(selectedList));
      temp.push(item.documentId);
      setSelectedList(temp);
    } else {
      let temp = JSON.parse(JSON.stringify(selectedList));
      temp = temp.filter((x: string) => x !== item.documentId);
      setSelectedList(temp);
    }
  };
  const handleBack = () => navigation.goBack();

  const handleSkip = () => navigation.navigate('GetStartedStepFive');

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader step="2" totalStep="5" onBack={handleBack} />
        <View mb="6" mt="2">
          <Text fontFamily="heading" fontSize={24} fontWeight="500">
            What categories are you interested in?
          </Text>
          <Text fontSize={16} mt="2">
            Choose three or more categories.
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}>
          {isLoading ? (
            <Spinner mb={20} mt={20} />
          ) : (
            <View style={styles.chipContainer}>
              {Categories?.data?.map((item: ICategory, index: number) => {
                return (
                  <CategoryChip
                    item={item}
                    key={index?.toString()}
                    selectedList={selectedList}
                    onSelectCategory={handleSelected}
                  />
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.actionContainer}>
        <Button
          backgroundColor={theme.colors.black[1000]}
          isDisabled={!selectedList.length}
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    flex: 1,
  },
});

export default GetStartedStepThree;
