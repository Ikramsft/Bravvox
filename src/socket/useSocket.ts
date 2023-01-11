/**
 * @format
 */
import React from 'react';
import {SocketContext} from '.';

const useSocket = () => {
  const {socket} = React.useContext(SocketContext);

  const sendMessage = (channelId: string, text: string) => {
    try {
      const msg = JSON.stringify({
        channel: channelId,
        type: 'content',
        content: text,
      });
      socket?.send(msg);
      return Promise.resolve(true);
    } catch (error) {
      console.log('error sending msg-->', error);
      return Promise.resolve(false);
    }
  };

  return {
    sendMessage,
  };
};

export {useSocket};
