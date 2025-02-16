import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useSearch } from "../contexts/SearchContext";

function BackButton() {
    const { setSearchedLocation } = useSearch();
    const navigate = useNavigate();

    return (
        <Button
            type="back"
            onClick={(e) => {
                e.preventDefault();
                setSearchedLocation(null);
                navigate(-1);
            }}
        >
            &larr; Back
        </Button>
    );
}

export default BackButton;
