////////////////////////////////////////////////////
/*
    Pagina de Login
*/
////////////////////////////////////////////////////

// Bibliotecas utilizadas nessa página
import React, {FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
// Imagem de fundo (Supermercado)
import backgroundImg from "../../assets/images/fundo-login.png"
// Estilização da página
import "./styles.css";
// Services - programas com funções que irão no ajudar
import api from '../../services/api';
import { login } from '../../services/auth';
import LoadingIndicator from '../../components/LoadingIndicator';
import { trackPromise } from 'react-promise-tracker';

// Função Pagina de Login
function LoginPage (){
    // Variáveis utilizadas nessa função, useState irá dar a possibilidade de alterar o valor das mesmas
    // durante o funcionamento da página.
    const[email, setEmail]= useState("");
    const[password, setPassword]= useState("");
    const[error, setError]= useState("");
    // Variável utilizada para redirecionamento da página
    const history = useHistory();
    
    // Função para controlar o login, acionada no click do botão Entrar
    const handleLogin = async (e:FormEvent) => {
        // Irá previnir a pagina de atualizar quando entrar nessa função
        e.preventDefault();
        // Verifica se e-mail e senha foram preenchidos
        if(!email || !password){
            setError("Preencha e-mail e senha para entrar!" );
        }
        else{
            setError("");
            // Chamada da API para conseguir o token de acesso
            
            try{
                // Se usuário e senha coincidirem com usuário e senha cadastrados então 
                // response.data.token irá conter o token de acesso, caso contrario algum erro acontece
                const response = await trackPromise(api.post("/sessions", {email,password}));
                login(response.data.token);
                history.push("/main");
            }catch(err){
                // Em caso de erro informar para o usuário conferir suas credenciais
                setError("E-mail ou senha incorretos!");
                }
            }
        }
    // Retorna estrutura da pagina
    return(
        <main id = "main-login-page">
            <img src={backgroundImg} alt="Supermercado"/>
            <div id = "fake-form-background"></div>
            <form onSubmit={handleLogin} id = "form-login-page">
                <LoadingIndicator/>
                <div id='img-logo'/>
                {error && <p>{error}</p>}
                <input type="email"
                    placeholder="Digite o e-mail"
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <input type="password"
                    placeholder="Digite a senha"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button type = 'submit'>Entrar</button>
            </form>
        </main>
    )
}

export default LoginPage;