import React, {useCallback} from 'react';
import {Divider, FlatList, Icon, Modal, useTheme, View} from 'native-base';
import {ListRenderItem, StyleProp, StyleSheet, ViewStyle} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IArrayData, INavItem} from '../../../components/NavigationList';
import SafeTouchable from '../../../components/SafeTouchable';
import FilterOptionListItem from '../../Profile/FilterOptionListItem';
import FilterOptionTitle from '../../Profile/FilterOptionTitle';
import {SubTitle, Title} from '../../../components/Typography';

interface IDropDownProps {
  data: IArrayData[];
  onPress: (item: IArrayData, index: number) => void;
  currentIndex: number;
  selectedId: string;
  onSelect: (item: INavItem) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

function ProfileDropDown(props: IDropDownProps) {
  const {data, selectedId, onSelect, onPress, contentContainerStyle, currentIndex} = props;

  const [modalVisible, setModalVisible] = React.useState(false);
  const {colors} = useTheme();
  const selectOption = (selectedOption: INavItem) => {
    onSelect(selectedOption);
    setModalVisible(false);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const keyExtractor = useCallback(
    (item: INavItem, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const renderItem: ListRenderItem<INavItem> = ({item}) => (
    <FilterOptionListItem item={item} selectedId={selectedId} selectOption={selectOption} />
  );

  return (
    <View style={[styles.container, contentContainerStyle]}>
      <View>
        <SafeTouchable
          style={styles.button}
          onPress={() => {
            setModalVisible(true);
          }}>
          <View>
            <Title alignSelf="flex-end" fontSize={12}>
              {selectedId && data[currentIndex]?.title}
            </Title>
            <SubTitle alignSelf="flex-end" fontSize={10}>
              {selectedId &&
                data[currentIndex]?.data?.find((i: {id: string}) => i.id === selectedId)?.title}
            </SubTitle>
          </View>
          <Icon
            as={<MaterialCommunityIcons name="chevron-down" />}
            color={colors.gray[400]}
            size="6"
          />
        </SafeTouchable>

        <Modal
          avoidKeyboard
          isOpen={modalVisible}
          justifyContent="flex-end"
          size="full"
          onClose={() => setModalVisible(false)}>
          <Modal.Content>
            <Modal.CloseButton size={30} />
            <Modal.Body>
              <SafeAreaView edges={['bottom']}>
                <Divider
                  alignSelf="center"
                  background={colors.gray[200]}
                  borderColor={colors.gray[200]}
                  borderRadius={10}
                  borderWidth={1}
                  height={1}
                  marginY={4}
                  width={20}
                />

                {data.map((item, index) => (
                  <View key={index?.toString()} mb={5}>
                    <FilterOptionTitle
                      optionVisible={item.isActive}
                      title={item.title}
                      onPress={() => onPress(item, index)}
                    />
                    {item.isActive && (
                      <FlatList
                        horizontal
                        data={item.data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                      />
                    )}
                  </View>
                ))}
              </SafeAreaView>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </View>
    </View>
  );
}
ProfileDropDown.defaultProps = {
  contentContainerStyle: null,
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    height: 30,
    padding: 3,
    minWidth: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileDropDown;
