import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const placeRoute = backend.placeRoute;

const UserPlaces = props => {

    const USER_ID = useParams().userId;
    const placeByUserIdUrl = backendServerUrl + 
                            placeRoute.baseUrl + 
                            placeRoute.getPlaceByUserId.path + 
                            USER_ID;

    
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();

    useEffect(() => {
        const fetchPlacesForUser = async () => {
          try {
            const responseData = await sendRequest(placeByUserIdUrl);
            setLoadedPlaces(responseData.places);
          } catch (err) {
            console.log("error");
          }
        };
        
        fetchPlacesForUser();
    
      }, [sendRequest]);

    const placeDeletedHandler = deletedPlaceId => {
      setLoadedPlaces(prevPlaces => 
        prevPlaces.filter(place => place.id !== deletedPlaceId ));
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading &&
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>}
            {!isLoading && loadedPlaces && 
            <PlaceList items={loadedPlaces} onPlaceDelete={placeDeletedHandler}/>}
        </React.Fragment>
    );
}

export default UserPlaces;