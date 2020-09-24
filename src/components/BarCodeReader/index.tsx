import React, {  useState } from 'react'
import {BrowserMultiFormatReader, NotFoundException} from '@zxing/library';
import "./styles.css"

interface props{
    addCode:Function
}

const BarCodeReader: React.FC<props> = ({addCode}) => {
    const[Ler, setLer]= useState(true);
    const[code, setCode]= useState("000");
    const[deviceId,setDeviceId] = useState("-");
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId:string;
    
    window.addEventListener('load',function(){
        const successCallback = () => {return(console.log("Allowed"))}
        const errorCallback = () => {return(console.log("NotAllowed"))}
        navigator.mediaDevices.getUserMedia({video:true})
        .then(successCallback, errorCallback);
        codeReader.listVideoInputDevices()
        .then(videoInputDevices => {
            selectedDeviceId = videoInputDevices[0].deviceId; 
        
            setDeviceId(selectedDeviceId)
            this.document.getElementById("barCodeReaderButtonLer")?.addEventListener("click",function(){
                lerCode()
            })
            this.document.getElementById("barCodeReaderButtonCancelar")?.addEventListener("click",function(){
                cancelaCode()
            })
        })
        .catch(err => console.error(err));
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
        setLer(true);
    }
    const cancelaCode = () =>{
        codeReader.reset()
        setLer(false);
    }

           
    return(
        <main className="wrapper">
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
