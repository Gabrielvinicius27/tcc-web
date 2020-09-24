import React from 'react';
import "./styles.css"
import SideBarMenu from '../../components/SideBarMenu';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import CadastroEstoquePage from '../MenuPages/CadastroEstoquePage';
import CadastroProdutosPage from '../MenuPages/CadastroProdutosPage';


const items = [
    { name: 'estoque', label: 'Estoque', 
      items:[
          {
            name:"cadastro-estoque", label:"Cadastro de Estoque", path:"/main/estoque", fatherIndex:0
          }
      ]},
    { name: 'produtos', label: 'Produtos', 
      items:[
          {
            name:"cadastro-produtos", label:"Cadastro de Produtos", path:"/main/produtos", fatherIndex:0
          },
          {
            name:"consulta-produtos", label:"Consulta de Produtos", path:"/main/consultaprod", fatherIndex:0
          }
      ]},
    { name: 'codes', label: 'Códigos',
      items:[
          {
              name:"gerar-qrcode", label:"Gerar QR Code", path:"/main/qrcode", fatherIndex:1
          }
      ]},
    { name: 'report', label: 'Relatórios' },
  ]

function MainPage(){
    return(
        <main>  
            <div>
                <h1>Estoque Inteligente</h1>
                <div id="main">
                <SideBarMenu data={items}/>
                    <main id="screen">
                    <BrowserRouter>
                      <Switch>
                          <Route path='/main/estoque' component={CadastroEstoquePage}/>
                          <Route path="/main/produtos" component={CadastroProdutosPage}/>
                      </Switch>      
                    </BrowserRouter>
                    </main>
                </div>
            </div>
        </main>
    )
}

export default MainPage;