import logo from "./logo.svg";
import "./App.css";
import app from "./firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function App() {
  const googlesign = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Get Firebase ID Token
      console.log("id");
      console.log(idToken);
      console.log("id");

      alert(idToken);

      // Send token to your backend
      const response = await fetch("http://localhost:5000/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Login success:", data);
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };
  return (
    <div className="App">
      <button onClick={googlesign}> google sign in</button>
    </div>
  );
}

export default App;
