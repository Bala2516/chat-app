import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    console.log(params,'paramaaa')

    const token = params.get("token");
    const mode = params.get("state");
    const error = params.get("error");

    if (error === "not_found") {
      toast.error("Account not Found");
      navigate("/")
      return;
    }

    localStorage.setItem("token", token);

    checkAuth().then(() => {
      if (mode === "login") {
        toast.success("Logged in successfully");
      } else {
        toast.success("Account created successfully");
      }
      navigate("/");
    });
  }, []);

  return <p>Signing you in...</p>;
};

export default AuthSuccess;
