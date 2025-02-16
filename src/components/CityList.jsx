import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import {
    closestCorners,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./Column/Column";

function CityList() {
    const navigate = useNavigate();

    const { cities, isLoading, reorderCities } = useCities();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    if (isLoading) return <Spinner />;

    if (!cities.length)
        return (
            <>
                <Message message="Add your first city!" />

                <Button type="location" onClick={() => navigate("/app/form")}>
                    Add location
                </Button>
            </>
        );

    // Helper function to find the index of the city
    const getCityPos = (id) => cities.findIndex((city) => city.id === id);

    // Handle the drag-end event to reorder cities
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return; // No change if the item is dropped in the same place

        // Reorder the cities based on drag result
        reorderCities((prevCities) => {
            const originalPos = getCityPos(active.id);
            const newPos = getCityPos(over.id);

            return arrayMove(prevCities, originalPos, newPos); // Move city to new position
        });
    };

    return (
        <>
            <ul className={styles.cityList}>
                {/* {cities.map((city) => (
                    <CityItem city={city} key={city.id} />
                ))} */}
                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                >
                    <Column cities={cities} />
                </DndContext>

                <Button type="location" onClick={() => navigate("/app/form")}>
                    Add location
                </Button>
            </ul>
        </>
    );
}

export default CityList;

// import React from "react";
// import {
//     closestCorners,
//     DndContext,
//     PointerSensor,
//     useSensor,
//     useSensors,
// } from "@dnd-kit/core";
// import {
//     SortableContext,
//     verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import CityItem from "./CityItem";
// import styles from "./CityList.module.css";
// import Spinner from "./Spinner";
// import Message from "./Message";
// import { useCities } from "../contexts/CitiesContext";
// import { arrayMove } from "@dnd-kit/sortable";
// import Column from "./Column/Column";

// function CityList() {
//     const { cities, isLoading, reorderCities } = useCities();

//     // Always call hooks in the same order
//     const sensors = useSensors(
//         useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
//     );

//     if (isLoading) return <Spinner />;
//     if (!cities.length) return <Message message="Add your first city!" />;

//     // Helper function to find the index of the city
//     const getCityPos = (id) => cities.findIndex((city) => city.id === id);

//     // Handle the drag-end event to reorder cities
//     const handleDragEnd = (event) => {
//         const { active, over } = event;

//         if (active.id === over.id) return; // No change if the item is dropped in the same place

//         // Reorder the cities based on drag result
//         reorderCities((cities) => {
//             const originalPos = getCityPos(active.id);
//             const newPos = getCityPos(over.id);

//             return arrayMove(cities, originalPos, newPos); // Move city to new position
//         });
//     };

//     return (
//         <ul className={styles.cityList}>
//             {/* {cities.map((city) => (
//                 <CityItem city={city} key={city.id} />
//             ))} */}
//             <DndContext
//                 sensors={sensors}
//                 onDragEnd={handleDragEnd}
//                 collisionDetection={closestCorners}
//             >
//                 <Column cities={cities} />
//             </DndContext>
//         </ul>
//     );
// }

// export default CityList;
