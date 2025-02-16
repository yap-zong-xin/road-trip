// import { Link } from "react-router-dom";
// import styles from "./CityItem.module.css";
// import { useCities } from "../contexts/CitiesContext";

// const formatDate = (date) =>
//     new Intl.DateTimeFormat("en", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//     }).format(new Date(date));

// function CityItem({ city }) {
//     const { currentCity, deleteCity } = useCities();

//     const {
//         cityName,
//         country,
//         emoji,
//         date,
//         notes,
//         position: { lat, lng },
//         id,
//     } = city;

//     function handleClick(e) {
//         e.preventDefault();
//         deleteCity(id);
//     }

//     return (
//         <li>
//             <Link
//                 className={`${styles.cityItem} ${
//                     id === currentCity.id ? styles["cityItem--active"] : ""
//                 }`}
//                 to={`${id}?lat=${lat}&lng=${lng}`}
//             >
//                 <span className={styles.empji}>{emoji}</span>
//                 <h3 className={styles.name}>{cityName}</h3>
//                 <time className={styles.date}>{formatDate(date)}</time>
//                 <button className={styles.deleteBtn} onClick={handleClick}>
//                     &times;
//                 </button>
//             </Link>
//         </li>
//     );
// }

// export default CityItem;

import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));

const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
        .map((char) => String.fromCharCode(char - 127397).toLowerCase())
        .join("");
    return (
        <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
};

function CityItem({ city }) {
    const { currentCity, deleteCity } = useCities();
    const {
        cityName,
        emoji,
        date,
        id,
        position: { lat, lng },
    } = city;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    function handleClick(e) {
        e.preventDefault();
        deleteCity(id);
    }

    return (
        <li>
            <div
                to={`${id}?lat=${lat}&lng=${lng}`}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={style}
            >
                {isDragging ? (
                    <div
                        className={`${styles.cityItem} ${
                            id === currentCity.id
                                ? styles["cityItem--active"]
                                : ""
                        }`}
                    >
                        <span className={styles.emoji}>{emoji}</span>
                        <span className={styles.name}>{cityName}</span>
                        <time className={styles.date}>
                            ({formatDate(date)})
                        </time>
                        <button
                            className={styles.deleteBtn}
                            onClick={handleClick}
                        >
                            &times;
                        </button>
                    </div>
                ) : (
                    <Link
                        className={`${styles.cityItem} ${
                            id === currentCity.id
                                ? styles["cityItem--active"]
                                : ""
                        }`}
                        to={`${id}?lat=${lat}&lng=${lng}`}
                    >
                        <span className={styles.empji}>{emoji}</span>
                        <h3 className={styles.name}>{cityName}</h3>
                        <time className={styles.date}>{formatDate(date)}</time>
                        <button
                            className={styles.deleteBtn}
                            onClick={handleClick}
                        >
                            &times;
                        </button>
                    </Link>
                )}
            </div>
        </li>
    );
}

export default CityItem;
