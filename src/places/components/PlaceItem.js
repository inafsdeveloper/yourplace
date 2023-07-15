import React, { useContext, useState, useHistory } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './PlaceItem.css';

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const placeRoute = backend.placeRoute;

const PlaceItem = props => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    console.log('DELETING...');
    const deleteByPlaceIdUrl = backendServerUrl +
      placeRoute.baseUrl +
      placeRoute.deletePlace.path +
      props.id;

    try {
      await sendRequest(
        deleteByPlaceIdUrl,
        placeRoute.deletePlace.method,
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading &&
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }>
        <p>
          Do you want to proceed and delete this place?
          Please note that it can't be undone thereafter.
        </p>
      </Modal>
      {!isLoading &&
        <li className="place-item">
          <Card className="place-item__content">
            <div className="place-item__image">
              <img src={`${backendServerUrl}/${props.image}`} alt={props.title} />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
              {(auth.userid === props.creatorId) && <Button to={`/places/${props.id}`}>EDIT</Button>}
              {(auth.userid === props.creatorId) && <Button danger onClick={showDeleteHandler}>DELETE</Button>}
            </div>
          </Card>
        </li>
      }
    </React.Fragment>
  );
};

export default PlaceItem;
