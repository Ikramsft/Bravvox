import {PicCroppedDetails} from '../../redux/reducers/user/UserInterface';

export type ICropperParams = {
  image: string;
  initialAspectRatio: number;
  aspectRatio: number;
  autoCropArea: number;
  viewMode: number;
  dragMode: string;
  restore: boolean;
  modal: boolean;
  guides: boolean;
  cropBoxMovable: boolean;
  cropBoxResizable: boolean;
  toggleDragModeOnDblclick: boolean;
  zoomOnTouch: boolean;
  zoomOnWheel: boolean;
  center: boolean;
  background: boolean;
  rounded: boolean;
  cropperAttributes?: PicCroppedDetails;
};

function createHTML(params: ICropperParams) {
  const {
    image,
    autoCropArea,
    viewMode,
    initialAspectRatio,
    aspectRatio,
    dragMode,
    restore,
    modal,
    guides,
    cropBoxMovable,
    cropBoxResizable,
    toggleDragModeOnDblclick,
    zoomOnTouch,
    zoomOnWheel,
    center,
    background,
    cropperAttributes,
    rounded,
  } = params || {};

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Cropper.js</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css">
    <style>
      .rounded-container .cropper-view-box,
      .rounded-container .cropper-face {
        border-radius: 50% !important;
      }

      img {
        width: 100%;
        height 100%:
      }
    </style>
  </head>
  <body>
    <div class="${rounded ? 'rounded-container' : 'container'}">
      <img id="image" src="${image}" alt="Picture">
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
    <script>

    const getRoundedCanvas = (sourceCanvas) => {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      const width = sourceCanvas.width;
      const height = sourceCanvas.height;
    
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
      context.fill();
      return canvas;
    }

    window.processImage=({type})=>{
      const cropper=window.cropper

      let croppedCanvas = cropper.getCroppedCanvas();
      if (${rounded}) {
        croppedCanvas = getRoundedCanvas(croppedCanvas);
      }

      const dataURL = croppedCanvas.toDataURL('image/jpeg');

      const uploadImageData = {
        croppedFile: dataURL,
        data: cropper.getData(false),
        canvasData: cropper.getCanvasData(),
        cropBoxData: cropper.getCropBoxData(),
      }

      console.log("uploadImageData",uploadImageData)

      window.ReactNativeWebView.postMessage(JSON.stringify({type:'apply', payload:uploadImageData}));
    }

    const setCropperData=()=>{
      const cropper=window.cropper

      if(cropper&&${Boolean(cropperAttributes?.canvasData)}){
        cropper.setData(${JSON.stringify(cropperAttributes?.data)});
        cropper.setCropBoxData(${JSON.stringify(cropperAttributes?.cropBoxData)});
        cropper.setCanvasData(${JSON.stringify(cropperAttributes?.canvasData)});
      }
    }

    window.addEventListener('DOMContentLoaded', function () {
      window.ReactNativeWebView.postMessage('DOMContentLoaded')
      var image = document.querySelector('#image');
      window.cropper = new Cropper(image, {
        initialAspectRatio: ${initialAspectRatio},
        aspectRatio: ${aspectRatio},
        autoCropArea: ${autoCropArea},
        viewMode: ${viewMode},
        dragMode: "${dragMode}",
        restore: ${restore},
        modal: ${modal},
        guides: ${guides},
        cropBoxMovable: ${cropBoxMovable},
        cropBoxResizable: ${cropBoxResizable},
        toggleDragModeOnDblclick: ${toggleDragModeOnDblclick},
        zoomOnTouch: ${zoomOnTouch},
        zoomOnWheel: ${zoomOnWheel},
        center: ${center},
        background: ${background},
        ready() {
          setCropperData()
          const imageData = this.cropper.getImageData();
          window.ReactNativeWebView.postMessage(JSON.stringify({type:'ready', payload:imageData}));
        }
      });
    });
    </script>
  </body>
  </html>`;
}

export {createHTML};
