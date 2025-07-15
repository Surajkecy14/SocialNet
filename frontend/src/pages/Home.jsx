import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import axios from "axios";

const Home = () => {
  const { user, fetchUser, logout } = useUserStore();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [feeling, setFeeling] = useState("");
  const [posts, setPosts] = useState([]);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editFeeling, setEditFeeling] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    fetchUser();

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/all`, {
          withCredentials: true,
        });
        setPosts(res.data);
      } catch (err) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, [fetchUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePost = async () => {
    if (!caption && !imageUrl) {
      alert("Please write something or provide an image.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/create`,
        { imageUrl, caption, feeling },
        { withCredentials: true }
      );
      // Fetch posts again to get populated user info
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/all`, {
        withCredentials: true,
      });
      setPosts(res.data);
      setCaption("");
      setImageUrl("");
      setFeeling("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error creating post");
      }
    }
  };

  // Delete post
  const handleDelete = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/delete`,
        { id: post._id },
        { withCredentials: true }
      );
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (err) {
      alert("Error deleting post");
    }
  };

  // Open edit modal
  const openEditModal = (post) => {
    setEditPost(post);
    setEditCaption(post.caption);
    setEditFeeling(post.feeling || "");
    setEditImageUrl(post.imageUrl);
    setEditModalOpen(true);
  };

  // Edit post
  const handleEdit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/edit`,
        {
          id: editPost._id,
          caption: editCaption,
          feeling: editFeeling,
          imageUrl: editImageUrl,
        },
        { withCredentials: true }
      );
      setPosts(
        posts.map((p) =>
          p._id === editPost._id
            ? {
                ...p,
                caption: editCaption,
                feeling: editFeeling,
                imageUrl: editImageUrl,
              }
            : p
        )
      );
      setEditModalOpen(false);
      setEditPost(null);
    } catch (err) {
      alert("Error editing post");
    }
  };

  if (!user)
    return (
      <p className="text-white mt-20 text-center">
        Loading or not authorized...
      </p>
    );

  return (
    <div className="pt-18 min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-4 py-10">
      {/* Post Form Card */}
      <div className="max-w-2xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md mb-12">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-white/20 rounded-lg p-3 resize-none text-white placeholder-white/70 focus:outline-none"
              rows={3}
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full bg-white/20 rounded-lg p-2 text-white placeholder-white/60 focus:outline-none"
            />
            <div className="flex justify-between items-center">
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="bg-blue-600 text-pink-300 px-4 py-2 rounded-lg focus:outline-none"
              >
                <option value="">😶 Feeling</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="excited">🤩 Excited</option>
              </select>
              <button
                onClick={handlePost}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/90 p-6 rounded-xl shadow-lg min-w-[300px]">
            <h3 className="text-xl font-bold mb-4 text-black">Edit Post</h3>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Edit caption"
              className="w-full bg-gray-100 rounded-lg p-2 mb-2 text-black"
              rows={3}
            />
            <input
              type="text"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="Edit Image URL"
              className="w-full bg-gray-100 rounded-lg p-2 mb-2 text-black"
            />
            <select
              value={editFeeling}
              onChange={(e) => setEditFeeling(e.target.value)}
              className="w-full bg-gray-100 rounded-lg p-2 mb-4 text-black"
            >
              <option value="">😶 Feeling</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="excited">🤩 Excited</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <p className="text-white/70 text-center italic">
            📝 No posts yet. Start sharing something!
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id || post.id}
              className="bg-white/10 p-5 rounded-lg shadow-md backdrop-blur relative"
            >
              <div className="flex items-center mb-2 space-x-2">
                <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
                  {post.user?.username
                    ? post.user.username[0].toUpperCase()
                    : "?"}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {post.user?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-white/50">
                    {new Date(post.createdAt).toLocaleString()}
                    {post.feeling && ` • ${post.feeling}`}
                  </p>
                </div>
              </div>

              <p className="text-white/90 mb-3">{post.caption}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="rounded-lg object-contain w-full max-w-full"
                />
              )}

              {/* Edit/Delete Buttons - only for own posts */}
              {post.user?._id === user._id && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Add Like button here */}
              <div className="mt-2 flex items-center">
                <button className="bg-black hover:cursor-pointer text-white px-4 py-1 rounded-lg text-xs font-semibold">
                  ❤️ Like
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
