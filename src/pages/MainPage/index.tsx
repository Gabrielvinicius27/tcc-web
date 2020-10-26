import React from 'react';
import "./styles.css"
import SideBarMenu from '../../components/SideBarMenu';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import CadastroEstoquePage from '../MenuPages/Cadastros/CadastroEstoquePage';
import CadastroProdutosPage from '../MenuPages/Cadastros/CadastroProdutosPage';
import GerarQrCodePage from '../MenuPages/Codigos/GerarQrCodePage';
import EntradaDeEstoque from '../MenuPages/MovimentacoesDeMercadoria/Entrada_de_estoque';
import backgroundImg from "../../assets/images/icons/backgroundPattern.png"


const items = [
    { name: 'movimentacao', label: 'Movimentação de Mercadorias', 
      items:[
          {
            name:"entrada-estoque", label:"Entrada Estoque", path:"/main/entradaEstoque", fatherIndex:0
          },
      ]},
    { name: 'cadastros', label: 'Cadastros', 
      items:[
          {
            name:"cadastro-produtos", label:"Cadastro de Produtos", path:"/main/produtos", fatherIndex:0
          },
          {
            name:"cadastro-estoque", label:"Cadastro de Estoque", path:"/main/estoque", fatherIndex:0
          }
      ]},
    { name: 'consultas', label: 'Consultas', 
      items:[
          {
            name:"consulta-produtos", label:"Consulta de Produtos", path:"/main/consultaprod", fatherIndex:0
          },
      ]},
    { name: 'codigos', label: 'Códigos',
      items:[
          {
              name:"gerar-qrcode", label:"Gerar QR Code", path:"/main/gerarqrcode", fatherIndex:1
          }
      ]},
    { name: 'relatorios', label: 'Relatórios' },
  ]

function MainPage(){
    return(
        <div className="main">  
          
          <h1>Estoque Inteligente</h1>
          <div className="divSidebar">
            <SideBarMenu data={items}/>
          </div>
          <div className="divScreens">
            <BrowserRouter>
            <Switch>
                <Route path="/main/entradaEstoque" component={EntradaDeEstoque}/>
                <Route path="/main/produtos" component={CadastroProdutosPage}/>
                <Route path="/main/gerarqrcode" component={GerarQrCodePage}/>
            </Switch>      
            </BrowserRouter>
          </div>
        </div>
    )
}

export default MainPage;