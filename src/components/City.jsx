import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

function City() {
    const { id } = useParams();
    const { getCity, currentCity, isLoading } = useCities();
    // const [searchParams, setSearchParams] = useSearchParams();
    // const lat = searchParams.get("lat");
    // const lng = searchParams.get("lng");

    // TEMP DATA
    // const currentCity = {
    //     cityName: "Lisbon",
    //     emoji: "🇵🇹",
    //     date: "2027-10-31T15:59:59.138Z",
    //     notes: "My favorite city so far!",
    // };

    useEffect(
        function () {
            getCity(id);
        },
        [id]
    );

    const { cityName, emoji, date, notes } = currentCity;

    if (isLoading) return <Spinner />;

    // return (
    //     <>
    //         <h1>City {id}</h1>
    //         <p>
    //             Position: {lat}, {lng}
    //         </p>
    //     </>
    // );

    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>Type</h6>
                <h3>{emoji}</h3>
            </div>

            <div className={styles.row}>
                <h6>City name</h6>
                <h3>{cityName}</h3>
            </div>

            <div className={styles.row}>
                <h6>Destination date</h6>
                <p>{formatDate(date || null)}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>{notes}</p>
                </div>
            )}

            <div>
                <BackButton />
            </div>
        </div>
    );
}

export default City;
