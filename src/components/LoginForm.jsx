import { useState } from "react";
import { motion } from "framer-motion";
import ApiConfig from "../api/apiConfig";
import toast from "react-hot-toast";
import { useLoading } from "../common/LoadingContext";

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({ email: false, password: false });
  const { setLoading } = useLoading();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldError.email && e.target.value.trim() !== "") {
      setFieldError((prev) => ({ ...prev, email: false }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldError.password && e.target.value.trim() !== "") {
      setFieldError((prev) => ({ ...prev, password: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldError({ email: false, password: false });

    if (!email || !password) {
      setFieldError({
        email: !email,
        password: !password,
      });

      toast.error("Please fill in all fields", {
        style: {
          background: "#7f1d1d",
          color: "#fca5a5",
          border: "1px solid #f87171",
        },
        icon: "⚠️",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await ApiConfig.postPublicRequest(
        ApiConfig.ENDPOINTS.LOGIN,
        { username: email, password: password }
      );
      console.log("inside login")
      console.log(response)
      const token = response.data?.token || response.token; // handle both backend formats
      if (!token) throw new Error("Missing token in response");

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", response.data?.username || email);

      toast.success("Successfully logged in 🌿", {
        style: {
          background: "#78350f",
          color: "#fef3c7",
          border: "1px solid #fbbf24",
        },
      });

      localStorage.setItem("showLoginToast", "true");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      if (err.status === 401) {
        // only if actual invalid credentials
        toast.error("Invalid email or password", {
          style: {
            background: "#7f1d1d",
            color: "#fca5a5",
            border: "1px solid #f87171",
          },
          icon: "❌",
        });
        setFieldError({ email: true, password: true });
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <motion.div
      key="login"
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
        <span className="text-4xl font-bold text-amber-900 drop-shadow-lg block">
          Welcome Back 🌸
        </span>
        <span className="text-white-800 text-base">
          Ready to nurture your greens?
        </span>
      </motion.p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          whileFocus={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`p-3 border rounded-lg bg-slate-100 text-slate-900 
            placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-md
            ${
              fieldError.email
                ? "border-red-500 shadow-[0_0_10px_3px_rgba(239,68,68,0.6)]"
                : "border-transparent hover:shadow-[0_0_10px_2px_rgba(245,158,11,0.4)] focus:shadow-[0_0_14px_3px_rgba(245,158,11,0.6)]"
            }`}
        />

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          whileFocus={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`p-3 border rounded-lg bg-slate-100 text-slate-900 
            placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-md
            ${
              fieldError.password
                ? "border-red-500 shadow-[0_0_10px_3px_rgba(239,68,68,0.6)]"
                : "border-transparent hover:shadow-[0_0_10px_2px_rgba(245,158,11,0.4)] focus:shadow-[0_0_14px_3px_rgba(245,158,11,0.6)]"
            }`}
        />

        <button
          type="submit"
          className="bg-amber-700 text-slate-900 py-3 rounded-xl font-semibold hover:bg-amber-500 transition-all duration-300 active:scale-95 shadow-[0_4px_10px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_15px_rgba(245,158,11,0.5)]"
        >
          Login
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-2 text-slate-900 text-sm">
        <span className="flex-1 border-b border-slate-700"></span>
        <span>or</span>
        <span className="flex-1 border-b border-slate-700"></span>
      </div>

      <p className="mt-4 text-sm text-slate-100 text-center">
        Don't have an account?{" "}
        <span
          onClick={switchForm}
          className="text-amber-900 cursor-pointer hover:underline hover:text-amber-400 transition-all"
        >
          Register
        </span>
      </p>
    </motion.div>
  );
};

export default LoginForm;
