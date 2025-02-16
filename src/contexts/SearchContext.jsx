import { createContext, useState, useContext } from "react";

const SearchContext = createContext();

function SearchProvider({ children }) {
    const [searchedLocation, setSearchedLocation] = useState(null);

    return (
        <SearchContext.Provider
            value={{ searchedLocation, setSearchedLocation }}
        >
            {children}
        </SearchContext.Provider>
    );
}

function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined)
        throw new Error("SearchContext was used outside of the SearchProvider");
    return context;
}

export { SearchProvider, useSearch };
