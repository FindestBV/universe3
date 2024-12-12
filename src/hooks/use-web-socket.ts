import { useState, useEffect, useRef, useCallback, SetStateAction } from 'react';

export function useWebSocket(url: unknown, options = {}) {
  const { reconnect = true, reconnectInterval = 5000, onOpen, onMessage, onError, onClose } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const websocketRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    websocketRef.current = new WebSocket(url);

    websocketRef.current.onopen = (event: any) => {
      setIsConnected(true);
      onOpen && onOpen(event);
    };

    websocketRef.current.onmessage = (event: { data: SetStateAction<null>; }) => {
      setLastMessage(event.data);
      onMessage && onMessage(event);
    };

    websocketRef.current.onerror = (event: any) => {
      onError && onError(event);
    };

    websocketRef.current.onclose = (event: any) => {
      setIsConnected(false);
      onClose && onClose(event);
      if (reconnect) {
        reconnectTimeout.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [url, reconnect, reconnectInterval, onOpen, onMessage, onError, onClose]);

  const sendMessage = useCallback((message: any) => {
    if (isConnected && websocketRef.current) {
      websocketRef.current.send(message);
    }
  }, [isConnected]);

  useEffect(() => {
    connect();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  return { isConnected, sendMessage, lastMessage };
}