import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Score() {
  const [score, setScore] = useState<string | null>("0");
  const navigate = useNavigate();
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    setScore(params.get("score"));
  }, []);

  function handleBack() {
    navigate("/lessons");
  }

  return (
    <div>
      <h1>{score}</h1>
      <button onClick={handleBack}>Back to Home</button>
    </div>
  );
}
export default Score;
