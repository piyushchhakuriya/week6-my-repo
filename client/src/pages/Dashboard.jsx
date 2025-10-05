import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaHeart, FaPlus, FaInfoCircle, FaStar, FaBlog } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Date Created');
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || 'YOUR_JWT_TOKEN';

  useEffect(() => fetchDesigns(), []);

  const fetchDesigns = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/designs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDesigns(data);
        else if (data.designs && Array.isArray(data.designs)) setDesigns(data.designs);
        else setDesigns([]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const deleteDesign = (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;
    fetch(`http://localhost:5000/api/designs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete design');
        setDesigns(prev => prev.filter(design => design._id !== id));
      })
      .catch(err => alert('Failed to delete design: ' + err.message));
  };

  const sortedDesigns = [...designs].sort((a, b) => {
    if (sortBy === 'Title') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'Date Created' && a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const visibleDesigns = sortedDesigns.slice(0, 8);

  const handleAddNew = () => navigate('/editor');
  const openDesign = (id) => navigate(`/editor/${id}`);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, boxShadow: "0px 15px 30px rgba(255,255,255,0.3)" },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Floating animated blobs */}
      <motion.div className="absolute top-10 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl z-0"
        animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-20 right-20 w-60 h-60 bg-yellow-400 rounded-full opacity-20 blur-3xl z-0"
        animate={{ y: [0, -20, 0], x: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} />

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 z-10 relative">
        <motion.div className="text-5xl font-extrabold text-white cursor-pointer"
          style={{ fontFamily: '"Kablammo", system-ui' }}
          whileHover={{ scale: 1.15, color: "#facc15", textShadow: "0 0 20px #fcd34d" }}
          onClick={() => navigate('/')}>Matty</motion.div>

       <div className="flex gap-6 items-center">
  {/* About us */}
  <div 
        className="flex flex-col items-center text-gray-300 hover:text-yellow-400 cursor-pointer"
        onClick={() => navigate('/about')}
      >
        <FaInfoCircle size={20} />
        <span className="text-xs mt-1">About</span>
      </div>

  {/* Reviews */}
<Link to="/reviews" className="flex flex-col items-center text-gray-300 hover:text-yellow-400 cursor-pointer">
  <FaStar className="text-lg" />
  <span className="text-xs">Reviews</span>
</Link>

  {/* Our blog */}
  <div className="flex flex-col items-center cursor-pointer text-gray-300 hover:text-purple-400 transition">
    <FaBlog className="text-lg" />
    <span className="text-xs">Blog</span>
  </div>

  {/* Logout button stays same */}
  <motion.button className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-black hover:scale-105 hover:shadow-neon transition-transform"
    whileHover={{ scale: 1.05 }} onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
    Logout
  </motion.button>
</div>
      </header>

      {/* Banner */}
      <section className="relative mt-4 mx-8 rounded-xl h-80 flex items-center justify-center overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover brightness-90" autoPlay loop muted playsInline src="/bg.mp4" type="video/mp4" />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <motion.h1 className="relative z-10 text-5xl md:text-6xl font-bold text-white text-center"
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          Projects
        </motion.h1>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center my-8 mx-8">
        <h2 className="text-2xl font-semibold">Recent Designs</h2>
        <div className="flex gap-3 items-center">
          <label htmlFor="sort" className="text-gray-400 mr-1">Sort by:</label>
          <select id="sort" className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-200"
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="Date Created">Date Created</option>
            <option value="Title">Title</option>
          </select>
          <motion.button className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-black hover:scale-105 hover:shadow-neon transition-transform"
            whileHover={{ scale: 1.05 }} onClick={handleAddNew}>
            <FaPlus className="inline mr-2 animate-bounce" /> Add New
          </motion.button>
        </div>
      </div>

      {/* Design cards */}
      <div className="mx-8">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No designs found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visibleDesigns.map(design => (
              <motion.div key={design._id} className="bg-gray-800 rounded-3xl p-4 flex flex-col items-center cursor-pointer border border-transparent relative overflow-hidden group"
                variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">

                <div onClick={() => openDesign(design._id)} className="w-full relative">
                  {design.thumbnailUrl ? (
                    <img src={design.thumbnailUrl} alt="Thumbnail"
                      className="w-full h-64 object-contain rounded-2xl mb-5 bg-gray-700" />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center mb-2 rounded text-gray-400 text-sm">
                      No thumbnail
                    </div>
                  )}
                  {/* Hover icons */}
                  <motion.div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 rounded-2xl transition"
                    initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                    <FaEdit className="text-white text-xl cursor-pointer hover:text-yellow-400" onClick={() => openDesign(design._id)} />
                    <FaTrash className="text-red-500 text-xl cursor-pointer hover:text-red-400" onClick={(e) => { e.stopPropagation(); deleteDesign(design._id); }} />
                    <FaHeart className="text-pink-500 text-xl cursor-pointer hover:text-pink-400" />
                  </motion.div>
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    New
                  </span>
                </div>
                <div className="w-full font-semibold text-center text-lg truncate text-white">{design.title || 'Untitled Design'}</div>
              </motion.div>
            ))}
          </div>
        )}

        {designs.length > visibleDesigns.length && (
          <div className="flex justify-center mt-8">
            <motion.button className="px-6 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-500 transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}>
              See more
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
