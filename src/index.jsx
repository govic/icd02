import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';

const APS_MODEL_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtY29kZXBlbi1tb2RlbHMvcnN0LWJhc2ljLXNhbXBsZS1wcm9qZWN0LnJ2dA';

const root = ReactDOM.createRoot(document.getElementById('root'));

const RootComponent = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/gettoken')
            .then(response => response.json())
            .then(data => {
                setToken(data.token);
            })
            .catch(error => {
                console.error('Error fetching token:', error);
            });
    }, []);

    if (!token || !APS_MODEL_URN) {
        return <div>Loading...</div>;
    } else {
        return <App token={token} urn={APS_MODEL_URN} />;
    }
};

root.render(<RootComponent />);
