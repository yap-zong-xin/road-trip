import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCities() {
            setIsLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data); // Set cities once fetched
            } catch {
                setError("There was an error loading the cities...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {
            if (Number(id) === currentCity.id) return;
            setIsLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                setCurrentCity(data);
            } catch {
                setError("There was an error getting the city...");
            } finally {
                setIsLoading(false);
            }
        },
        [currentCity.id]
    );

    async function createCity(newCity) {
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setCities((cities) => [...cities, data]); // Add the new city to the list
            setCurrentCity(data);
        } catch {
            setError("There was an error creating the city....");
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(id) {
        setIsLoading(true);
        try {
            await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
            setCities((cities) => cities.filter((city) => city.id !== id)); // Remove city by ID
            setCurrentCity({});
        } catch {
            alert("There was an error deleting the city...");
        } finally {
            setIsLoading(false);
        }
    }

    // New function to handle reordering cities
    const reorderCities = (reorderedCities) => {
        setCities(reorderedCities); // Directly update cities state
    };

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
                getCity,
                createCity,
                deleteCity,
                reorderCities, // Provide reorderCities in the context
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined)
        throw new Error("CitiesContext was used outside of CitiesProvider");
    return context;
}

export { CitiesProvider, useCities };
