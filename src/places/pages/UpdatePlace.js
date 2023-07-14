import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook';
import Card from "../../shared/components/UIElements/Card";
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css';

const DUMMY_PLACES = require('../../shared/data/places.json');

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const placeRoute = backend.placeRoute;

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const history = useHistory();

  const [loadedPlace, setLoadedPlace] = useState();

  const placeByIdUrl = backendServerUrl +
    placeRoute.baseUrl +
    placeRoute.getPlaceById.path +
    placeId;

  const updateplaceByIdUrl = backendServerUrl +
    placeRoute.baseUrl +
    placeRoute.updatePlace.path +
    placeId;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();


  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );


  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(placeByIdUrl);
        setLoadedPlace(responseData.place);
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
        }, true);

      } catch (err) {
        console.log(err);
      }

    };
    fetchPlace();

  }, [sendRequest, placeId, setFormData]);


  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(updateplaceByIdUrl, placeRoute.updatePlace.method,
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-type': 'application/json'
        }
      );
      console.log(auth);
      history.push('/' + auth.userid + "/places");
    } catch (err) {
      console.log(err);
    }

  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const updateCancelHandler = () => {
    history.push('/' + auth.userid + "/places");
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading &&
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>}
      {!isLoading && loadedPlace &&
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <div className="center">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE PLACE
            </Button>
            <Button type="button" onClick={updateCancelHandler}>
              CANCEL
            </Button>
          </div>
        </form>
      }
    </React.Fragment>
  );
};

export default UpdatePlace;