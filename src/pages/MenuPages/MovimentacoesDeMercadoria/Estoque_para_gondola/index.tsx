import React, { FormEvent, useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router-dom';
import BarCodeReader from '../../../../components/BarCodeReader';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import api from '../../../../services/api';
import './styles.css'

function EstoqueParaGondola(){
    const history = useHistory();

    const [textoLoadingIndicator, setTextoLoadingIndicator] = useState('');
    const [show, setShow] = useState(false)
    const [textoAlert, setTextoAlert] = useState('')
    const[valueBuffer, setValueBuffer] = useState('initial');

    const [valueCodeLocal, setValueCodeLocal] = useState('initial');
    const [localExistente, setLocalExistente] = useState(false);
    const [valueCodeProduto, setValueCodeProduto] = useState<any>([]);
    const [produtoExistente, setProdutoExistente] = useState(false);
    const [codigoIncorreto, setCodigoIncorreto] = useState(false)

    const [nomeLocal, setNomeLocal] = useState('');
    const [tipoLocal, setTipoLocal] = useState('');

    const [barcodeProduto, setBarcodeProduto] = useState('intial');
    const [loteProduto, setLoteProduto] = useState('initial');
    const [nomeProduto, setNomeProduto] =  useState("initial");
    const [marcaProduto, setMarcaProduto] =  useState("initial");
    const [descricaoProduto, setDescricaoProduto] =  useState("initial");
    const [embalagemProduto, setEmbalagemProduto] =  useState("initial");
    const [conteudoProduto, setConteudoProduto] =  useState("initial");
    const [unidadeMedidaProduto, setUnidadeMedidaProduto] =  useState("initial");

    const [produtosLidos, setProdutosLidos] = useState<any>([])
    const [arrayProduto, setArrayProduto] = useState<any>([])

    const addValueCode = (newCode:string) => {
        setValueBuffer(newCode.toString());
    }

    useEffect(()=>{ 
        if(valueBuffer !== 'initial'){
            if(localExistente===false){
                addValueCodeLocal(valueBuffer)
               
            }
            if(localExistente===true){
                addValueCodeProduto(valueBuffer)
                
            }
            setValueBuffer('initial')
        }
    },[valueBuffer])
    
    const addValueCodeLocal = (newCode:string) => {
        if(newCode.length!==0){
            console.log(newCode)
            console.log(typeof(newCode))
            setValueCodeLocal(newCode.toString());
            return valueCodeLocal
        }
    }

    //Aguarda state show ser alterado para verificar se local de armazenamento existe
    useEffect(()=>{
        if(valueCodeLocal==='initial')return
        verificaLocalExistente()
    },[valueCodeLocal])

    //Verifica se o local de armazenamento já existe
    const verificaLocalExistente = async() =>{
        setTextoLoadingIndicator("Carregando informações do local...")
        //Procura local de armazenamento pelo nome
        const response = await trackPromise(api.get(`estoque/${valueCodeLocal}`))
        //Se nada encontrado então local de armazenamento não existe ainda
        //Redireciona para a página de cadastro de local de armazenamento
        if(response.data.length === 0) {
            setLocalExistente(false)
            setShow(false)
            history.push("/main/estoque");
            return
        }
        //Se local de armazenamento encontrado então carrega informações do local
        if(response.data["0"].nome === valueCodeLocal){
            const data = response.data["0"]
            setLocalExistente(true);
            setShow(true);
            setNomeLocal(data.nome);
            setTipoLocal(data.tipo);
            return
        }
    }


    const addValueCodeProduto = (newCode:string) => {
        if(newCode.length!==0){
            console.log(valueCodeProduto)

            if(valueCodeProduto.includes(newCode)){
                setTextoAlert('Produto já está na lista')
                return
            }else{{setTextoAlert('')}}

            setValueCodeProduto([...valueCodeProduto, newCode.toString()]);
            return valueCodeProduto
        }
    }

    //Aguarda state show ser alterado para verificar se o produto existe
    useEffect(()=>{
        if(valueCodeProduto.length===0 || codigoIncorreto===true)return
        verificaProdutoExistente()
    },[valueCodeProduto])

    //Verifica se o produto existe
    const verificaProdutoExistente = async() =>{
        setTextoLoadingIndicator("Carregando informações do produto...")
        //Procura o produto pelo QR Code
        const response = await trackPromise(api.get(`produto_unidade/equal/${valueCodeProduto[valueCodeProduto.length-1]}`))
        console.log(response)
        //Se nada encontrado então local de armazenamento não existe ainda
        //Redireciona para a página de cadastro de local de armazenamento
        if(response.data.length === 0) {
            setCodigoIncorreto(true)
            setValueCodeProduto(valueCodeProduto.filter((e:any)=>(e!==valueCodeProduto[valueCodeProduto.length-1])))
            setTextoAlert('Código não encontrado nos registros')
            setProdutoExistente(false)
            return
        }
        
        //Se produto ainda não registrado então carrega informações
        if(response.data["0"].value_code === valueCodeProduto[valueCodeProduto.length-1]){
            setTextoAlert('')
            const data = response.data["0"]

            setLoteProduto(data.numero_lote);

            const barcodeSeparator = valueCodeProduto[valueCodeProduto.length-1].search('-');
            const barcode = valueCodeProduto[valueCodeProduto.length-1].slice(0,barcodeSeparator)
            const dataProduto = await trackPromise(api.get(`produto/${barcode}`))

            if(dataProduto.data[0].barcode === barcode){
                const data2 = dataProduto.data[0]
                setBarcodeProduto(data2.barcode);
                setNomeProduto(data2.nome);
                setMarcaProduto(data2.marca);
                setDescricaoProduto(data2.descricao);
                setEmbalagemProduto(data2.embalagem);
                setConteudoProduto(data2.conteudo);
                setUnidadeMedidaProduto(data2.unidade_de_medida);
            }
            setProdutoExistente(true);
            setCodigoIncorreto(false);
            return
        }
    }

    useEffect(()=>{
        if(produtoExistente===true){
            setArrayProduto([...arrayProduto,{
                'barcode':barcodeProduto,
                'nome':nomeProduto,
                'marca':marcaProduto,
                'descricao':descricaoProduto,
                'embalagem':embalagemProduto,
                'conteudo':conteudoProduto,
                'unidadeMedida':unidadeMedidaProduto,
                'lote':loteProduto
            }])
            setProdutoExistente(false)   
        }
    },[produtoExistente])

    useEffect(()=>{
        if(arrayProduto.length!==0){
            countArrayProduto()
        }
    },[arrayProduto])

    useEffect(()=>{console.log(produtosLidos)},[produtosLidos])

    function isEquivalent(a:any, b:any) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
    
    const countArrayProduto = () => {
        arrayProduto.sort();
        console.log(arrayProduto.sort());
        let sample:any = []
        var current = null;
        var count = 0;
        for (var i = 0; i<arrayProduto.length; i++){
            
            if(current===null){
                if(count > 0){
                    sample = [...sample, {'produto':current, 'quantidade':count}]
                }
                current = arrayProduto[i];
                count = 1;
            }else {
                if(isEquivalent(arrayProduto[i],current)){
                    count++;
                }else{
                    if(count > 0){
                        sample = [...sample, {'produto':current, 'quantidade':count}]
                    }
                    current = arrayProduto[i];
                    count = 1;
                }
            }
            
        }
        if (count > 0){
            sample = [...sample, {'produto':current, 'quantidade':count}]
        }   
        setProdutosLidos(sample) 
    }

    const handleSubmit = async () => {
        if(valueCodeProduto.length!==0){
            let dataStatus:any = []
            let data:any = []
            setTextoLoadingIndicator("Gravando os dados da transação colocar produtos em exposição...")
            valueCodeProduto.map((valueCode:any)=>{
                {

                    data.push({
                        "status":'Em exposição',
                        "local": valueCodeLocal,
                    })
                    dataStatus.push({
                        "value_code":valueCode, 
                        "status":'Em exposição',
                        "local": valueCodeLocal,
                    })
                }   
            })
            for (let index = 0; index < data.length; index++) {
                const res = await trackPromise(api.put(`produto_unidade/updateLocal/${valueCodeProduto[index]}`, data[index]))  
            }
            for (let index = 0; index < dataStatus.length; index++) {
                const resStatus =  await trackPromise(api.post('status_produto', dataStatus[index]))   
            }
           window.location.reload()
        }
    }

    return(
        <React.Fragment>
        <LoadingIndicator texto={textoLoadingIndicator}/>
        <div className="mainDivPages">
            <div className="divHeader">
                <h1>Colocar Produtos em Exposição</h1>
                <h2>Insira o nome ou leia o QR Code do local de armazenamento</h2>  
                <h2>e leia o QR Code dos produtos que for armazenar.</h2>
            </div>
            <div id ='divEstoqueGondola'>
                <form onSubmit={handleSubmit}>
                <label className='requiredInput'>Nome do local de estoque</label>
                    {!show&&
                        (<input
                        id='inputCodigoBarras'
                        onBlur={(e)=>{addValueCodeLocal(e.target.value)}}
                        required/>)
                    }
                    {show&&
                        (<input  
                        readOnly 
                        value = {valueCodeLocal}/>)
                    }
                   
                {show&&(
                    <React.Fragment>
                        <label>QR Code do Produto</label>
                        <input
                            onBlur={(e)=>{addValueCodeProduto(e.target.value)}}
                        />
                        <label>Lista de itens que serão adicionados</label>
                        {textoAlert!=='' && <p className='pAlert'>{textoAlert}</p>}
                        {produtosLidos.length!==0&&
                            <ul className='list'>
                            {produtosLidos.map((produto:any)=>{
                                return(
                                <li>{produto.quantidade+'X '+produto.produto.nome+' '+produto.produto.marca+
                                    ' '+produto.produto.descricao+' '+produto.produto.embalagem+' '+
                                    produto.produto.conteudo+produto.produto.unidadeMedida+' Lote: '+produto.produto.lote}</li>)
                            })}
                            </ul>
                        }
                    </React.Fragment>
                )}
                </form>
                <BarCodeReader scale={!localExistente?(1):(0.7)} addCode={addValueCode}></BarCodeReader>
            </div>
            {show&&valueCodeProduto.length!==0&&(<button className='btnEstoqueGondola' onClick={()=>handleSubmit()}>Gravar</button>)}
        </div>
        </React.Fragment>
    )
}

export default EstoqueParaGondola;