import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-hidden">
      {/* Floating background blobs */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl z-0"
        animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 bg-yellow-400 rounded-full opacity-25 blur-3xl z-0"
        animate={{ y: [0, -20, 0], x: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          About Matty
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <span className="font-bold text-yellow-400">Matty</span> is a next-generation visual design tool for creators, students, and professionals. Whether you're sketching concepts, building presentations, or designing software diagrams, Matty empowers you to work fast, share, and stay organized.
        </motion.p>

        {/* Features */}
        <motion.section
          className="mb-16 grid md:grid-cols-2 gap-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          {[
            {
              title: "Intuitive Canvas",
              description: "Drag, draw, and edit shapes, text, or images effortlessly.",
              color: "from-yellow-400 via-pink-400 to-purple-400",
            },
            {
              title: "Real-time Saving",
              description: "Instantly save projects with thumbnails to your personal dashboard.",
              color: "from-pink-400 via-purple-400 to-indigo-400",
            },
            {
              title: "Team Collaboration",
              description: "Share designs and collaborate securely with others.",
              color: "from-purple-400 via-indigo-400 to-pink-400",
            },
            {
              title: "Built for Speed",
              description: "Cutting-edge React/Node.js stack means seamless user experience.",
              color: "from-indigo-400 via-pink-400 to-yellow-400",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-neon transition-all duration-500"
              variants={fadeUp}
              custom={i + 3}
            >
              <h3 className={`text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Mission */}
        <motion.section
          className="mb-12 p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-400">
            Our Mission
          </h2>
          <p className="text-gray-200 text-lg md:text-xl">
            The goal of Matty is creative freedom for everyone—students, innovators, educators, engineers. We believe digital tools should spark ideas and productivity, not slow them down.
          </p>
        </motion.section>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
        >
          <a
            href="/register"
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-neon hover:brightness-110"
          >
            Try Matty Free
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm md:text-base border-t border-white/20 mt-16 z-10 relative">
        &copy; {new Date().getFullYear()} Matty Product Platform. Designed for builders, learners, and teams.
      </footer>
    </div>
  );
};

export default AboutUs;
