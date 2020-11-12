import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import BarCodeReader from '../../../../components/BarCodeReader';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import api from '../../../../services/api';
import './styles.css';

function GondolaVenda(){

    const [show, setShow] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [textLoadinIndicator, setTextoLoadingIndicator] = useState('');

    const [valueCode, setValueCode] = useState<any>([])
    const [produtoExistente, setProdutoExistente] = useState(false)
    const [codigoIncorreto, setCodigoIncorreto] = useState(false)

    const [barcodeProduto, setBarcodeProduto] = useState('intial');
    const [nomeProduto, setNomeProduto] =  useState("initial");
    const [marcaProduto, setMarcaProduto] =  useState("initial");
    const [descricaoProduto, setDescricaoProduto] =  useState("initial");
    const [embalagemProduto, setEmbalagemProduto] =  useState("initial");
    const [conteudoProduto, setConteudoProduto] =  useState("initial");
    const [unidadeMedidaProduto, setUnidadeMedidaProduto] =  useState("initial");
    const [precoProduto, setPrecoProduto] = useState(0);

    const [produtosLidos, setProdutosLidos] = useState<any>([])
    const [arrayProduto, setArrayProduto] = useState<any>([])

    const [totalCompras, setTotalCompras] = useState<any>(0)

    const addValueCode = (newCode:string) => {
        if(newCode.length!==0){
            setCodigoIncorreto(false)
            console.log(valueCode)

            if(valueCode.includes(newCode)){
                setTextAlert('Produto já está na lista')
                return
            }else{{setTextAlert('')}}

            setValueCode([...valueCode, newCode.toString()]);
            return valueCode
        }
    }

     //Aguarda state show ser alterado para verificar se o produto existe
     useEffect(()=>{
        if(valueCode.length===0 || codigoIncorreto===true)return
        console.log('VALUE CODE:'+valueCode)
        verificaProdutoExistente()
    },[valueCode])

    //Verifica se o produto existe
    const verificaProdutoExistente = async() =>{
        setTextoLoadingIndicator("Carregando informações do produto...")
        //Procura o produto pelo QR Code
        const response = await trackPromise(api.get(`produto_unidade/equal/${valueCode[valueCode.length-1]}`))
        console.log(response)
        setShow(true)
        //Se nada encontrado então produto não existe ainda
        if(response.data.length === 0) {
            setProdutoExistente(false)
            setCodigoIncorreto(true)
            setValueCode(valueCode.filter((e:any)=>(e!==valueCode[valueCode.length-1])))
            setTextAlert('Código não encontrado nos registros')
            return
        }
        //Se produto encontrado então carrega informações
        if(response.data["0"].value_code === valueCode[valueCode.length-1]){
            setTextAlert('')
            const data = response.data["0"]

            const barcodeSeparator = valueCode[valueCode.length-1].search('-');
            const barcode = valueCode[valueCode.length-1].slice(0,barcodeSeparator)
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
                setPrecoProduto(data2.preco_sugerido);
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
                'preco':precoProduto
            }])
            setProdutoExistente(false)   
        }
    },[produtoExistente])

    useEffect(()=>{
        if(arrayProduto.length!==0){
            countArrayProduto()
        }
    },[arrayProduto])

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

    useEffect(()=>{
        if(produtosLidos.length===0)return
        let total = 0
        produtosLidos.map((produto:any)=>{
            if(produto!==undefined){
                total = total + (produto.produto.preco*produto.quantidade)
            }
           
        })
        setTotalCompras((total).toFixed(2))
    },[produtosLidos])

    const handleSubmit = async () => {
        if(valueCode.length!==0){
            let dataStatus:any = []
            let data:any = []
            setTextoLoadingIndicator("Gravando os dados da transação colocar produtos em exposição...")
            valueCode.map((valueCode:any)=>{
                {
                    data.push({
                        "status":"Vendido",
                        "local": "Desconhecido"
                    })
                    dataStatus.push({
                        "value_code":valueCode, 
                        "status":"Vendido",
                        "local":"Desconhecido"
                    })
                }   
            })
            for (let index = 0; index < data.length; index++) {
                const res = await trackPromise(api.put(`produto_unidade/updateLocal/${valueCode[index]}`, data[index]))  
            }
            for (let index = 0; index < dataStatus.length; index++) {
                const resStatus =  await trackPromise(api.post('status_produto', dataStatus[index]))   
            }
           window.location.reload()
        }
    }

    return(
        <React.Fragment>
        <LoadingIndicator texto={textLoadinIndicator}/>
        <div className='mainDivPages'>
            <div className='divHeader'>
                <h1>Vender Produtos</h1>
                <h2>Insira ou leia o QR Code dos produtos que deseja vender</h2>
            </div>
            <div id ='divGondolaVenda'>
                <form>
                <label className='requiredInput'>QRCode Produto</label>
                  
                    <input
                    id='inputCodigoBarras'
                    onBlur={(e)=>{addValueCode(e.target.value)}}
                    required/>
                    
                    {show&&(
                    <React.Fragment>
                        <label>Lista de itens que serão adicionados</label>
                        {textAlert!=='' && <p className='pAlert'>{textAlert}</p>}
                        {produtosLidos.length!==0&&
                            <ul className='listVenda'>
                            {produtosLidos.map((produto:any)=>{
                                return(
                                <React.Fragment>
                                <li className='LIproduto'>{produto.quantidade+'X '+produto.produto.nome+' '+produto.produto.marca+
                                    ' '+produto.produto.descricao+' '+produto.produto.embalagem+' '+
                                    produto.produto.conteudo+produto.produto.unidadeMedida+' '
                                    }</li>
                                <li className='LIpreco'>{produto.produto.preco+' R$'}
                                    </li>
                                </React.Fragment>)
                            })}
                            </ul>
                        }
                        {produtosLidos.length!==0&&
                            <ul className='listVenda'>
                                <li className='LIproduto'>Total
                                    </li>
                                <li className='LIpreco'>{totalCompras+' R$'
                                    }</li>
                            </ul>
                        }
                    </React.Fragment>
                )}
                </form>
                <BarCodeReader addCode={addValueCode}></BarCodeReader>
                
            </div>
            {show&&valueCode.length!==0&&(<button className='btnGondolaVenda' onClick={()=>handleSubmit()}>Gravar</button>)}
        </div>
        </React.Fragment>
    )

}

export default GondolaVenda;