import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'native-base';
import {ISubCategory} from '../Queries/useSubCategories';
import {ICategory} from '../StepThree';
import CategoryChip from '../StepThree/CategoryChip';
import {theme} from '../../../theme';
import {isAndroid} from '../../../constants/common';

interface ISubCategoryComponent {
  item: ISubCategory;
  selectedList: string[];
  handleSelected: (item: {category: string; subcategory: string}) => void;
}
const SIZE = 8;
function SubCategory(props: ISubCategoryComponent) {
  const {item, handleSelected, selectedList} = props;
  const [showLink, setShowLink] = React.useState(item.subcategories.length > 8);
  const [listItems, setListItem] = React.useState(item.subcategories.slice(0, SIZE));

  const handleShowMore = () => {
    setListItem(item.subcategories);
    setShowLink(false);
  };

  return (
    <>
      <View style={styles.chipContainer}>
        {listItems.map((sub: ICategory, indx: number) => {
          return (
            <CategoryChip
              item={sub}
              key={indx?.toString()}
              selectedList={selectedList}
              subCategory={item}
              onSelectSubCategory={handleSelected}
            />
          );
        })}
      </View>
      {showLink && (
        <Text
          borderBottomColor={theme.colors.primary[500]}
          borderBottomWidth={isAndroid ? 0 : 1}
          color={theme.colors.primary[500]}
          fontWeight={400}
          textDecorationLine="underline"
          onPress={handleShowMore}>
          Load More
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default SubCategory;
