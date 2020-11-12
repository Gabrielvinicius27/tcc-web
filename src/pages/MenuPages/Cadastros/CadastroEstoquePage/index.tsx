import {PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import React, { FormEvent, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import QRCode from 'qrcode'
import LoadingIndicator from '../../../../components/LoadingIndicator';
import api from '../../../../services/api';
import "./styles.css"

function CadastroEstoquePage (){
    const [show, setShow] = useState(false)
    const [estoqueExistente, setEstoqueExistente] = useState(false)
    const [textoLoadingIndicator, setTextoLoadingIndicator] = useState('')

    const [nomeEstoque, setNomeEstoque] = useState('')
    const [tipoEstoque, setTipoEstoque] = useState('')
    const [listaTipos, setListaTipos] = useState<any>([])
    const [valueCode, setValueCode] = useState('')
    const [imgCodeURL, setImgCodeURL] = useState(false)

    useEffect(()=>{
        if(nomeEstoque!==''){
            console.log(nomeEstoque)
            verificaEstoqueExistente()
        }
    },[nomeEstoque])

    const verificaEstoqueExistente = async () =>{
        setTextoLoadingIndicator('Carregando informações sobre o estoque')
        const response = await trackPromise(api.get(`estoque/${nomeEstoque}`))
        console.log(response)
        
        if (response.data.length !== 0){
            setEstoqueExistente(true);
            setTipoEstoque(response.data[0].tipo);
            setNomeEstoque(response.data[0].nome)
        }
        else{
            setEstoqueExistente(false);
        }
        const lista_estoques = new Array
        const tipos_estoque = await api.get(`estoque`)
        tipos_estoque.data.map((tipos_estoque:any)=>{
            lista_estoques.push(tipos_estoque.tipo)
        })
        let distinct_lista = new Set(lista_estoques)
        setListaTipos(Array.from(distinct_lista))
    }

    useEffect(()=>{
        if(listaTipos.length!==0)
        {   
            console.log(listaTipos)
            setShow(true)
        }
    },[listaTipos])

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
            fontSize:8,
            marginLeft:2
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
            section_qrrow: {
            flexDirection: 'row',
            borderWidth: 2,
            borderRadius: 12,
            borderColor: "#555",
            padding:5,
            margin:5,
            minHeight:115,
            height:115,
            width:200,
            flexWrap:'wrap'
            },
            image: {
            width:100,
            height:100,
            },
            link:{
            padding:10,
            margin:10,
            borderWidth: 2,
            borderRadius: 12,
            borderColor: "#555",
            backgroundColor:"#FFF",
            color:'#444',
            width:150,
            textAlign:'center'
            }
        });
        // Create Document Component
        const MyDocument = () => (
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View fixed style={styles.first_section_row}>
                            <Text style={styles.header}>Nome: </Text>
                            <Text style={styles.header_item}>{nomeEstoque}</Text>
                        </View>
                        <View style={styles.section_column}>
                            <View wrap={false} style={styles.section_qrrow}>
                                <Image src={valueCode} style={styles.image}/>
                                <Text style={styles.qrcode_text}>{nomeEstoque}</Text>                      
                            </View>
                        </View>
                        <Text style={{marginTop:10}} render={({ pageNumber, totalPages }) => (
                             `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
            )
            
        return (
            <PDFDownloadLink style={styles.link} document={<MyDocument/>} fileName={`QRCODE ${nomeEstoque}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Carregando...' : 'Imprimir PDF')}
            </PDFDownloadLink>
        )
    }
    
    const inputToSVG = async () => {
        let qrcode64 = await QRCode.toDataURL(nomeEstoque,{
            errorCorrectionLevel: "M",
            type: 'image/png',            
            })
        setValueCode(qrcode64)
    }
        
    const criarLinkPDF =  async (e:FormEvent) =>{
        e.preventDefault();
        await inputToSVG();
    }

    useEffect(()=>{
        if(valueCode!==''){
            setImgCodeURL(true);
        }  
    },[valueCode])
    
    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if(imgCodeURL && tipoEstoque!==''){
            let data:any = []
            setTextoLoadingIndicator("Gravando os dados da transação de entrada de estoque...")
            data = {
                "nome":nomeEstoque,
                "tipo":tipoEstoque,
            }
                   
            if(estoqueExistente===false){
                const res = await trackPromise(api.post('estoque', data))
                console.log(res)
            }
            if(estoqueExistente===true){
                const res = await trackPromise(api.put(`estoque/${nomeEstoque}`, data))
                console.log(res)
            }
            window.location.reload()
        }
    }

    return(
        <React.Fragment>
        <LoadingIndicator texto={textoLoadingIndicator}/>
        <div className="mainDivPages">
            <div className="divHeader">  
                <h1>Cadastro de Estoque</h1>
                <h2>Para cadastrar ou alterar um local</h2>
                <h2>Digite o nome abaixo</h2>
            </div>
            <div>
                <form onSubmit={(e)=>{handleSubmit(e)}}>
                    <label className='requiredInput'>Nome do local de estoque</label>
                    {!show&&
                        (<input
                        onBlur={(e)=>{setNomeEstoque(e.target.value)}}
                        required/>)
                    }
                    {show&&
                        (<input  
                        readOnly 
                        value = {nomeEstoque}/>)
                    }
                    {show&&(
                        <React.Fragment>
                            <label className='requiredInput'>Tipo do estoque</label> 
                            <select id='selectCadastroEstoque'
                            required
                            value={tipoEstoque}
                            onChange={(e)=>{setTipoEstoque(e.target.value)}}>
                                <option value="" selected></option>
                                {listaTipos.map((listaTipos:any)=>{
                                    return(<option value={listaTipos}>{listaTipos}</option>)
                                })}
                            </select>
                            <div>
                                <button id='btnGerarPDF' onClick={(e)=> criarLinkPDF(e)}>Gerar PDF</button>
                                {(imgCodeURL)?(<PDFgenerate/>):(null)}
                            </div>
                            
                            <button type='submit'>Gravar</button>
                        </React.Fragment>
                    )}
                </form>
            </div>
        </div>
        </React.Fragment>
    )
}

export default CadastroEstoquePage;