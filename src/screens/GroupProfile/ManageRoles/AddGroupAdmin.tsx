/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, Keyboard, TouchableHighlight, Platform} from 'react-native';
import {Actionsheet, Button, useDisclose, Text, View} from 'native-base';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AutoTags from '../../../components/AutoTags';
import {theme} from '../../../theme';
import AutocompleteListItem from './AutocompleteListItem';
import {useManageRoles} from '../Queries/useManageRoles';
import {ACTIONFROM} from '../Queries/useGroupMember';

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingView: {
    width: '100%',
    padding: 10,
  },
  contentView: {
    width: '100%',
    paddingVertical: 10,
  },
  inputCont: {
    // paddingBottom: 100,
  },
  inputView: {
    height: 150,
  },
  headingText: {},
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    flexWrap: 'wrap',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagsPadding: {
    padding: 8,
  },
  tag: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.blue[500],
  },
  tagText: {
    color: theme.colors.white,
    fontSize: 14,
  },
  tagIcon: {
    marginLeft: 5,
  },
  tagDeleteIcon: {
    color: theme.colors.white,
    fontSize: 20,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {},
  autoTagsContainer: {
    // paddingHorizontal: 10,
  },
});

interface IPickerProps {
  id: string;
  from: ACTIONFROM;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const AddGroupAdmin = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  const {id, from} = props;
  const [updating, setUpdating] = useState(false);
  const [tagUsers, setTagUsers] = useState<any[]>([]);

  const {searchMembers, handleUpdateAdmin} = useManageRoles();

  useImperativeHandle(ref, () => ({onPickerSelect: onOpenAddGroupAdmin}));

  const {isOpen, onOpen, onClose} = useDisclose();

  const onOpenAddGroupAdmin = () => {
    Keyboard.dismiss();
    onOpen();
  };

  const handleDelete = (index: number) => {
    const tagsSelected = [...tagUsers];
    tagsSelected.splice(index, 1);
    setTagUsers(tagsSelected);
  };

  const handleAddition = (suggestion: any) => {
    const newTags = tagUsers.concat([suggestion]);
    setTagUsers(newTags);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const ids: string[] = _.map(tagUsers, i => i.id);
      await handleUpdateAdmin(id, ids, from);
      setUpdating(false);
      setTagUsers([]);
      onClose();
    } catch (error) {
      setUpdating(false);
    }
  };

  const getSuggestions = async (word: string) => {
    const obj: any = await searchMembers(id, word, from);
    let data = [];
    switch (from) {
      case 'group':
        data = obj;
        break;
      case 'business':
        data = obj.followers;
        break;
      case 'event':
        data = obj.attendees;
        break;
      default:
        break;
    }
    return data;
  };

  const renderTags = (tagsSelected: any[]) => {
    return (
      <View style={[styles.tags, tagsSelected?.length ? styles.tagsPadding : null]}>
        {tagsSelected.map((t, i) => {
          return (
            <View key={`touchable_highlight_tag_${t.id}_${t.name}`} style={styles.tag}>
              <View style={styles.tagRow}>
                <Text style={styles.tagText}>{t.name}</Text>
                <TouchableHighlight
                  style={styles.tagIcon}
                  underlayColor="#0000"
                  onPress={() => handleDelete(i)}>
                  <Ionicons name="ios-close-circle" style={styles.tagDeleteIcon} />
                </TouchableHighlight>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSuggestion = (item: any) => {
    return <AutocompleteListItem info={item} />;
  };

  const renderAutoComplete = () => {
    return (
      <View>
        <View style={styles.autocompleteContainer}>
          <AutoTags
            autoFocus={false}
            containerStyle={styles.autoTagsContainer}
            data={[]}
            getSuggestions={getSuggestions}
            handleAddition={handleAddition}
            handleDelete={handleDelete}
            inputContainerStyle={styles.inputContainer}
            placeholder="Add Bravvox users by typing their name"
            renderSuggestion={renderSuggestion}
            renderTags={renderTags}
            tagsSelected={tagUsers}
          />
        </View>
      </View>
    );
  };

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content p="5">
          <View style={styles.headingView}>
            <Text fontSize="md" fontWeight="bold" pb="2" pt="2" style={styles.headingText}>
              {from === 'group'
                ? 'Add Group Admins'
                : from === 'event'
                ? 'Add Event Admins'
                : 'Add Business Page Admins'}
            </Text>
          </View>
          <View style={styles.contentView}>
            <View style={styles.inputCont}>
              <View style={styles.inputView}>{renderAutoComplete()}</View>
            </View>
            <View style={styles.bottomRow}>
              <Button colorScheme="trueGray" mt="5" onPress={onClose}>
                Cancel
              </Button>
              <Button
                _disabled={{
                  backgroundColor: theme.colors.primary[500],
                  opacity: 0.5,
                }}
                _loading={{
                  backgroundColor: theme.colors.primary[500],
                  opacity: 0.5,
                }}
                _spinner={{color: theme.colors.white}}
                _text={{
                  color: theme.colors.white,
                }}
                isDisabled={updating || !tagUsers || !tagUsers.length}
                isLoading={updating}
                isLoadingText="Updating"
                mt="5"
                onPress={handleUpdate}>
                Update
              </Button>
            </View>
          </View>
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});

export type PickerHandle = React.ElementRef<typeof AddGroupAdmin>;
export default AddGroupAdmin;
