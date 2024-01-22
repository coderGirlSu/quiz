import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Score() {
  const [score, setScore] = useState<string | null>("0");
  const navigate = useNavigate();

  // Get the score from the query string when the component mounts
  useEffect(() => {
    getScore();
  }, []);

  // Get the score from the query string and set the score state variable
  function getScore() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    setScore(params.get("score"));
  }

  // Navigate to the lessons component when the user clicks the back button
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
