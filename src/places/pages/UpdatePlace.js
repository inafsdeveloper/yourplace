import React from "react";
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'


const DUMMY_PLACES = require('../../shared/data/places.json');
const UpdatePlace = props => {
    const placeId = useParams().placeId;

    const identifiedPlace = DUMMY_PLACES.find(place => place.id === placeId);

    if (!identifiedPlace) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        );
    }
    
    return (
        <form>
            <Input
                id="title"
                element="Input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={() => { }}
                value={identifiedPlace.title}
                valid={true}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters)."
                onInput={() => {}}
                value={identifiedPlace.description}
                valid={true}
            />
            <Button type="submit" disabled={true}>UPDATE PLACE</Button>
        </form>
    );
}

export default UpdatePlace;