// Rotas de navegação da aplicação
import React from 'react';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import {isAuthenticated} from "./services/auth";
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AppPage from './pages/AppPage';

interface IProps{
    path:string
    component:any
}
// Rota privada que só poderá ser acessado caso o usuário estiver autenticado
const PrivateRoute:React.FC<IProps> = ({component:Component,...rest}) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component{...props}/>
            ):(
                <Redirect to={{pathname:"/",state:{from:props.location}}}/>
            )
        }
    />
)
// Rotas
const Routes = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={LoginPage}/>
                <PrivateRoute path="/main" component={MainPage}/>
                <Route path='/app' component={AppPage}/>
                <Route path="*" component={()=><h1>Page not Found</h1>}/>
            </Switch>      
        </BrowserRouter>
    )
}

export default Routes;