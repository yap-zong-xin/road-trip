import CityItem from "../CityItem";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const Column = ({ cities }) => {
    return (
        <div className="column">
            <SortableContext
                items={cities.map((city) => city.id)}
                strategy={verticalListSortingStrategy}
            >
                {cities.map((city) => (
                    <CityItem key={city.id} city={city} />
                ))}
            </SortableContext>
        </div>
    );
};

export default Column;
