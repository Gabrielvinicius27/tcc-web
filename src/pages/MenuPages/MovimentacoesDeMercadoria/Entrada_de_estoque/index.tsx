import React, { FormEvent, useEffect, useState } from 'react'
import './styles.css'
import '../../global.css'
import BarCodeReader from '../../../../components/BarCodeReader'
import { useHistory } from 'react-router-dom'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import { trackPromise } from 'react-promise-tracker'
import api from '../../../../services/api'
import {PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

import QRCode from 'qrcode'
import {QRCode as QRCodes} from 'react-qrcode-logo'

function EntradaDeEstoque(){
    const history = useHistory();
    const [enviar, setEnviar] = useState(false)
    const [codeMounted, setCodeMounted] = useState(false)
    const [code, setCode] = useState('');
    const [show, setShow] = useState(false);
    const [textoLoading, setTextoLoading] = useState('initial');
    const [produtoExistente, setProdutoExistente] = useState(false);
    const [nomeProduto, setNomeProduto] =  useState("initial");
    const [marcaProduto, setMarcaProduto] =  useState("initial");
    const [descricaoProduto, setDescricaoProduto] =  useState("initial");
    const [embalagemProduto, setEmbalagemProduto] =  useState("initial");
    const [conteudoProduto, setConteudoProduto] =  useState("initial");
    const [unidadeMedidaProduto, setUnidadeMedidaProduto] =  useState("initial");
    const [imageURL, setImageURL] = useState("initial");
    const [lote, setLote] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [qtdItens, setQtdItens] = useState('');

    const [todayDate, setTodayDate] = useState('');
    const [valueCode, setValueCode] = useState<any>([{}]);
    const [codeType, setCodeType] = useState(false);
    const [formStep, setFormStep] = useState(0);
    const [color1, setColor1] = useState('#bbb');
    const [color2, setColor2] = useState('#bbb');
    const [color3, setColor3] = useState('#bbb');

    const [imgCodeURL, setImgCodeURL] = useState(false);
    const [marginBottomPDF, setMarginBottomPDF] = useState(5);
    //////////////////////////////////////////////////////////////////////////

    //Chamado quando o campo código de barras perde o foco e conter um código com mais de 8 digitos
    const addCode = (newCode:string) => {
        if(newCode.length>=8){
            //Muda o state Code preenchendo com o código de barras em string 
            setCode(newCode.toString());
            //Monta o código que irá no QRCode ou Datamatrix
            return code
        }   
    }

    //Aguarda state show ser alterado para verificar se produto existe
    useEffect(()=>{
        if(code==='')return
        verificaProdutoExistente()
    },[code])

    //Verifica se o produto já existe
    const verificaProdutoExistente = async() =>{
        setTextoLoading("Carregando informações do produto...")
        //Procura produto pelo código de barras
        const response = await trackPromise(api.get(`produto/${code}`))
        console.log(response)
        //Se nada encontrado então produto não existe ainda
        //Redireciona para a página de cadastro de produto
        if(response.data.length === 0) {
            setProdutoExistente(false)
            setShow(false)
            history.push("/main/produtos");
            return
        }
        //Se produto encontrado então carrega informações do produto
        if(response.data["0"].barcode === code){
            const data = response.data["0"]
            setProdutoExistente(true);
            setShow(true);
            setNomeProduto(data.nome);
            setMarcaProduto(data.marca);
            setDescricaoProduto(data.descricao);
            setEmbalagemProduto(data.embalagem);
            setConteudoProduto(data.conteudo);
            setUnidadeMedidaProduto(data.unidade_de_medida);
            setImageURL(data.image_url);
            return
        }
    }

    //Monta código que será QRCode ou Datamatrix
    //Código é composto por código de barras do produto + 3 zeros + data atual + número sequencial
    const mountCode = async() =>{
        setCodeMounted(false)   
        setImgCodeURL(false);
        setTextoLoading("Montando código QR e DataMatrix");
        //Reorna dia, mês e ano
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        setTodayDate(yyyy+'-'+mm+'-'+dd);
        //Procura por produtos com o mesmo código de barras e data atual para gerar número sequencial
        const response = await trackPromise(api.get(`produto_unidade/${code+'-'+yyyy+mm+dd}`))
        let sequentialNumber = 0
        //Se não existir nenhum produto unidade com esse código de barras e dia então o número sequencial é 1
        if(response.data.length === 0) {
            sequentialNumber = 0
        }
        //Se existir então número sequencial é quantidade de produtos unidades do dia atual + 1
        if(response.data.length !== 0){

            sequentialNumber = response.data.length
        }
        let codesSample = [{'seq':0,'valueCode':'initial'}]
        if (Number(qtdItens) > 0){
            //Passa o valor do código para a variável state valueCode
            for (let index = 0; index < Number(qtdItens); index++) {
            codesSample.push(
                {'seq':(codesSample[codesSample.length-1].seq)+1, 'valueCode':code+"-"+yyyy+mm+dd+(sequentialNumber+=1)}
            )
            }
            setValueCode([codesSample])
        }
       
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //Form de vários passos cada case é uma "pagina" do form
   
    const multiStepForm = (step:number) => {
        switch(step){
            case 0:
                return(
                    <React.Fragment>
                    <label>Número do Lote</label>
                    <input 
                        placeholder="Ex: VS133205523" 
                        type="text" 
                        value={lote}
                        onChange={(e)=>{setLote(e.target.value)}}/>
                    <label className="requiredInput">Data de Validade</label>
                    <input
                        className="textField"
                        placeholder="Ex: 08/03/2021" 
                        type="date" 
                        required
                        value={dataValidade}
                        onChange={(e)=>{setDataValidade(e.target.value)}}/>
                    </React.Fragment>
                )
            case 1:
                return(
                    <React.Fragment>
                    <label className="requiredInput">Quantidade de itens</label>
                    <input 
                        className="nobutton" 
                        type="number" 
                        value = {qtdItens} 
                        required 
                        onChange={(e) => setQtdItens(e.target.value)}/>
                    </React.Fragment>
                    )
            case 2:
                
                return(
                    <div style={{alignItems:'center'}}>
                        {valueCode[0].length>0 ? (
                        <div id="datamatrixDiv">
                            <QRCodes 
                                value={valueCode[0][1].valueCode}
                                size={90}
                                ecLevel='Q'>
                            </QRCodes>
                            <div id="textDiv">
                                <p>Teste</p>
                                {valueCodeSlice()}
                            </div>
                        </div>):(<label>Selecione a quantidade de QRCodes</label>)}
                        <button id='btnGerarPDF' onClick={(e)=> criarLinkPDF(e)}>Gerar PDF</button>
                        {(imgCodeURL)?(<PDFgenerate/>):(null)}
                    </div>
                )
        }
    }

    const criarLinkPDF =  async (e:FormEvent) =>{
        e.preventDefault();
        await inputToSVG();
        console.log(valueCode)
    }

    useEffect(()=>{
        if(valueCode[0].length>1){
            if(valueCode[0][1].base64!==undefined){
                setImgCodeURL(true);
            }
        }  
    },[valueCode])
    
    const valueCodeSlice = () =>{
       
        let separatorPosition = valueCode[0][1].valueCode.search("-")
        let slice1 = valueCode[0][1].valueCode.slice(0,separatorPosition)
        let slice2 = valueCode[0][1].valueCode.slice(separatorPosition+1,separatorPosition+9)
        let slice3 = valueCode[0][1].valueCode.slice(separatorPosition+9)
        return(
            <React.Fragment>
                <p>{slice1}</p>
                <p>{slice2}</p>
                <p>{slice3}</p>
            </React.Fragment>
        )
    }
    const mudaStep = (e:FormEvent,direction:string) => {
        e.preventDefault()
        if (direction==='decrementa'){
            setFormStep((formStep>0)?(formStep-1):(formStep))
        }
        if (direction==='incrementa'){
            setFormStep((formStep<2)?(formStep+1):(formStep))
        }
    }

    useEffect(()=>{
        console.log(formStep)
        switch(formStep){
            case 0:
                console.log('s1')
                setColor1('#d0efff')
                setColor2('#bbb')
                setColor3('#bbb')
                break;
            case 1:
                console.log('s2')
                setColor1('#bbb')
                setColor2('#d0efff')
                setColor3('#bbb')
                break;
            case 2:
                mountCode()
                console.log('s3')
                setColor1('#bbb')
                setColor2('#bbb')
                setColor3('#d0efff')
                break;
        }
    },[formStep])

    let stepGlow ='0 0 6px 8px #d0efff,0 0 10px 8px #1167B1,0 0 18px 10px #2a9df4'
    //////////////////////////////////////////////////////////////////////
    


    const PDFgenerate = () => {
        Font.register({family:'Montserrat', fonts:[
                        {src:'https://fonts.googleapis.com/css2?family=Montserrat&display=swap'}
                    ]})
        Font.register({family:'Popspins', fonts:[
                        {src:'https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap'},
                        {src:'https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap', fontWeight:600}
                    ]})
        // Create styles
        const styles = StyleSheet.create({
            page: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
            marginLeft:20,
            flexDirection: 'column',
            backgroundColor: '#FFFFFF'
            },
            header:{
            fontWeight:'semibold'
            },
            header_item:{
            fontWeight:'normal'
            },
            qrcode_text:{
            fontWeight:'normal',
            fontSize:8
            },
            section: {
            flexDirection: 'row',
            margin: 10,
            padding: 10,
            },
            first_section_row: {
            flexDirection: 'row',
            marginTop:20,
            padding:0,
            },
            section_row: {
            flexDirection: 'row',
            margin:0,
            padding:0,
            },
            section_column: {
            flexDirection: 'column',
            margin:5,
            padding:5,
            },
            section_qrcolumn: {
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 12,
            borderColor: "#555",
            padding:5,
            margin:5,
            minHeight:65,
            height:65,
            width:150,
            flexWrap:'wrap'
            },
            image: {
            width:50,
            height:50,
            },
            link:{
            padding:10,
            border:'1px solid #FFF',
            color:'#FFF'
            }
        });
        // Create Document Component
        const MyDocument = () => (
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View fixed style={styles.first_section_row}>
                            <Text style={styles.header}>Produto: </Text>
                            <Text style={styles.header_item}>{nomeProduto} {marcaProduto} {descricaoProduto} {embalagemProduto} {conteudoProduto}{unidadeMedidaProduto}</Text>
                        </View>
                        <View fixed style={styles.section_row}>
                            <Text style={styles.header}>Data de Validade: </Text>
                            <Text style={styles.header_item}>{dataValidade}</Text>
                        </View>
                        <View fixed style={styles.section_row}>
                            <Text style={styles.header}>Número do Lote: </Text>
                            <Text style={styles.header_item}>{lote}</Text>
                        </View>
                        <View fixed style={styles.section_row}>
                            <Text style={styles.header}>Número de Itens: </Text>
                            <Text style={styles.header_item}>{qtdItens}</Text>
                        </View>
                        <View fixed style={styles.section_row}>
                            <Text style={styles.header}>Data Impressão: </Text>
                            <Text style={styles.header_item}>{todayDate}</Text>
                        </View>
                       
                        <View style={styles.section_column}>
                            {
                                valueCode[0].map((valueCode:any)=>{
                                    if(valueCode.seq!==0 && valueCode.seq !== undefined){
                                        return(
                                            <View wrap={false} style={styles.section_qrcolumn}>
                                                <Image src={valueCode.base64} style={styles.image}/>
                                                <Text wrap style={styles.qrcode_text}>{valueCode.valueCode}</Text>                      
                                            </View>
                                        )
                                    }    
                            })}
                        </View>
                        <Text style={{marginTop:10}} render={({ pageNumber, totalPages }) => (
                             `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
            )
            
        return (
            <PDFDownloadLink style={styles.link} document={<MyDocument/>} fileName={`${code} ${todayDate} ${qtdItens}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Carregando...' : 'Imprimir PDF')}
            </PDFDownloadLink>
        )
    }
    
    const inputToSVG = async () => {
        
        let codesSample = valueCode[0]
        for (let index = 1; index < codesSample.length; index++) {
            let qrcode64 = await QRCode.toDataURL(codesSample[index].valueCode,{
                errorCorrectionLevel: "M",
                type: 'image/png',
                })
            codesSample[index] = {...codesSample[index], 'base64':qrcode64}
        }
        
        setValueCode([codesSample])
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if(imgCodeURL){
            setEnviar(true);
            let data:any = []
            let dataStatus:any = []
            setTextoLoading("Gravando os dados da transação de entrada de estoque...")
            valueCode[0].map((valueCode:any)=>{
                if (valueCode.seq!==0 && valueCode.seq!==undefined){
                    data.push({
                        "produto_barcode":code,
                        "value_code":valueCode.valueCode,
                        "numero_lote":lote,
                        "data_validade":dataValidade,
                        "status":'Em estoque',
                        "local": 'Estoque 1',
                        "descricao": 'teste inicial'
                    })
                    dataStatus.push({
                        "value_code":valueCode.valueCode, 
                        "status":'Em estoque',
                        "local": 'Estoque 1',
                    })
                }   
            })
            for (let index = 0; index < data.length; index++) {
                const res = await trackPromise(api.post('produto_unidade', data[index]))  
            }
            for (let index = 0; index < dataStatus.length; index++) {
                const resStatus =  await trackPromise(api.post('status_produto', dataStatus[index]))   
            }
           
            window.location.reload()
        }
    }

    // Quando o state Enviar tiver seu valor atualizado o useEffect será chamado
    useEffect(()=>{
        console.log("Enviar?"+enviar)
    
    },[enviar])

    return(
        <React.Fragment>
        <LoadingIndicator texto={textoLoading}/>
        <div className="mainDivPages">
            <div className="divHeader">
                <h1>Entrada de Estoque</h1>
                <h2>Dar entrada de mercadorias</h2>  
                <h2>no estoque</h2>
            </div>
            <div className="divCadastroProdutos">
                <form onSubmit={handleSubmit}>
                    <label className="requiredInput">Código de barras</label>
                        {!show?(
                            <input id="inputCodigoBarras" className="nobutton" type="number" required onBlur={(e) => addCode(e.target.value)}/>
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
                            <label>Imagem do produto</label>
                            <div className="imageUploadCard">
                                <img src={imageURL} alt = 'Imagem do produto'></img>                      
                            </div>
                            <label>Processo de entrada de estoque</label>
                            <div>
                                <div className='multistepForm'>
                                <button className='setaEsquerda' onClick={(e)=>mudaStep(e,'decrementa')}></button>
                                <div>
                                    {multiStepForm(formStep)}
                                </div>
                                <button className='setaDireita' onClick={(e)=>mudaStep(e,'incrementa')}></button>
                                </div>
                                <div className='divDot'>
                                    <span style={{backgroundColor:color1
                                                  ,boxShadow:(color1!='#bbb')?(stepGlow):("none")}}
                                                  className='dot'></span>
                                    <span style={{backgroundColor:color2
                                                  ,boxShadow:(color2!='#bbb')?(stepGlow):("none")}} 
                                                  className='dot'></span>
                                    <span style={{backgroundColor:color3
                                                  ,boxShadow:(color3!='#bbb')?(stepGlow):("none")}} 
                                                  className='dot'></span>
                                </div>
                            </div>
                            <button className="submitButton" type="submit">Gravar</button>
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