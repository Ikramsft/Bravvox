/**
 * @format
 */
import React from 'react';
import Config from 'react-native-config';

import {store} from '../redux/store';
import {useHandleMessage} from './useHandleMessage';

const initialState: {socket: WebSocket | null} = {socket: null};

const SocketContext = React.createContext(initialState);

interface ISocketProps {
  children?: React.ReactNode;
}

let socketInterval: ReturnType<typeof setTimeout>;

const MAX_ATTEMPTS = 3;
let attemptNo = 0;

function SocketProvider(props: ISocketProps) {
  const {token: uToken, isLoggedIn: loggedIn} = store.getState().user;

  const {onMessage} = useHandleMessage();

  const {children} = props;

  const onMessageEvent = (event: any) => {
    if (event?.type === 'error') {
      initialState?.socket?.close();
      return;
    }
    onMessage(event.data);
  };

  const destroySocket = async () => {
    if (initialState.socket) {
      console.log('socket destroyed');
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      initialState.socket.onopen = () => {};
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      initialState.socket.onclose = () => {};
      initialState.socket.removeEventListener('message', onMessageEvent);
      initialState.socket.close();
      initialState.socket = null;

      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 1000);
      });
    }
  };

  const checkIfCanCreateSocket = async () => {
    if (!loggedIn || !uToken) {
      destroySocket();
      return false;
    }

    if (initialState.socket && initialState.socket.readyState === WebSocket.OPEN) {
      return false;
    }

    return true;
  };

  const heartbeat = () => {
    if (initialState.socket && initialState.socket.readyState === WebSocket.OPEN) {
      console.log('ping sent-->');
      initialState.socket.send('');
      socketInterval = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        heartbeat();
      }, 15000);
    }
  };

  async function connect(token: string) {
    const createSocket = await checkIfCanCreateSocket();
    if (createSocket) {
      const url = `${Config.SOCKET_API_URL}realtime/chat?token=${token}`;
      initialState.socket = new WebSocket(url);

      initialState.socket.onopen = () => {
        attemptNo = 0;
        heartbeat();
      };

      initialState.socket.onclose = e => {
        if (attemptNo < MAX_ATTEMPTS) {
          attemptNo += 1;
          const {token: reconnectToken} = store.getState().user;
          const tm = setTimeout(() => {
            connect(reconnectToken);
            clearTimeout(tm);
          }, 1000);
        } else {
          console.warn('maximum attempt done to reconnect->', attemptNo);
        }
      };
      initialState.socket.addEventListener('message', onMessageEvent);
    }
  }

  React.useEffect(() => {
    if (loggedIn) {
      connect(uToken);
    } else {
      destroySocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, uToken]);

  return <SocketContext.Provider value={initialState}>{children}</SocketContext.Provider>;
}

SocketProvider.defaultProps = {
  children: undefined,
};

export {SocketContext, SocketProvider};
