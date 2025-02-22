import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import app from "../firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Loader2 } from "lucide-react";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const googleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post("http://localhost:3002/api/login", {
        idToken,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/drive");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
      setError("Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <img
          src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
          alt="Drive Logo"
          className="mx-auto w-20 mb-4"
        />
        <h1 className="text-2xl font-semibold mb-6">Welcome to Drive</h1>

        <button
          onClick={googleSignIn}
          disabled={loading}
          className="flex items-center justify-center bg-white border border-gray-300 px-4 py-2 rounded-lg w-full shadow-md hover:bg-gray-100 transition"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {/* <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              /> */}
              <span className="font-medium">Sign in with Google</span>
            </>
          )}
        </button>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        <p className="mt-6 text-gray-500 text-sm">
          By signing in, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
