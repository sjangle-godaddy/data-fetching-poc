'use client';

import { useEffect } from 'react';
import { connect } from 'react-redux';
import { isUpdating, hasError } from 'reduxful';
import usersApi from '@/redux/api/usersApi';
import PostCard from '@/components/PostCard';

function UserDetail({ userId, user, posts, userLoading, postsLoading, userError, postsError, getUser, getUserPosts }) {
  useEffect(() => {
    getUser({ userId });
    getUserPosts({ userId });
  }, [userId, getUser, getUserPosts]);

  if (userLoading) {
    return <p className="text-gray-500">Loading user...</p>;
  }

  if (userError) {
    return <p className="text-red-500">Error loading user.</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500">@{user.username}</p>
        <div className="mt-3 space-y-1 text-sm">
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
          <p>Company: {user.company?.name}</p>
          <p>
            Address: {user.address?.street}, {user.address?.city}
          </p>
        </div>
      </div>

      <h3 className="mb-4 text-xl font-semibold">Posts</h3>
      {postsLoading && <p className="text-gray-500">Loading posts...</p>}
      {postsError && <p className="text-red-500">Error loading posts.</p>}
      {Array.isArray(posts) && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { userId } = ownProps;
  const userResponse = usersApi.selectors.getUser(state, { userId });
  const postsResponse = usersApi.selectors.getUserPosts(state, { userId });

  return {
    user: userResponse?.value ?? null,
    posts: postsResponse?.value ?? null,
    userLoading: isUpdating(userResponse),
    postsLoading: isUpdating(postsResponse),
    userError: hasError(userResponse),
    postsError: hasError(postsResponse)
  };
};

const mapDispatchToProps = {
  getUser: usersApi.actionCreators.getUser,
  getUserPosts: usersApi.actionCreators.getUserPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
