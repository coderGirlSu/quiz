import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import "../style.css";

interface Lesson {
  id: number;
  lesson: string;
  average_score: number;
}

function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const navigate = useNavigate();

  // Fetch the lessons data from the lessons endpoint when the component mounts
  useEffect(() => {
    fetchLessonsData();
  }, []);

  // Fetch the lessons data using provided token from the lessons endpoint
  function fetchLessonsData() {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/quiz/lessons`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: any) => {
        setLessons(data.lessons);
      })
      .catch((error) => console.error(error));
  }

  // Navigate to the lesson component when the user clicks the start quiz button
  const handleStart = (lessonId: number) => {
    navigate(`/lesson/?lessonid=${lessonId}`);
  };

  // Logout the user when the user clicks the logout button
  function handleLogout() {
    // Remove the token from database
    fetch(`${BASE_URL}/user/logout/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    // Remove the token from local storage and navigate to the login component
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      <h1>Lessons</h1>
      {lessons.map((lesson: Lesson) => (
        <div key={lesson.id}>
          <h2>{lesson.lesson}</h2>
          <p>Average score: {lesson.average_score}</p>
          <button onClick={() => handleStart(lesson.id)}>Start quiz</button>
        </div>
      ))}
      <button className="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Lessons;
