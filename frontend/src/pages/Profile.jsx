import React, { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import axios from "axios";

const Profile = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/all`, {
          withCredentials: true,
        });
        // Filter posts by current user
        setPosts(res.data.filter((p) => p.user?._id === user._id));
      } catch {
        setPosts([]);
      }
    };
    if (user) fetchMyPosts();
  }, [user]);

  if (!user) return null;

  return (
    <div className="pt-18 min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md mb-12 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-white/70">Your Profile</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <p className="text-white/70 text-center italic">
            📝 You haven't posted anything yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/10 p-5 rounded-lg shadow-md backdrop-blur relative"
            >
              <div className="flex items-center mb-2 space-x-2">
                <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{user.username}</p>
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
                  className="rounded-lg max-h-80 object-cover w-full"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
