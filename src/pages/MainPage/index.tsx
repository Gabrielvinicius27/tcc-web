import React from 'react';
import "./styles.css"
import SideBarMenu from '../../components/SideBarMenu';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import CadastroEstoquePage from '../MenuPages/Cadastros/CadastroEstoquePage';
import CadastroProdutosPage from '../MenuPages/Cadastros/CadastroProdutosPage';
import GerarQrCodePage from '../MenuPages/Codigos/GerarQrCodePage';
import EntradaDeEstoque from '../MenuPages/MovimentacoesDeMercadoria/Entrada_de_estoque';
import backgroundImg from "../../assets/images/icons/backgroundPattern.png"
import EstoqueParaGondola from '../MenuPages/MovimentacoesDeMercadoria/Estoque_para_gondola';
import GondolaVenda from '../MenuPages/MovimentacoesDeMercadoria/Gondola_para_venda';
import ConsultaProduto from '../MenuPages/Consultas/Consulta_Produtos';
import Test from '../../components/TableauComponent'

const items = [
    { name: 'dashboard', label: 'Dashboards', 
    items:[
        {
          name:"dashboard-tableau", label:"Relatório principal", path:"/main/", fatherIndex:0
        },
    ]},
    { name: 'movimentacao', label: 'Movimentação de Mercadorias', 
      items:[
          {
            name:"entrada-estoque", label:"Entrada Estoque", path:"/main/entradaEstoque", fatherIndex:0
          },
          {
            name:"estoque-gondola", label:"Colocar Produtos em Exposição", path:"/main/estoqueGondola", fatherIndex:0
          },
          {
            name:"gondola-venda", label:"Vender Produto", path:"/main/gondolaVenda", fatherIndex:0
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
            name:"consulta-produtos", label:"Consulta de Produtos", path:"/main/consultaProduto", fatherIndex:0
          },
      ]},
  
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
                <Route path="/main" exact component={Test}/>
                <Route path="/main/entradaEstoque" component={EntradaDeEstoque}/>
                <Route path="/main/estoqueGondola" component={EstoqueParaGondola}/>
                <Route path="/main/gondolaVenda" component={GondolaVenda}/>
                <Route path="/main/produtos" component={CadastroProdutosPage}/>
                <Route path="/main/estoque" component={CadastroEstoquePage}/>
                <Route path="/main/gerarqrcode" component={GerarQrCodePage}/>
                <Route path="/main/consultaProduto" component={ConsultaProduto}></Route>
            </Switch>      
            </BrowserRouter>
          </div>
        </div>
    )
}

export default MainPage;