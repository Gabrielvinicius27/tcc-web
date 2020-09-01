import React from 'react';
import {BrowserMultiFormatReader} from '@zxing/library';
import "./styles.css";

function AppPage(){
    window.addEventListener('load', function(){
        const codeReader = new BrowserMultiFormatReader();
        let selectedDeviceId;
        codeReader.listVideoInputDevices()
        .then(videoInputDevices => {
            videoInputDevices.forEach(device => 
                console.log(`${device.label}, ${device.deviceId}`)
            );
            selectedDeviceId = videoInputDevices[0].deviceId;       
        })
        .catch(err => console.error(err));
        codeReader
            .decodeOnceFromVideoDevice(selectedDeviceId, 'video')
            .then(response => {console.log(response)})
            .catch(err => console.error(err));
    })
    
           
    return(
        <main className="wrapper">
            <video
                id="video"
                width="300"
                height="200"
            ></video>
        </main>
    )
}

export default AppPage;