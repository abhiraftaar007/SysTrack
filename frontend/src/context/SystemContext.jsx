import React, { createContext, useState, useContext, useEffect } from 'react';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
    const [systems, setSystems] = useState([]);

    useEffect(() => {
        const storedSystems = localStorage.getItem('systems');
        if (storedSystems) {
            setSystems(JSON.parse(storedSystems));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('systems', JSON.stringify(systems));
    }, [systems]);

    return (
        <SystemContext.Provider value={{ systems, setSystems }}>
            {children}
        </SystemContext.Provider>
    );
};
export const useSystems = () => useContext(SystemContext);