import { useMap } from "react-leaflet";
import styles from "./Button.module.css";
import L from "leaflet";

function CenterMapButton({ cities, children, type }) {
    const map = useMap(); // Get map instance

    function centerMap() {
        if (!map || cities.length === 0) return;

        const cityLatLngs = cities.map((city) =>
            L.latLng(city.position.lat, city.position.lng)
        );

        const bounds = L.latLngBounds(cityLatLngs);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    return (
        <button onClick={centerMap} className={`${styles.btn} ${styles[type]}`}>
            {children}
        </button>
    );
}

export default CenterMapButton;
