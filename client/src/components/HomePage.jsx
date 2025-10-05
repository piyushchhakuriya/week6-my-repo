import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa"; // react-icons

const HomePage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      color: "#facc15",
      textShadow: "0 0 15px #fcd34d, 0 0 30px #fbbf24",
      boxShadow: "0 0 20px #fcd34d, 0 0 40px #fbbf24",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const floatingVariants = (delay, xOffset = 0, yOffset = 0) => ({
    animate: {
      y: [0 + yOffset, -25 + yOffset, 0 + yOffset],
      x: [0 + xOffset, 25 + xOffset, 0 + xOffset],
      transition: { duration: 8, repeat: Infinity, delay, ease: "easeInOut" },
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-70"
        src="hd.mp4"
        type="video/mp4"
      />

      {/* Floating 3D Blobs */}
      <motion.div
        className="absolute top-16 left-10 w-44 h-44 bg-yellow-400 rounded-full opacity-40 blur-3xl z-5"
        variants={floatingVariants(0)}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 right-16 w-64 h-64 bg-pink-500 rounded-full opacity-25 blur-3xl z-5"
        variants={floatingVariants(2)}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-12 left-1/3 w-40 h-40 bg-purple-500 rounded-full opacity-30 blur-3xl z-5"
        variants={floatingVariants(4)}
        animate="animate"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Header */}
      <motion.header
        className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-4xl md:text-5xl font-extrabold text-white cursor-pointer tracking-wider"
          style={{ fontFamily: '"Kablammo", system-ui', textShadow: "0 0 8px #facc15" }}
          whileHover={{ scale: 1.15, color: "#facc15", textShadow: "0 0 20px #fcd34d" }}
        >
          Matty
        </motion.div>

        <nav className="flex items-center gap-6 md:gap-10 text-white font-medium text-sm md:text-base">
          <motion.div whileHover={{ scale: 1.1, color: "#fcd34d" }}>
            <Link to="/about">About Us 🚀</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, color: "#fcd34d" }}>
            <a href="#">Our Blog 📖</a>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, color: "#fcd34d" }}>
            <a href="#">Contact Us ✉️</a>
          </motion.div>
          <motion.div whileHover={buttonVariants.hover} whileTap={buttonVariants.tap}>
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 md:px-7 py-2 md:py-3 rounded-full border border-white text-white font-semibold transition-all duration-300"
            >
              Login <FaArrowRight className="inline-block animate-bounce" />
            </Link>
          </motion.div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-20 flex flex-col items-center justify-center flex-1 text-center px-6 md:px-0">
        <motion.div className="space-y-6 md:space-y-8" variants={textVariants} initial="hidden" animate="visible">
          <motion.h1 className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 leading-tight">
            Think, plan, and create
          </motion.h1>
          <motion.h2 className="text-2xl md:text-4xl text-yellow-400 font-semibold tracking-wide">
            All in one place ✨
          </motion.h2>
          <motion.p className="text-base md:text-lg text-gray-200 max-w-xl mx-auto">
            Efficiently design, organize, and save your creative work with Matty. Everything you need to unleash your creativity is right here.
          </motion.p>
          <motion.div
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
  className="mt-6 md:mt-8"
>
  <Link
    to="/register"
    className="relative flex items-center gap-4 px-12 md:px-16 py-4 rounded-full border border-yellow-400 text-yellow-400 font-semibold text-2xl md:text-3xl 
               transition-all duration-300 hover:text-white hover:border-yellow-400 hover:shadow-[0_0_15px_#fcd34d,0_0_30px_#facc15]
               bg-black/20 backdrop-blur-sm overflow-hidden group"
  >
    {/* Inner moving shine */}
    <span className="absolute left-0 top-0 w-1/3 h-full bg-white/20 blur-lg -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

    {/* Button content */}
    <span className="relative z-10 flex items-center gap-4">
      Start Designing
      <motion.span
        animate={{ x: [0, 6, 0], rotate: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <FaArrowRight />
      </motion.span>
    </span>

    {/* Soft pulse */}
    <motion.span
      className="absolute inset-0 rounded-full border border-yellow-400 opacity-50"
      animate={{ boxShadow: ["0 0 10px #fcd34d", "0 0 25px #facc15", "0 0 10px #fcd34d"] }}
      transition={{ repeat: Infinity, duration: 2 }}
    ></motion.span>
  </Link>
</motion.div>


        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 md:bottom-10 w-6 h-6 border-2 border-white rounded-full animate-bounce"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        ></motion.div>
      </main>

      {/* Footer */}
      <motion.footer className="relative z-20 py-5 md:py-6 text-center text-gray-300 text-xs md:text-sm border-t border-gray-500/20">
        &copy; 2025 Matty. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default HomePage;
