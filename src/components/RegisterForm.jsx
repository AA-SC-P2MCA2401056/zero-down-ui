import { useState } from "react";
import { motion } from "framer-motion";
import ApiConfig from "../api/apiConfig";
import toast from "react-hot-toast";
import { useLoading } from "../common/LoadingContext";
import { Sprout, User } from "lucide-react";

const RegisterForm = ({ switchForm }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("EMPLOYEE"); 
  const [loadMsg, setloadMsg] = useState(false);
  const { setLoading } = useLoading();

  const handleRegister = async (e) => {
    e.preventDefault();

    //  Name validation
    if (!name || name.trim().length === 0) {
      toast.error("Display name is required");
      return;
    }

    //  Email validation (basic)
    if (!email || email.trim().length === 0) {
      toast.error("Email is required");
      return;
    }

    //  Password validation
    if (!password) {
      toast.error("Password is required");
      return;
    }

    //  Confirm password validation
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name,
      useName : email,
      password,
      role, // ADMIN or EMPLOYEE
    };

    try {
      setLoading(true);
      setloadMsg(true)
      await ApiConfig.postPublicRequest(
        ApiConfig.ENDPOINTS.REGISTER,
        payload
      );
      setLoading(false);

      // ✅ Success
      toast.success("Registered successfully! Please login.");
      switchForm();

    } catch (err) {
      // ApiConfig already shows toast
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
      setloadMsg(false)
    }
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
        className="text-slate-100 mb-6 text-center"
      >
        Create your account and plant the first seed 🌱
      </motion.p>

      <form autoComplete="off"  onSubmit={handleRegister} className="flex flex-col gap-4">

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 border border-slate-300 rounded-lg bg-white text-slate-900
                     focus:outline-none focus:ring-2 focus:ring-amber-400
                     placeholder-slate-400"
        />

        {/* Email */}
        <input
          type="email"
          name="fake_email"
          autoComplete="new-email"
          inputMode="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-slate-300 rounded-lg bg-white text-slate-900
                     focus:outline-none focus:ring-2 focus:ring-amber-400
                     placeholder-slate-400"
        />

        {/* Password */}
        <input
          name="fake_password"
          autoComplete="new-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border border-slate-300 rounded-lg bg-white text-slate-900
                     focus:outline-none focus:ring-2 focus:ring-amber-400
                     placeholder-slate-400"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="p-3 border border-slate-300 rounded-lg bg-white text-slate-900
                     focus:outline-none focus:ring-2 focus:ring-amber-400
                     placeholder-slate-400"
        />

        {/* ✅ Role selection */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* EMPLOYEE */}
          <label
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer
              transition-all duration-300 ease-in-out
              ${
                role === "EMPLOYEE"
                  ? "border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm"
                  : "border-slate-300 bg-white hover:border-amber-300"
              }`}
          >
            <input
              type="radio"
              name="role"
              value="EMPLOYEE"
              checked={role === "EMPLOYEE"}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />

            <Sprout
              size={22}
              className={role === "EMPLOYEE" ? "text-amber-500" : "text-slate-400"}
            />

            <span className="text-[11px] text-slate-500 text-center">
              Greenhouse operations
            </span>
          </label>

          {/* ADMIN */}
          <label
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer
              transition-all duration-300 ease-in-out
              ${
                role === "ADMIN"
                  ? "border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm"
                  : "border-slate-300 bg-white hover:border-amber-300"
              }`}
          >
            <input
              type="radio"
              name="role"
              value="ADMIN"
              checked={role === "ADMIN"}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />

            <User
              size={22}
              className={role === "ADMIN" ? "text-amber-500" : "text-slate-400"}
            />

            <span className="text-[11px] text-slate-500 text-center">
              Manage system & users
            </span>
          </label>
        </div>



        {/* Register Button */}
        <button
          type="submit"
          className={`bg-amber-500 text-slate-900 py-3 rounded-xl font-semibold
            transition-all duration-300
            ${loadMsg ? "opacity-60 cursor-not-allowed" : "hover:bg-amber-400"}`}
        >
          {loadMsg ? "Registering..." : "Register"}
        </button>

      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-2 text-slate-400 text-sm">
        <span className="flex-1 border-b border-slate-300"></span>
        <span>or</span>
        <span className="flex-1 border-b border-slate-300"></span>
      </div>

      <p className="mt-4 text-sm text-slate-600 text-center">
        Already have an account?{" "}
        <span
          onClick={switchForm}
          className="text-amber-900 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
