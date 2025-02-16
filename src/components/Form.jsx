import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";
import useUrlPosition from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// Geocoding API: Used to convert addresses to lat & lng.
const GEO_URL = "https://api.mapbox.com/search/geocode/v6/forward";
// Reverse Geocoding API: Used to convert coordinates (lat, lng) into a city name and country.
const REVERSE_GEO_URL =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";
const VITE_ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

function Form() {
    // const [lat, lng] = useUrlPosition();
    const { createCity, isLoading } = useCities();
    const { setSearchedLocation } = useSearch();
    const navigate = useNavigate();

    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [emoji, setEmoji] = useState("");
    const [geocodingError, setGeocodingError] = useState("");

    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    // useEffect(
    //     function () {
    //         if (!lat && !lng) return;

    //         async function fetchCityData() {
    //             try {
    //                 setIsLoadingGeocoding(true);
    //                 setGeocodingError("");
    //                 const res = await fetch(
    //                     `${REVERSE_GEO_URL}?latitude=${lat}&longitude=${lng}`
    //                 );
    //                 const data = await res.json();
    //                 // console.log(data);
    //                 if (!data.countryCode)
    //                     throw new Error("Click somewhere else");
    //                 setCityName(data.city || data.locality || "");
    //                 setCountry(data.countryName);
    //                 setEmoji(convertToEmoji(data.countryCode));
    //             } catch (err) {
    //                 setGeocodingError(err.message);
    //             } finally {
    //                 setIsLoadingGeocoding(false);
    //             }
    //         }
    //         fetchCityData();
    //     },
    //     [lat, lng]
    // );

    async function handleAddress(e) {
        e.preventDefault();

        if (!address) return;

        const res = await fetch(
            `${GEO_URL}?q=${address}&access_token=${VITE_ACCESS_TOKEN}`
        );
        const data = await res.json();

        console.log(data);

        const feature = data.features.at(0)?.properties;
        if (!feature) return;
        const { coordinates, context } = feature;

        const country = context?.country?.name || context?.place?.name || "";
        const cityName = context?.locality?.name || context?.place?.name || "";
        const lat = coordinates?.latitude || 0;
        const lng = coordinates?.longitude || 0;

        setCountry(country);
        setCityName(cityName);
        setLat(lat);
        setLng(lng);
        setSearchedLocation({ lat, lng });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!cityName || !date) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: { lat, lng },
        };
        await createCity(newCity);
        navigate("/app/cities");
    }

    if (isLoadingGeocoding) return <Spinner />;
    if (geocodingError) return <Message message={geocodingError} />;
    // if (!lat && !lng)
    //     return <Message message="Start by clicking somewhere on the map" />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ""}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.row}>
                <label htmlFor="address">Address</label>
                <input
                    id="address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                />
                <Button type="primary" onClick={handleAddress}>
                    Search
                </Button>
            </div>

            {/* <div className={styles.row}>
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}
                />
            </div> */}

            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="emoji">Type (emoji)</label>
                <input
                    id="emoji"
                    onChange={(e) => setEmoji(e.target.value)}
                    value={emoji}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                {/* <input
                    id="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                /> */}
                <DatePicker
                    id="date"
                    onChange={(date) => setDate(date)}
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            {/* <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div> */}

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton />
            </div>
        </form>
    );
}

export default Form;
