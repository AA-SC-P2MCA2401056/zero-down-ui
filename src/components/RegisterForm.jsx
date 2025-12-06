import { useState } from "react";
import { motion } from "framer-motion";

const RegisterForm = ({ switchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    // Simple mock registration
    alert("Registered successfully! Now login.");
    switchForm(); // switch to login
  };

  return (
    <motion.div
      key="register"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="flex flex-col justify-center w-full backface-hidden"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        className="text-slate-400 mb-6 text-center"
      >
        Create your account and plant
        the first seed 🌿
      </motion.p>
      {error && (
        <div className="bg-red-800 text-red-300 p-2 rounded text-sm text-center mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-slate-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-slate-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="p-3 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-slate-500"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-slate-900 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-300"
        >
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-2 text-slate-500 text-sm">
        <span className="flex-1 border-b border-slate-700"></span>
        <span>or</span>
        <span className="flex-1 border-b border-slate-700"></span>
      </div>

      <p className="mt-4 text-sm text-slate-300  text-center">
        Already have an account?{" "}
        <span
          onClick={switchForm}
          className="text-emerald-400 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
