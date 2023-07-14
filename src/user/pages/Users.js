import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const userRoute = backend.userRoute;

const Users = () => {

  const getUserUrl = backendServerUrl + userRoute.baseUrl + userRoute.getUser.path;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(getUserUrl);
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log("error");
      }
    };
    
    fetchUsers();

  }, [sendRequest]);


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && 
      <div className="center"> 
        <LoadingSpinner asOverlay />
      </div>}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>

  );
};

export default Users;
