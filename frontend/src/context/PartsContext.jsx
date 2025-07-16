import React, { createContext, useState, useContext, useEffect } from 'react';

const PartsContext = createContext();


export const PartsProvider = ({ children }) => {
    const [parts, setParts] = useState([]);

    useEffect(() => {
        const storedParts = localStorage.getItem('parts');
        if (storedParts) {
            setParts(JSON.parse(storedParts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('parts', JSON.stringify(parts));
    }, [parts]);
    
    return (
        <PartsContext.Provider value={{ parts, setParts }}>
            {children}
        </PartsContext.Provider>
    );
};

export const useParts = () => useContext(PartsContext);