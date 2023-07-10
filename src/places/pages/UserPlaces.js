import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = require('../../shared/data/places.json'); 
const UserPlaces = props => {

    const USER_ID = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === USER_ID);
    return <PlaceList items={loadedPlaces} />
}

export default UserPlaces;