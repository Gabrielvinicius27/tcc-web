import React, { useState } from 'react';
import {QRCode} from 'react-qrcode-logo'
import { DataMatrixGeneratorComponent } from '@syncfusion/ej2-react-barcode-generator';
import "./styles.css";
import logoImage from '../../../../assets/images/icons/logobg.jpg';

function GerarQrCodePage(){
    const [valueQRCode, setValueQRCode] = useState('');
    const [selectQR, setSelectQR] = useState(true)

    return(
        <div className='mainDivPages'>
            <div className="divHeader">
                <h1>Gerar QR Code</h1>
                <h2>Mostar QR Code ou data Matrix</h2>
            </div>
                <div>
                    <form>
                        <label>Conteúdo do QR Code</label>
                        <div className="input_n_select">
                            <input
                                onChange={(e)=>setValueQRCode(e.target.value)}>    
                            </input>
                            <select
                                onChange={(e)=>{setSelectQR(!selectQR)}}>
                                <option value="QRCode">QRcode</option>
                                <option value="DataMatrix">DataMatrix</option>
                            </select> 
                        </div>
                        <div id="datamatrixDiv">
                            {selectQR && <QRCode 
                                value={valueQRCode}
                                logoImage={logoImage}
                                size={90}
                                ecLevel='M'>
                            </QRCode>}
                            {!selectQR && <DataMatrixGeneratorComponent 
                                id="datamatrix"
                                width={"80px"} 
                                height={"80px"} 
                                foreColor={"blue"}
                                backgroundColor="#eeee"
                                encoding='Base256'
                                value={valueQRCode}
                                margin={{bottom:0,top:10,left:0,right:0}}
                                displayText= {{visibility:false}}>
                            </DataMatrixGeneratorComponent>}
                            <div id="textDiv">
                                {valueQRCode}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    )
}

export default GerarQrCodePage;