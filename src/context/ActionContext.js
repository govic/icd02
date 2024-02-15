import React, { createContext, useContext, useState } from 'react';

export const ActionsContext = createContext();

export const useActions = () => useContext(ActionsContext);

export const ActionsProvider = ({ children, viewerRef }) => {
    const [actions, setActions] = useState({});
    const [identificadoresActuales, setIdentificadoresActuales] = useState([]);

    const registerAction = (actionName, actionFunction) => {
        setActions((prevActions) => ({ ...prevActions, [actionName]: actionFunction }));
    };

    const updateIdentificadoresActuales = (nuevosIdentificadores) => {
        setIdentificadoresActuales(nuevosIdentificadores);
    };



    return (
        <ActionsContext.Provider value={{ ...actions, registerAction, identificadoresActuales, updateIdentificadoresActuales }}>
            {children}
        </ActionsContext.Provider>
    );
};
