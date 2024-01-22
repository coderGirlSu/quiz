import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

interface Lesson {
  title: string;
  content: string;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
}

function Lesson() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dictionary, setDictionary] = useState<{ [key: number]: number[] }>({});
  const [lessonId, setLessonId] = useState<string | null>("");
  const navigate = useNavigate();

  // Fetch the lesson data from the lesson endpoint when the component mounts
  useEffect(() => {
    fetchLessonData();
  }, []);

  function fetchLessonData() {
    // Get the lesson id from the query string and set the lesson id state variable
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const lId = params.get("lessonid");
    setLessonId(lId);
    // Get the token from local storage
    const token = localStorage.getItem("token");
    // Fetch the lesson data from the lesson endpoint with the lesson id and token
    return (
      fetch(`${BASE_URL}/quiz/lesson/${lId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        // Transform the fetched data into an array of Question objects
        .then((data) => {
          const questionArray: Question[] = data.map((item: any) => {
            return {
              id: item.question.id,
              text: item.question.text,
              answers: item.question.answers.map((answer: any) => {
                return {
                  id: answer.id,
                  text: answer.text,
                };
              }),
            };
          });
          setQuestions(questionArray);
        })
        .catch((error) => {
          console.error("Error fetching lesson data:", error);
        })
    );
  }

  // Update the dictionary of answers for each question
  const handleAnswer = (questionId: number, answerId: number) => {
    // Check if the current questionId in the dictionary, if not create a new entry with the questionId as the key and an array containing the answerId as the value
    if (dictionary[questionId] === undefined) {
      dictionary[questionId] = [answerId];
    } else {
      // Check if the answerId is already in the array, if it is, remove the answerId from the array
      if (dictionary[questionId].includes(answerId)) {
        dictionary[questionId] = dictionary[questionId].filter(
          (item) => item !== answerId
        );
      } else {
        // If the answerId is not in the array, add the answerId to the array
        dictionary[questionId].push(answerId);
      }
    }
  };

  // Submit the answers to the check answers endpoint and navigate to the score page
  function handleSubmit() {
    // Create the data object to send in the POST request
    const data = {
      answers: Object.entries(dictionary).map(([key, value]) => ({
        question_id: parseInt(key),
        answer_ids: value,
      })),
    };

    const token = localStorage.getItem("token");
    // Sends a POST request to the check answer endpoint to check the answers.
    fetch(`${BASE_URL}/quiz/check_answers/${lessonId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error checking answers.");
        }
      })
      .then((responseData) => {
        const score = responseData.score;
        navigate(`/score/?score=${score}`);
      })
      .catch((error) => {
        console.error("Error checking answers:", error);
      });
  }

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>

          {question.answers.map((answer) => (
            <div key={answer.id}>
              <label>
                <input
                  type="checkbox"
                  onClick={() => handleAnswer(question.id, answer.id)}
                />
                {answer.text}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button className="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Lesson;
