import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const switchForm = () => setShowLogin(!showLogin);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden text-white bg-gradient-to-br from-slate-100 via-indigo-100 to-sky-200">
      {/* 🌸 Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,0,0,0.3)_100%)]" />

      {/* 🦋 Butterflies on Left Side */}
      <motion.img
        src="src/assets/butterfly 2.gif"
        className="fixed top-10 left-4 w-12 h-12 z-10 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: [0, 30, -15, 0], opacity: 1 }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.img
        src="src/assets/butterfly 2.gif"
        className="fixed top-40 left-8 w-14 h-14 z-10 pointer-events-none"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: [0, 35, -20, 0], opacity: 1 }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.img
        src="src/assets/butterfly 2.gif"
        className="fixed top-[60%] left-6 w-16 h-16 z-10 pointer-events-none"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: [0, 40, -25, 0], opacity: 1 }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* 🎞️ Bottom-Right Decorative GIF */}
      <img
        src="src/assets/butterfly 2.gif"
        alt="Decorative"
        className="fixed bottom-4 right-4 w-40 h-40 z-50 pointer-events-none"
      />

      {/* 🌿 Main Card */}
      <div className="relative z-20 flex items-center justify-center flex-1 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/20"
        >
          {/* Left Decorative Section */}
          <div
            className="hidden md:flex md:w-1/2 relative items-end justify-center text-center bg-cover bg-center pb-10 bg-black/30"
            style={{
              backgroundImage: "url('src/assets/undraw_farming_u62j.svg')",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <AnimatePresence mode="wait">
              {showLogin ? (
                <motion.div
                  key="login-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6 }}
                  className="relative max-w-md px-6"
                >
                  <h3 className="text-white/90 text-lg md:text-xl leading-relaxed font-bold">
                    Sign in to monitor your greenhouse, track live conditions,
                    and help your plants thrive every day.
                  </h3>
                </motion.div>
              ) : (
                <motion.div
                  key="register-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6 }}
                  className="relative max-w-md px-6"
                >
                  <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-500 drop-shadow-lg mb-4">
                    Join Our Garden 🌼
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                    Create your account and grow smarter — track, nurture, and
                    bloom with your personalized greenhouse dashboard.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Login/Register Section */}
          <div className="md:w-1/2 p-8 bg-black/40 flex justify-center">
            <div className="w-full max-w-sm flex flex-col justify-center min-h-[460px]">
              <AnimatePresence mode="wait">
                {showLogin ? (
                  <LoginForm key="login" switchForm={switchForm} />
                ) : (
                  <RegisterForm key="register" switchForm={switchForm} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 bg-black/30 text-white/70 text-sm backdrop-blur-sm border-t border-white/20">
        &copy; 2025 Greenhouse Dashboard — Growing with care 🌷
      </footer>
    </div>
  );
};

export default Login;