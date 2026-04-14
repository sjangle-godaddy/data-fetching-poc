'use client';

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { isUpdating, hasError } from 'reduxful';
import usersApi from '@/redux/api/usersApi';
import UserCard from '@/components/UserCard';

function UserList({ users, isLoading, error, getUsers }) {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;
  if (error) return <p className="text-red-500">Error loading users.</p>;
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} basePath="/redux" />
      ))}
    </div>
  );
}

const mapStateToProps = (state) => {
  const response = usersApi.selectors.getUsers(state);
  return {
    users: response?.value ?? null,
    isLoading: isUpdating(response),
    error: hasError(response)
  };
};

const mapDispatchToProps = {
  getUsers: usersApi.actionCreators.getUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
