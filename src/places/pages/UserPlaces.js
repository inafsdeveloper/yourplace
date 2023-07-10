import React from "react";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = require('../../shared/data/places.json'); 
const UserPlaces = props => {

    return <PlaceList items={DUMMY_PLACES} />
}

export default UserPlaces;