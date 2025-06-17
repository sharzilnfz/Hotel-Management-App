import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchTarget: string;
    setSearchTarget: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTarget, setSearchTarget] = useState(''); // Indicates which page is being searched

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchTarget, setSearchTarget }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}; 