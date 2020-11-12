import React, { useEffect, useState } from 'react'
import {BrowserMultiFormatReader, NotFoundException} from '@zxing/library';
import "./styles.css"

interface props{
    scale?:number,
    addCode:Function
}


const BarCodeReader: React.FC<props> = ({addCode, scale=1}) => {

    const [videoDevices, setVideoDevices] = useState<any>([{}])
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
                    let sample:any = []
                    videoInputDevices.map(device=>sample.push({'deviceId':device.deviceId, 'label':device.label}))
                    console.log(sample)
                    setVideoDevices(sample)
                    
                    this.document.getElementById("selectVideoDevice")?.addEventListener("change",function(){
                        console.log('I Changed')
                        selectedDeviceId = (this as HTMLSelectElement).value
                    })
                    this.document.getElementById("barCodeReaderButtonLer")?.addEventListener("click",function(){    
                        console.log(selectedDeviceId)
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
              console.log(selectedDeviceId)
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
                width={300*scale}
                height={170*scale}
            ></video>
            <label style={{font:'400 1rem Montserrat'}}>Selecione o dispositivo de vídeo:</label>
            {videoDevices.length!==0 &&
                (<select style={{width:300*scale}} id="selectVideoDevice">
                    {videoDevices.map((videoDevice:any)=>{
                        return(<option value={videoDevice.deviceId}>{videoDevice.label}</option>)
                    })}
                </select>)
            }
            <div>
                <button style={{width:160*scale, height:50*scale}}id="barCodeReaderButtonLer">Ler</button>
                <button style={{width:160*scale, height:50*scale}}id="barCodeReaderButtonCancelar">Cancelar</button>      
            </div>
        </main>
    )
   
}

export default BarCodeReader;
