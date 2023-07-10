import React from 'react';

import UsersList from '../components/UsersList';
const Users = () => {

  const USERS = [
    {
      id: 'u1',
      name: 'Inafs Developer',
      image: 'https://clipart-library.com/newhp/kissclipart-computer-geek-cartoon-clipart-geek-nerd-clip-art-d978f3a27174b0f9.png',
      places: 3
    }
  ];

  return <UsersList items={USERS}/>;
};

export default Users;
