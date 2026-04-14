'use client';

import { useState } from 'react';
import { connect } from 'react-redux';
import { isUpdating } from 'reduxful';
import postsApi from '@/redux/api/postsApi';

function CreatePostForm({ userId, createPost, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await createPost({}, {
        body: JSON.stringify({ title, body, userId })
      });
      setTitle('');
      setBody('');
      setSuccess(true);
    } catch {
      // error handled by reduxful state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-lg font-semibold">Create New Post (Redux)</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Create Post'}
      </button>
      {success && <p className="mt-2 text-sm text-green-600">Post created!</p>}
    </form>
  );
}

const mapStateToProps = (state) => {
  const response = postsApi.selectors.createPost(state);
  return {
    isSubmitting: isUpdating(response)
  };
};

const mapDispatchToProps = {
  createPost: postsApi.actionCreators.createPost
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm);
