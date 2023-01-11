import {Text, useColorModeValue, useTheme, View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import React from 'react';
import {ICategory} from '.';
import {ISubCategory} from '../Queries/useSubCategories';

interface IChip {
  item: ICategory;
  subCategory?: ISubCategory;
  selectedList: string[];
  onSelectCategory?: (selected: ICategory) => void;
  onSelectSubCategory?: (selected: {category: string; subcategory: string}) => void;
}

function CategoryChip(props: IChip) {
  const {item, selectedList, subCategory, onSelectCategory, onSelectSubCategory} = props;

  const {colors} = useTheme();
  const inactiveTextColor = useColorModeValue(colors.black[40], colors.appWhite[400]);

  const onSelected = () => {
    if (subCategory) {
      const data = {category: subCategory.category.documentId, subcategory: item.documentId};
      onSelectSubCategory?.(data);
      return true;
    }
    onSelectCategory?.(item);
    return true;
  };

  const isSelected = selectedList?.includes(item.documentId);

  return (
    <TouchableOpacity onPress={onSelected}>
      <View
        bgColor={isSelected ? colors.blue[500] : 'transparent'}
        borderColor={isSelected ? colors.blue[500] : inactiveTextColor}
        borderRadius={45}
        borderWidth={1}
        height={35}
        justifyContent="center"
        mb={2}
        mr={2}
        paddingLeft={5}
        paddingRight={5}>
        <Text color={isSelected ? colors.white : inactiveTextColor} fontSize={14} fontWeight="400">
          {item?.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
CategoryChip.defaultProps = {
  onSelectCategory: null,
  subCategory: null,
  onSelectSubCategory: null,
};

export default CategoryChip;
