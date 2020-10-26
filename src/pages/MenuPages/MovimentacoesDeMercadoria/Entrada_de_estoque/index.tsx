import React, { useState } from 'react'
import './styles.css'
import '../../global.css'
import BarCodeReader from '../../../../components/BarCodeReader'
import { useHistory } from 'react-router-dom'
import LoadingIndicator from '../../../../components/LoadingIndicator'

function EntradaDeEstoque(){

    const [code, setCode] = useState('');
    const [show, setShow] = useState(false);

    const addCode = (newCode:string) => {
        if(newCode.length>=8){
            console.log(newCode)
            console.log(typeof(newCode))
            setCode(newCode.toString());
            setShow(true);
            return code
        }   
    }

    return(
        <React.Fragment>
        <LoadingIndicator/>
        <div className="mainDivPages">
            <div className="divHeader">
                <h1>Entrada de Estoque</h1>
                <h2>Dar entrada de mercadorias</h2>  
                <h2>no estoque</h2>

            </div>
            <div className="divCadastroProdutos">
                <form >
                    <label className="requiredInput">Código de barras</label>
                        {!show?(
                            <input id="inputCodigoBarras" className="nobutton" type="number" value = {code} required onChange={(e) => setCode(e.target.value)} onBlur={(e) => addCode(e.target.value)}/>
                        ):
                        (
                            <input type="number" readOnly value = {code} required onChange={(e) => setCode(e.target.value)} onBlur={(e) => addCode(e.target.value)}/>
                        )}
                        
                        {show&&(
                            <button onClick={()=>window.location.reload()}>Ler código novamente</button>
                            )
                        }
                    {show&&(
                        <React.Fragment>
                            <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text" 
                                required/>
                            <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text" 
                                required/>
                            <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text" 
                                required/>
                            <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text" 
                                required/>
                                <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text" 
                                required/>
                            <button className="submitButton" type="submit">Enviar</button>
                        </React.Fragment>
                        )
                    }
                </form>
                {!show&&(
                    <BarCodeReader addCode={addCode}></BarCodeReader>
                )
                }
            </div>
        </div>
        </React.Fragment>)
}

export default EntradaDeEstoque;