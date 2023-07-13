import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const userRoute = backend.userRoute;

const Users = () => {

  const getUserUrl = backendServerUrl + userRoute.baseUrl + userRoute.getUser.path;
  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();



  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(getUserUrl);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        
        setLoadedUsers(responseData.users);

      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();

  }, []);

  const errorHandler = () => {
    setError(null);
  };

  const USERS = [
    {
      id: 'u1',
      name: 'Inafs Developer',
      image: 'https://clipart-library.com/newhp/kissclipart-computer-geek-cartoon-clipart-geek-nerd-clip-art-d978f3a27174b0f9.png',
      places: 3
    }
  ];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && 
      <div className="center"> 
        <LoadingSpinner asOverlay />
      </div>}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>

  );
};

export default Users;
