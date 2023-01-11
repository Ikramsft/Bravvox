/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, Keyboard, TouchableHighlight, Platform} from 'react-native';
import {Actionsheet, useDisclose, Text, View, IconButton} from 'native-base';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AutoTags from '../../../components/AutoTags';
import {theme} from '../../../theme';
import {useInviteMember} from '../Queries/useInviteMember';
import AutocompleteInviteListItem from './autoCompleteListItem';

interface IPickerProps {
  id: string;
  from: string;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const InviteMember = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  const {id, from} = props;
  const [updating, setUpdating] = useState(false);
  const [tagUsers, setTagUsers] = useState<any[]>([]);

  const {searchMembers, inviteMember} = useInviteMember();

  useImperativeHandle(ref, () => ({onPickerSelect: onOpenInviteMember}));

  const {isOpen, onOpen, onClose} = useDisclose();

  const onOpenInviteMember = () => {
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

  const handleInvite = async () => {
    setUpdating(true);
    try {
      const ids: string[] = _.map(tagUsers, i => i.documentID);
      if (ids && ids.length > 0) {
        await inviteMember(id, ids, from);
        setUpdating(false);
        setTagUsers([]);
        onClose();
      }
    } catch (error) {
      setUpdating(false);
    }
  };

  const getSuggestions = async (word: string) => {
    const obj: any = await searchMembers(word);

    return obj;
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
    return <AutocompleteInviteListItem info={item} />;
  };

  const renderAutoComplete = () => {
    return (
      <View>
        <AutoTags
          autoFocus={false}
          containerStyle={styles.autoTagsContainer}
          data={[]}
          filterKey="documentID"
          getSuggestions={getSuggestions}
          handleAddition={handleAddition}
          handleDelete={handleDelete}
          inputContainerStyle={styles.inputContainer}
          placeholder="Add Bravvox users by typing their name or email"
          renderSuggestion={renderSuggestion}
          renderTags={renderTags}
          tagsSelected={tagUsers}
        />
      </View>
    );
  };

  return (
    <View ref={ref}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content p="5">
          <View style={styles.headingView}>
            <View style={styles.headingText}>
              {from === 'group' ? (
                <Text fontSize="md" fontWeight="bold" style={styles.headingText}>
                  Invite People to Groups
                </Text>
              ) : (
                <Text fontSize="md" fontWeight="bold" style={styles.headingText}>
                  Invite People to Events
                </Text>
              )}
            </View>
            <View style={styles.iconView}>
              <IconButton
                _icon={{
                  as: Ionicons,
                  name: 'close-circle',
                }}
                color="green"
                mt="5"
                name="close"
                onPress={onClose}
              />
              <IconButton
                _icon={{
                  as: Ionicons,
                  name: 'checkmark-done-circle',
                  color: theme.colors.primary[500],
                }}
                colorScheme="blue"
                mt="5"
                onPress={handleInvite}
              />
            </View>
          </View>
          <View style={styles.contentView}>
            <View style={styles.inputCont}>
              <View style={styles.inputView}>{renderAutoComplete()}</View>
            </View>
          </View>
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});

const styles = StyleSheet.create({
  headingView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentView: {
    width: '100%',
    paddingVertical: 10,
  },
  inputCont: {
  },
  inputView: {
    height: 200,
  },
  headingText: {alignSelf: 'center', textAlign: 'center'},
  iconView: {flexDirection: 'row', marginBottom: 15},
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
  },
});

export type PickerHandle = React.ElementRef<typeof InviteMember>;
export default InviteMember;
