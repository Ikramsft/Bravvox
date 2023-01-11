/**
 * @format
 */
import {showMessage, MessageOptions} from 'react-native-flash-message';

export function showSnackbar(props: MessageOptions) {
  const {message = 'No message', type = 'success', ...rest} = props;
  showMessage({message, type, ...rest});
}
