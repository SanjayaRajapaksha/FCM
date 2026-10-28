import { useEffect, useState } from "react";
import { generateToken, listenForMessages } from "./firebase";

function App() {
  const [status, setStatus] = useState("");

  // Listen for messages once when component mounts
  useEffect(() => {
    listenForMessages();
  }, []);

  const handleSaveToken = async () => {
    try {
      setStatus("Requesting notification permission...");

      // 1️⃣ Generate the real FCM token
      const token = await generateToken();

      if (!token) {
        setStatus("Permission denied or token not generated.");
        return;
      }

      console.log("Generated FCM token:", token);
      setStatus("Sending token to server...");

      // 2️⃣ Send token to backend API
      const response = await fetch("http://localhost:8000/api/fcmToken/saveToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          user_id: 1, // replace with dynamic user ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      setStatus("Token saved successfully!");

    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to save token. Check console.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>FCM Token Demo</h1>
      <button
        onClick={handleSaveToken}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Generate & Save FCM Token
      </button>
      <p>{status}</p>
    </div>
  );
}

export default App;