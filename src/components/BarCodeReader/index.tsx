import React from 'react'
import {BrowserMultiFormatReader, NotFoundException} from '@zxing/library';
import "./styles.css"

interface props{
    addCode:Function
}

const BarCodeReader: React.FC<props> = ({addCode}) => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId:string;
    
    window.addEventListener('load',function(){
        const errorCallback = () => {return(console.log("NotAllowed"))}
        navigator.mediaDevices.getUserMedia({video:true})
        .then(mediaStream => {
            console.log("Allowed");
            const stream = mediaStream;
            const tracks = stream.getTracks()
            tracks[0].stop();
            codeReader.listVideoInputDevices()
                .then(videoInputDevices => {
                    selectedDeviceId = videoInputDevices[0].deviceId; 
                    this.document.getElementById("barCodeReaderButtonLer")?.addEventListener("click",function(){
                        lerCode()
                    })
                    this.document.getElementById("barCodeReaderButtonCancelar")?.addEventListener("click",function(){
                        cancelaCode()
                    })
                })
                .catch(err => console.error(err));
                    
                }, errorCallback);
        
    })
    

    const lerCode = () =>{
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
            if (result) {
              addCode(result["text"])
              codeReader.reset()
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err)
            }
        })
    }
    const cancelaCode = () =>{
        codeReader.reset()
    }

           
    return(
        <main className="mainBarCodeReader">
            <video
                id="video"
                width="300"
                height="170"
            ></video>
            <div>
                <button id="barCodeReaderButtonLer">Ler</button>
                <button id="barCodeReaderButtonCancelar">Cancelar</button>      
            </div>
        </main>
    )
   
}

export default BarCodeReader;
