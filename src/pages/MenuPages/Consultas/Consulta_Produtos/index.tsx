import { Step, StepConnector, StepContent, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker';
import { Steps } from 'rsuite';
import BarCodeReader from '../../../../components/BarCodeReader';
import Gauge from '../../../../components/Gauge/index.jsx';
import LoadingIndicator from '../../../../components/LoadingIndicator'
import api from '../../../../services/api';
import './styles.css'


function ConsultaProduto(){

    const [show, setShow] = useState(false);
    const [textLoadingIndicator, setTextLoadingIndicator] = useState('')
    const [textAlert, setTextAlert] = useState('')
    const [textSuccess, setTextSuccess] = useState('')

    const [valueCodeProduto, setValueCodeProduto] = useState('');
    const [produtoExistente, setProdutoExistente] = useState(false);

    const [barcodeProduto, setBarcodeProduto] = useState('intial');
    const [nomeProduto, setNomeProduto] =  useState("initial");
    const [marcaProduto, setMarcaProduto] =  useState("initial");
    const [descricaoProduto, setDescricaoProduto] =  useState("initial");
    const [embalagemProduto, setEmbalagemProduto] =  useState("initial");
    const [conteudoProduto, setConteudoProduto] =  useState("initial");
    const [unidadeMedidaProduto, setUnidadeMedidaProduto] =  useState("initial");
    const [imageURLProduto, setImageURLProduto] = useState("initial");
    const [loteProduto, setLoteProduto] = useState('initial');
    const [dataValidadeProduto, setDataValidadeProduto] = useState('initial');
    const [precoProduto, setPrecoProduto] = useState('initial')

    const [umidadeProduto, setUmidadeProduto] = useState('initial');
    const [temperaturaProduto, setTemperaturaProduto] = useState('initial');
    const [localProduto, setLocalProduto] = useState('initial');

    const[dataValidadeProdutoEnglish, setDataValidadeProdutoEnglish] = useState('initial');

    const[metaDataValidade, setMetaDataValidade] = useState(0);
    const[metaDataValidadeExistente, setMetaDataValidadeExistente] = useState(false);
    const[metaTemperaturaMin, setMetaTemperaturaMin] = useState('initial');
    const[MetaTemperaturaMinExistente,setMetaTemperaturaMinExistente] = useState(false);
    const[metaTemperaturaMax, setMetaTemperaturaMax] = useState('initial');
    const[metaTemperaturaMaxExistente,setMetaTemperaturaMaxExistente] = useState(false);
    const[metaUmidadeMin, setMetaUmidadeMin] = useState('initial');
    const[metaUmidadeMinExistente, setMetaUmidadeMinExistente] = useState(false);
    const[metaUmidadeMax, setMetaUmidadeMax] = useState('initial');
    const[metaUmidadeMaxExistente,setMetaUmidadeMaxExistente] = useState(false);
    const[statusProduto, setStatusProduto] = useState<any>([]);
    const[statusAtual, setStatusAtual] = useState('initial');
    
    const[diffDias, setDiffDias] = useState(0)

    const[corData, setCorData] = useState(-1)

    const addValueCodeProduto = (newCode:string) => {
        if(newCode.length!==0){
            console.log(valueCodeProduto)
            setValueCodeProduto(newCode.toString());
            return valueCodeProduto
        }
    }

    //Aguarda state show ser alterado para verificar se o produto existe
    useEffect(()=>{
        if(valueCodeProduto==='')return
        verificaProdutoExistente()
    },[valueCodeProduto])

    //Verifica se o produto existe
    const verificaProdutoExistente = async() =>{
        setTextLoadingIndicator("Carregando informações do produto...")
        //Procura o produto pelo QR Code
        const response = await trackPromise(api.get(`produto_unidade/equal/${valueCodeProduto}`))
        console.log(response)
        setShow(true)
        //Se nada encontrado então local de armazenamento não existe ainda
        //Redireciona para a página de cadastro de local de armazenamento
        if(response.data.length === 0) {
            setValueCodeProduto('')
            setTextAlert('Código não encontrado nos registros')
            setProdutoExistente(false)
            return
        }
        
        //Se produto ainda não registrado então carrega informações
        if(response.data["0"].value_code === valueCodeProduto){
            setTextAlert('')
            const data = response.data["0"]

            const local = data.local;
            setLocalProduto(data.local);
            setLoteProduto(data.numero_lote);
            setStatusAtual(data.status);

            if(data.statusProduto.length!==0){
                setStatusProduto(data.statusProduto);
            }

            let dataValidade = new Date(data.data_validade)
            var dd = String(dataValidade.getDate()+1).padStart(2, '0');
            var mm = String(dataValidade.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = dataValidade.getFullYear();
            setDataValidadeProduto(`${dd}/${mm}/${yyyy}`)
            setDataValidadeProdutoEnglish(`${mm}/${dd}/${yyyy}`)

            const barcodeSeparator = valueCodeProduto.search('-');
            const barcode = valueCodeProduto.slice(0,barcodeSeparator)
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
                setImageURLProduto(data2.image_url)
                setPrecoProduto(data2.preco_sugerido)
            }


            const dataProdutoMeta = await trackPromise(api.get(`produto_meta/${barcode}`))
            if(dataProdutoMeta.data.length !== 0){
                if(dataProdutoMeta.data[0].qtde_dias_vender_antes_vencimento !== null){
                    const data = dataProdutoMeta.data[0]
                    setMetaDataValidade(data.qtde_dias_vender_antes_vencimento)
                    setMetaDataValidadeExistente(true)
                }else{
                    setMetaDataValidadeExistente(false)
                }

                if(dataProdutoMeta.data[0].temperatura_minima !==null){
                    const data = dataProdutoMeta.data[0]
                    setMetaTemperaturaMin(data.temperatura_minima)
                    setMetaTemperaturaMinExistente(true)
                }else{
                    setMetaTemperaturaMinExistente(false)
                }

                if(dataProdutoMeta.data[0].temperatura_maxima !==null){
                    const data = dataProdutoMeta.data[0]
                    setMetaTemperaturaMax(data.temperatura_maxima)
                    setMetaTemperaturaMaxExistente(true)
                }else{
                    setMetaTemperaturaMaxExistente(false)
                }

                if(dataProdutoMeta.data[0].umidade_minima !==null){
                    const data = dataProdutoMeta.data[0]
                    setMetaUmidadeMin(data.umidade_minima)
                    setMetaUmidadeMinExistente(true)
                }else{
                    setMetaUmidadeMinExistente(false)
                }

                if(dataProdutoMeta.data[0].umidade_maxima !==null){
                    const data = dataProdutoMeta.data[0]
                    setMetaUmidadeMax(data.umidade_maxima)
                    setMetaUmidadeMaxExistente(true)
                }else{
                    setMetaUmidadeMaxExistente(false)
                }
            }else{
                setMetaDataValidadeExistente(false)
                setMetaTemperaturaMinExistente(false)
                setMetaTemperaturaMaxExistente(false)
                setMetaUmidadeMinExistente(false)
                setMetaUmidadeMaxExistente(false)
            }

            const dataLocalProduto = await trackPromise(api.get(`estoque/${local}`))
            if(dataLocalProduto.data.length !== 0){
                if(dataLocalProduto.data[0].sensors.length !== 0){
                    if(dataLocalProduto.data[0].sensors[0].temperaturas.length !== 0){
                        const data = dataLocalProduto.data[0].sensors[0].temperaturas
                        setTemperaturaProduto(data[(data.length)-1].temperatura_celcius)
                        setUmidadeProduto(data[(data.length)-1].umidade)
                    }
                }
            }

            
            setProdutoExistente(true);
            return
        }
    }

    useEffect(()=>{
        
    },[statusAtual])

    /*//////////////////DATA DE VALIDADE////////////////////////////////////*/
    useEffect(()=>{
        if(metaDataValidade===0)return
        diferencaDias()
    },[metaDataValidade])

    const diferencaDias = () => {
        let dataValidade = new Date(dataValidadeProdutoEnglish)

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = new Date(mm+'/'+dd+'/'+yyyy);
        
        var date_diff_indays = function(date1:Date, date2:Date) {
            var dt1 = date1
            var dt2 = date2;
            return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
            }
        
        var diff  = date_diff_indays(dataValidade, today);
        
        if (diff < 0){diff = diff*-1}
        setDiffDias(diff)
    }

    useEffect(()=>{
        if(metaDataValidadeExistente===false)return
        
        let porcMeta = diffDias/metaDataValidade
        
        if(porcMeta>=1){setCorData(120)}
        if(porcMeta<1){
            setCorData(120*porcMeta)
        }
    },[diffDias, metaDataValidade])

    
    const gravarMetaDataValidade = async () => {
        setTextLoadingIndicator('Gravando meta...')
        const data = {
            'qtde_dias_vender_antes_vencimento':metaDataValidade
        }
        
        try{
            if(metaDataValidadeExistente===false){
                const res = await trackPromise(api.post(`produto_meta`, {...data,'produto_barcode':barcodeProduto}))
            }else{
                const res = await trackPromise(api.put(`produto_meta/${barcodeProduto}`, data))
            }
            setTextSuccess('Meta gravada com Sucesso')
        }catch(err){setTextAlert('Ocorreu um erro')}
    }
    /*//////////////////////////////////////////////////////////////////////////////////*/

    const ColorlibConnector = withStyles({
        alternativeLabel: {
          top: 22,
        },
        active: {
          '& $line': {
            backgroundImage:
              'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
          },
        },
        completed: {
          '& $line': {
            backgroundImage:
              'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
          },
        },
        line: {
          height: 3,
          border: 0,
          backgroundColor: '#eaeaf0',
          borderRadius: 1,
        },
      })(StepConnector);

    return(
        <React.Fragment>
        <LoadingIndicator texto={textLoadingIndicator}/>
        <div className="mainDivPages">
            <div className="divHeader">  
                <h1>Consulta de Produto</h1>
                <h2>Informe ou leia o QR Code para</h2>
                <h2>consultar informações sobre o produto</h2>
            </div>
            <div>
                <form>
                    <label className='requiredInput'>QR Code do Produto</label>
                    {!show&&
                        (<input
                        onBlur={(e)=>{addValueCodeProduto(e.target.value)}}
                        required/>)
                    }
                    {show&&
                        (<input  
                        readOnly 
                        value = {valueCodeProduto}/>)
                    }
                    {show&&(
                        <React.Fragment>
                        <h2 style={{margin:'3rem 0', padding:'1rem', backgroundColor:'rgba(128, 128, 128, 0.267)', borderRadius:'0.8rem'}}>{nomeProduto} {marcaProduto} {descricaoProduto} {embalagemProduto} {conteudoProduto}{unidadeMedidaProduto} Lote {loteProduto} {precoProduto}R$</h2>
                        <label>Imagem do produto</label>
                        <div id="CimageUploadCard">
                            {statusProduto.length!==0&&(
                                <React.Fragment>
                                <Stepper alternativeLabel activeStep={statusProduto.length-1}>
                                    {
                                    statusProduto.map((statusProduto:any)=>{
                                        return(
                                            <Step>
                                                <StepLabel>{statusProduto.status}</StepLabel>
                                                <StepContent>
                                                    <p>Local: {statusProduto.local}</p>
                                                    <p>Data: {statusProduto.created_at}</p>
                                                </StepContent>
                                            </Step>
                                        )
                                    })}
                                </Stepper>
                                </React.Fragment>)}
                            <img src={imageURLProduto} alt = 'Imagem do produto'></img>                      
                        </div>
                        </React.Fragment>
                    )}
                </form>
                {show&&
                (<div id='dashboard'>
                    <div id='divDataValidade' >
                        <p>Data de validade:</p>
                        <div style={{backgroundColor: `hsl(${corData}, 50%, 50%)`}}>
                            <label>{dataValidadeProduto}</label>
                        </div>
                        <p className='pMenor'>Meta Atual: Vender com {metaDataValidade} dias antes do vencimento</p>
                        <p className='pMenor'>Período até o vencimento: {diffDias}</p>
                    </div>
                    <div id='divCadastroMetaDataValidade'>
                        <div>
                            {textAlert!=='' && <p className='pAlert'>{textAlert}</p>}
                            {textSuccess!=='' && <p onClick={()=>setTextSuccess('')} className='pSuccess'>{textSuccess}</p>}
                            <p>Informe a quantidade ideal</p>
                            <p>de dias para o produto ser vendido</p>
                            <p>antes do vencimento</p>
                            <input type='number' onBlur={(e)=>{setMetaDataValidade(Number(e.target.value))}}></input>
                            <button onClick={()=>{gravarMetaDataValidade()}}>Gravar</button>
                        </div>
                    </div>
                    <div id='gauge'>
                        {temperaturaProduto!=='initial'&&(
                            <Gauge value={Number(temperaturaProduto)} 
                            min={Number(metaTemperaturaMin)}
                            max={Number(metaTemperaturaMax)}
                            label={'Temperatura'}
                            units={'ºC'}
                            cor1={"#0302FC"}
                            cor2={"#FE0002"}/>
                            )}
                    </div>
                    <div id='gauge2' >
                        {umidadeProduto!=='initial'&&(
                            <Gauge 
                            cor1="#90EE90"
                            cor2="#008000"
                            value={Number(umidadeProduto)} 
                            min={Number(metaUmidadeMin)}
                            max={Number(metaUmidadeMax)}
                            label={'Umidade'}
                            units={'%'}
                            />)}
                    </div>
                   
                </div>)}
                
                {!show&&(<BarCodeReader addCode={addValueCodeProduto}></BarCodeReader>)}
            </div>
        </div>
        </React.Fragment>        
    )
}

export default ConsultaProduto;