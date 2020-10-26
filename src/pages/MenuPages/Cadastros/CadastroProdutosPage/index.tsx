import React, {FormEvent, useEffect, useState } from 'react'
import './styles.css'
import '../../global.css'
import BarCodeReader from '../../../../components/BarCodeReader'
import api from '../../../../services/api'
import LoadingIndicator from '../../../../components/LoadingIndicator' 
import { trackPromise } from 'react-promise-tracker'


function CadastroProdutosPage(){
    
    const [code, setCode] = useState("initial");
    const [show, setShow] = useState(false);
    const [previewSource, setPreviewSource] = useState<any>();
    const [produtoExistente, setProdutoExistente] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const [newImageSent,setNewImageSent] = useState(false);
    const [nome, setNome] = useState("");
    const [marca, setMarca] = useState("");
    const [descricao, setDescricao] = useState("");
    const [embalagem, setEmbalagem] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [preco, setPreco] = useState(0.00);
    const [fornecedor, setFornecedor] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [categoria, setCategoria] = useState("");
    const [subcategoria, setSubcategoria] = useState("");
    const [segmento, setSegmento] = useState("");
    const [subsegmento, setSubsegmento] = useState("");
    const [imageURL, setImageURL] = useState("initial");
    const [unidade,setUnidade] = useState("mg")
    const [moeda,setMoeda] = useState("real")

    const addCode = (newCode:string) => {
        if(newCode.length>=8){
            console.log(newCode)
            console.log(typeof(newCode))
            setCode(newCode.toString());
            setShow(true);
            return code
        }   
    }

    useEffect(()=>{
        if(show===false)return
        verificaProdutoExistente()
    },[show])

    const verificaProdutoExistente = async() =>{
        const response = await trackPromise(api.get(`produto/${code}`))
        console.log(response)
        if(response.data.length === 0) {
            setProdutoExistente(false)
            return
        }
        if(response.data["0"].barcode == code){
            const data = response.data["0"]
            setProdutoExistente(true);
            setNome(data.nome);
            setMarca(data.marca);
            setDescricao(data.descricao);
            setEmbalagem(data.embalagem);
            setConteudo(data.conteudo);
            setUnidade(data.unidade_de_medida);
            setPreco(data.preco_sugerido);
            setMoeda(data.moeda);
            setFornecedor(data.fornecedor);
            setDepartamento(data.departamento);
            setCategoria(data.categoria);
            setSubcategoria(data.subcategoria);
            setSegmento(data.segmento);
            setSubsegmento(data.subsegmento);
            setImageURL(data.image_url);
            setPreviewSource(data.image_url);
            return
        }
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if(!newImageSent){
            setEnviar(true);
            return;
        }
        await uploadImage(previewSource);
        setEnviar(true);
    }

    // Quando o state Enviar tiver seu valor atualizado o useEffect será chamado
    useEffect(()=>{
        console.log("Enviar?"+enviar)
        if(enviar===false)return
        const data = {
            "barcode":code,
            nome,
            marca,
            descricao,
            embalagem,
            conteudo,
            "unidade_de_medida":unidade,
            "preco_sugerido":preco,
            moeda,
            fornecedor,
            departamento,
            categoria,
            subcategoria,
            segmento,
            subsegmento,
            "image_url":imageURL
        }
        if(produtoExistente===false){
            trackPromise(api.post('produto', data))
        }
        else{
            trackPromise(api.put(`produto/${code}`, data))
        }
        window.location.reload()
    },[enviar])


    const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>|any) => {
        setNewImageSent(true);
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

    const uploadImage = async (base64EncodedImage:string) => {
        try{
            const response = await trackPromise(api.post("/imageUpload", {base64EncodedImage}));
            setImageURL(response.data.url)
        }catch(err){
            console.log(err);
        }
    }

    return(
        <React.Fragment>
        <LoadingIndicator texto="Carregando informações sobre o produto"/>
        <div className="mainDivPages"> 
            <div className="divHeader">
                <h1>Cadastro de produtos</h1>
                <h2>Para criar ou alterar produtos preencha</h2>
                <h2>as informações abaixo.</h2>
            </div>
            <div className="divCadastroProdutos">
                <form onSubmit={handleSubmit}>
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
                            <label className="requiredInput">Imagem do produto</label>
                            <div className="imageUploadCard">
                                <label htmlFor="inputFile">Selecionar um arquivo</label>
                                {!previewSource&&
                                <input id="inputFile" type="file" name="image" required onChange={handleFileInputChange}></input>}
                                {previewSource&&
                                <input id="inputFile" type="file" name="image" onChange={handleFileInputChange}></input>}
                                    <img src={previewSource} alt = 'Imagem do produto'></img>                      
                            </div>
                            <label className="requiredInput">Nome do produto</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text"
                                value={nome} 
                                required
                                onChange={(e)=>{setNome(e.target.value)}}/>
                            <label className="requiredInput">Marca</label>
                            <input 
                                placeholder="Ex: Coca Cola" 
                                type="text" 
                                value={marca}
                                required
                                onChange={(e)=>{setMarca(e.target.value)}}/>
                            <label className="requiredInput">Descrição</label>
                            <input 
                                placeholder="Ex: Zero" 
                                type="text"
                                value={descricao}
                                required
                                onChange={(e)=>{setDescricao(e.target.value)}}/>
                            <label className="requiredInput">Embalagem</label>
                            <input 
                                placeholder="Ex: Pet" 
                                type="text"
                                value={embalagem} 
                                required
                                onChange={(e)=>{setEmbalagem(e.target.value)}}/>
                            <label className="requiredInput">Conteúdo</label>
                            <div className="input_n_select">
                                <input className="nobutton"
                                    placeholder="Ex: 2L" 
                                    type="text" 
                                    value={conteudo}
                                    required
                                    onChange={(e)=>{setConteudo(e.target.value)}}/>
                                <select name="conteudo"
                                    value={unidade}
                                    onChange={(e)=>{setUnidade(e.target.value)}}>
                                    <option value="mg">mg</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">mL</option>
                                    <option value="l">L</option>
                                    <option value="un">Unid.</option>
                                    <option value="oz">Oz</option>
                                    <option value="un">Un</option>
                                    <option value="m">m</option>
                                </select>
                            </div>
                            <label className="requiredInput">Preço sugerido</label>
                            <div className="input_n_select">
                                <input
                                    placeholder="Ex: 4,00 R$" 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={preco}
                                    required
                                    onChange = {(e)=>setPreco(parseFloat(e.target.value))}
                                />
                                <select name="moeda"
                                    value={moeda}
                                    onChange={(e)=>{setMoeda(e.target.value)}}>
                                        <option value="real">R$</option>
                                        <option value="dolar">US$</option>
                                        <option value="euro">€</option>
                                </select>
                            </div>
                            <label>Fornecedor</label>
                            <input 
                                placeholder="Ex: FEMSA" 
                                type="text"
                                value={fornecedor}
                                onChange={(e)=>{setFornecedor(e.target.value)}}/>
                            <label>Departamento</label>
                            <input 
                                placeholder="Ex: Alimento" 
                                type="text"
                                value={departamento}
                                onChange={(e)=>{setDepartamento(e.target.value)}}/>
                            <label>Categoria</label>
                            <input 
                                placeholder="Ex: Bebida não alcóolica" 
                                type="text"
                                value={categoria}
                                onChange={(e)=>{setCategoria(e.target.value)}}/>
                            <label>Subcategoria</label>
                            <input 
                                placeholder="Ex: Refrigerante" 
                                type="text"
                                value={subcategoria}
                                onChange={(e)=>{setSubcategoria(e.target.value)}}/>
                            <label>Segmento</label>
                            <input 
                                placeholder="Ex: Zero" 
                                type="text"
                                value={segmento}
                                onChange={(e)=>{setSegmento(e.target.value)}}/>
                            <label>Subsegmento</label>
                            <input 
                                placeholder="Ex: Zero açucar" 
                                type="text"
                                value={subsegmento}
                                onChange={(e)=>{setSubsegmento(e.target.value)}}/>
                            <button className="submitButton" type="submit">Enviar</button>
                        </React.Fragment>
                        )
                    }
                </form>
                {!show&&(
                    <BarCodeReader addCode={addCode}/>
                )
                }
            </div>
        </div>
        </React.Fragment>
    )
}

export default CadastroProdutosPage;