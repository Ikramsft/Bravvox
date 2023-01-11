import {View} from 'native-base';
import React, {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {CropperAttributes} from '../../redux/reducers/user/UserInterface';
import {createHTML, ICropperParams} from './cropper';

export type ICropperImageData = {
  aspectRatio: number;
  height: number;
  left: number;
  naturalHeight: number;
  naturalWidth: number;
  top: number;
  width: number;
};

export interface SavePayload extends CropperAttributes {
  croppedFile: string;
}

interface IProps extends ICropperParams {
  image: string;
  zoom: number;
  rounded: boolean;
  onReady: (imageData: ICropperImageData) => void;
  onSave: (payload: SavePayload) => void;
}

export type ICropperHandler = {
  applyImage: () => void;
};

function IsJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const CropperContainer = React.forwardRef<ICropperHandler, IProps>((props: IProps, ref) => {
  const {onReady, onSave, zoom, ...rest} = props;
  const webviewRef = useRef() as MutableRefObject<WebView>;

  const [html, setHtml] = useState<string>('');

  useImperativeHandle(ref, () => ({
    applyImage,
  }));

  useLayoutEffect(() => {
    return setHtml(createHTML(rest));
  }, [rest]);

  useEffect(() => {
    zoomImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const zoomImage = () => {
    const script = `
    if(window.cropper){
      window.cropper.zoomTo(${zoom});
    }
    true;
  `;

    webviewRef?.current?.injectJavaScript(script);
  };

  const applyImage = () => {
    const script = `
        if(window.cropper){
          window.processImage({type:"profile"});
        }
        true;
      `;

    webviewRef?.current?.injectJavaScript(script);
  };

  const handleMessage = async (e: WebViewMessageEvent) => {
    const {data} = e.nativeEvent;
    if (IsJsonString(data)) {
      const {type, payload} = JSON.parse(data);

      switch (type) {
        case 'ready': {
          zoomImage();
          return onReady(payload);
        }
        case 'apply': {
          return onSave(payload);
        }

        default:
          console.log('----->default ', payload);
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <WebView
        javaScriptEnabled
        ref={webviewRef}
        scrollEnabled={false}
        source={{html}}
        style={styles.container}
        onMessage={handleMessage}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: 15,
    padding: 10,
  },
});

export default CropperContainer;
