import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import "./styles.css"


const LoadingIndicator: React.FC = () => {

    const {promiseInProgress} = usePromiseTracker();
    return (
        <div>
            {(promiseInProgress === true) ? (
            <div className="loadingIndicator">
                <Loader type="ThreeDots" color="#1E1E2C" height={100} width={100}/>
            </div>) : (null)}
        </div>
    ); 
}

export default LoadingIndicator