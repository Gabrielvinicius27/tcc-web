import React, { useEffect } from 'react'
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import "./styles.css"

interface itemProps{
    texto?:string;
}

const LoadingIndicator: React.FC<itemProps> = ({texto,...rest}) => {

    
    const {promiseInProgress} = usePromiseTracker();
    useEffect(()=>{
        if(promiseInProgress===true){
            console.log('In progress')
        }
        else{
            console.log('Not in progress')
        }
    },[promiseInProgress])
  
      
    function enableScroll() { 
        window.onscroll = function() {}; 
    } 
    return (
        <div>
            {(promiseInProgress === true) ? (
            <div id='divLoading'>
                <div className="loadingIndicator">
                    <Loader type="ThreeDots" color="#1089ff" height={100} width={100}/>
                    <label id='labelLoadingIndicator'>{texto}</label>
                </div>
            </div>) : (null)}
        </div>
    ); 
}

export default LoadingIndicator