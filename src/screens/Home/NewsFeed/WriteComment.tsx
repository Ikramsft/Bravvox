import React, {useRef, useState} from 'react';
import {TextInput as TextField, StyleSheet, ActivityIndicator, TextInput} from 'react-native';
import {CloseIcon, View, useTheme, useColorModeValue} from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import emojis from 'emojis-list';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import {emojisData} from '../../../utils';
import {ICommentCreateRequestData, IComments} from '../types/NewsFeedInterface';
import {useComment} from '../useComment';
import {FromType} from './Interactions';
import UserAvatar from '../../../components/UserAvatar';
import useUserInfo from '../../../hooks/useUserInfo';
import SafeTouchable from '../../../components/SafeTouchable';
import {isAndroid} from '../../../constants/common';

export interface MyFormValues {
  comment: string;
}

interface IWriteComment {
  documentId: string;
  from: FromType;
  id: string; // this can be postId, businessId or eventId
  value?: string | undefined;
  setSelectedComment?: (comment?: IComments) => void;
  selectedComment?: IComments;
  focus: boolean | undefined;
  onScrollToTop?: () => void;
}

interface IEmojisData {
  title: string;
  code: number;
}

export function WriteComment(props: IWriteComment) {
  const {documentId, from, id, selectedComment, value, focus, setSelectedComment, onScrollToTop} =
    props;
  const inputAccessoryViewID = `write-comment-input-view-id-${documentId}`;

  const {createComment, updateComment} = useComment();

  const {colors} = useTheme();

  const {user} = useUserInfo();
  const {influencerStatus} = user;

  const inputRef = useRef<TextField>(null);

  const [spinnerLoader, setSpinnerLoader] = React.useState<boolean>(false);
  const [comment, setComment] = useState(value);

  React.useEffect(() => {
    setComment(value);
  }, [value]);

  React.useEffect(() => {
    if (focus || selectedComment) {
      const tm = setTimeout(() => {
        inputRef?.current?.focus();
        clearTimeout(tm);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    setSpinnerLoader(true);
    try {
      const data: ICommentCreateRequestData = {
        contentId: documentId || '',
        comment: comment || '',
        commentId: selectedComment?.documentId || '',
      };
      if (selectedComment) {
        await updateComment(data, from, id);
      } else {
        await createComment(data, from, id);
      }
      handleClose();
      setComment('');
      setSpinnerLoader(false);
      if (!selectedComment && onScrollToTop) {
        onScrollToTop();
      }
    } catch (error) {
      setComment('');
      setSpinnerLoader(false);
    }
  };

  const emojisList = (selectEmojis: string) => {
    let newValue = selectEmojis;
    emojisData.map((item: IEmojisData) => {
      const isAvailable: string[] = item.title.split(',');
      const temp: {length: number; idx: number}[] = [];
      isAvailable.filter((i: string) => {
        const index = selectEmojis.indexOf(i);
        if (index !== -1) temp.push({length: i.length, idx: index});
        return false;
      });
      if (temp && temp.length > 0) {
        temp.map((i: {length: number; idx: number}) => {
          const findEmojis = emojis.find((_: string, index: number) => index === item.code);
          newValue = newValue.slice(0, i.idx) + findEmojis + newValue.slice(i.idx + i.length);
          return i;
        });
      }
      return item;
    });
    return newValue;
  };

  const handleClose = () => {
    setSelectedComment?.();
    inputRef?.current?.blur();
  };

  const onChangeText = (text: string) => {
    const result: string = emojisList(text);
    setComment(result);
  };

  const containerBackground = useColorModeValue(colors.appWhite['700'], colors.black['40']);

  return (
    <KeyboardAccessoryView
      alwaysVisible
      androidAdjustResize
      avoidKeyboard
      style={{backgroundColor: containerBackground}}>
      <View style={[styles.root, {backgroundColor: containerBackground}]}>
        <TextInput
          multiline
          inputAccessoryViewID={inputAccessoryViewID}
          maxLength={1000}
          placeholder="Write a comment..."
          placeholderTextColor="#A4A4A4"
          ref={inputRef}
          style={[styles.inputMainStyle, {color: colors.black[850]}]}
          value={comment}
          onChangeText={onChangeText}
        />
        <View style={styles.contentContainer}>
          <UserAvatar
            influencerStatus={influencerStatus}
            profilePic={user.profileCroppedPic}
            size={32}
          />
          <View
            alignContent="flex-end"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-around">
            <View height={25} width={25}>
              <SafeTouchable style={styles.cameraButton} onPress={handleClose}>
                <Icon color="#A9A9A9" name="camera" size={22} />
              </SafeTouchable>
            </View>
            <View height={25} pl={1} width={25}>
              <SafeTouchable
                disabled={spinnerLoader || comment?.trim().length === 0}
                style={styles.sendButton}
                onPress={onSubmit}>
                {spinnerLoader ? (
                  <ActivityIndicator color="#959699" size={15} />
                ) : (
                  <Ionicons
                    color={comment?.trim().length === 0 ? colors.black[400] : colors.blue[400]}
                    name="send"
                    size={15}
                  />
                )}
              </SafeTouchable>
            </View>
            {selectedComment && (
              <View height={25} width={25}>
                <SafeTouchable style={styles.closeButton} onPress={handleClose}>
                  <CloseIcon color="#959699" size={11} />
                </SafeTouchable>
              </View>
            )}
          </View>
        </View>
      </View>
    </KeyboardAccessoryView>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    position: 'relative',
    width: '100%',
    zIndex: 10,
  },
  inputMainStyle: {
    maxHeight: 200,
    flexGrow: 1,
    minHeight: 40,
    fontSize: 13,
    textAlignVertical: 'top',
    fontFamily: 'DMSANS-Regular',
  },
  cameraButton: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

WriteComment.defaultProps = {
  value: '',
  selectedComment: null,
  setSelectedComment: () => null,
  onScrollToTop: undefined,
};

export default WriteComment;
