import { useState } from "react";
import axios from "axios";

const ActivateAccount = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/activate-account/",
        { email }
      );
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/verify-otp/",
        { email, otp }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Activate Account</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ActivateAccount;
