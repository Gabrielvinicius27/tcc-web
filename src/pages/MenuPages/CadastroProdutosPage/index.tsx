import React, { FormEvent, useState } from 'react'
import './styles.css'
import BarCodeReader from '../../../components/BarCodeReader'
import code from '../../../components/BarCodeReader'
import { string, array } from 'prop-types'
import api from '../../../services/api'
function CadastroProdutosPage(){
    
    const [code, setCode] = useState("");
    const [show, setShow] = useState(false);
    const [previewSource, setPreviewSource] = useState<any>();
    const [fileInputState,setFileInputState] = useState("");
    
    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if(!previewSource) return;
        uploadImage(previewSource)
    }

    const uploadImage = async (base64EncodedImage:string) => {
        console.log("oi")
        const response = await api.post("/imageUpload", {base64EncodedImage});
        console.log(response.data)
    }

    const addCode = (newCode:string) => {
        if(newCode.length>=8){
            setCode(newCode);
            setShow(true);
            return code
        }   
    }

    const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>|any) => {
        const file = e.target.files[0];
        previewFile(file);
    }

    const previewFile = (file:Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if(reader.result !== null && reader.result !== undefined){
                setPreviewSource(reader.result);
            }
        }
    }

    return(
        <main className="formCadastro">
            <div id="formDiv">
                <h1>Cadastro de produtos</h1>
                <h2>Para criar ou alterar produtos preencha</h2>
                <h2>as informações abaixo.</h2>
                <form className = "formCadastroProdutos" onSubmit={handleSubmit}>
                    <div id="inputBlock">
                        <label>Código de barras</label>
                        <div id="codeInput">
                            {!show?(
                                <input type="text" value = {code} required onChange={(e) => setCode(e.target.value)} onBlur={(e) => addCode(e.target.value)}/>
                            ):
                            (
                                <input id = "readOnly" type="text" readOnly value = {code} required onChange={(e) => setCode(e.target.value)} onBlur={(e) => addCode(e.target.value)}/>
                            )}
                            
                            {show&&(
                                <button onClick={()=>window.location.reload()}>Ler código novamente</button>
                                )
                            }
                        </div>
                        {show&&(
                            <div id="shownInputs">
                                <label>Nome do produto</label>
                                <input type="text" required/>
                                <label>Descrição</label>
                                <input type="text" required/>
                                <label>Marca</label>
                                <input type="text" required/>
                                <label>Embalagem</label>
                                <input type="text" required/>
                                <label>Conteúdo</label>
                                <input type="text" required/>
                                <label>Fornecedor</label>
                                <input type="text" required/>
                                <label>Imagem do produto</label>
                                <div className="imageUploadCard">
                                    <label htmlFor="inputFile">Selecionar um arquivo</label>
                                    <input id="inputFile" type="file" name="image" onChange={handleFileInputChange}
                                    value={fileInputState}></input>
                                    {previewSource && (
                                        <img src={previewSource} alt = 'Imagem do produto'></img>
                                    )}
                                </div>
                                <button className="submitButton" type="submit">Enviar</button>
                            </div>
                            )
                        }
                    </div>
                </form>
            </div>
            {!show&&(
                <div id="barCodeReader">   
                    <BarCodeReader addCode={addCode}/>
                </div>
                )
            }
        </main>
    )
}

export default CadastroProdutosPage