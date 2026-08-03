// Stage Royale Frontend Starter
import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [contestant, setContestant] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // Send OTP
  async function sendOtp() {
    await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    alert("OTP sent to your email (check console in DEV)");
  }

  // Verify OTP
  async function verifyOtp() {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp }),
    });
    const data = await res.json();
    if (data.message) {
      setVerified(true);
      alert("Login successful!");
    } else {
      alert("Invalid OTP");
    }
  }

  // Vote
  async function vote() {
    if (!verified) return alert("You must be verified to vote");
    await fetch(`${API_BASE_URL}/api/vote/${contestant}`, { method: "POST" });
    alert(`Vote recorded for contestant ${contestant}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Stage Royale Voting</h1>

      {!verified ? (
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
          <br /><br />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      ) : (
        <div>
          <h2>Vote for Your Contestant</h2>
          <input
            type="text"
            placeholder="Contestant ID"
            value={contestant}
            onChange={(e) => setContestant(e.target.value)}
          />
          <button onClick={vote}>Vote</button>
        </div>
      )}
    </div>
  );
}

export default App;
