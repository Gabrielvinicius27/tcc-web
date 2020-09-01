import React from 'react';
import "./styles.css"
import SideBarMenu from '../../components/SideBarMenu';

const items = [
    { name: 'produtos', label: 'Produtos', 
      items:[
          {
            name:"cadastro-produtos", label:"Cadastro de Produtos", fatherIndex:0
          },
          {
            name:"consulta-produtos", label:"Consulta de Produtos", fatherIndex:0
          }
      ]},
    { name: 'codes', label: 'Códigos',
      items:[
          {
              name:"gerar-qrcode", label:"Gerar QR Code", fatherIndex:1
          }
      ]},
    { name: 'report', label: 'Relatórios' },
  ]

function MainPage(){
    return(
        <main>  
            <div>
                <h1>Header</h1>
                <div id="main">
                <SideBarMenu data={items}/>
                    <main id="screen">
                        <p>Conteúdo</p>
                    </main>
                </div>
            </div>
        </main>
    )
}

export default MainPage;