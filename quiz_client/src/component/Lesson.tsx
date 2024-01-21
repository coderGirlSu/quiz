import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchLessonData = () => {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const lId = params.get("lessonid");
      setLessonId(lId);

      const token = localStorage.getItem("token");

      return fetch(`${BASE_URL}/quiz/lesson/${lId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
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
        });
    };

    fetchLessonData();
  }, []);

  const handleAnswer = (questionId: number, answerId: number) => {
    if (dictionary[questionId] === undefined) {
      dictionary[questionId] = [answerId];
    } else {
      if (dictionary[questionId].includes(answerId)) {
        dictionary[questionId] = dictionary[questionId].filter(
          (item) => item !== answerId
        );
      } else {
        dictionary[questionId].push(answerId);
      }
    }
  };

  const handleSubmit = () => {
    const data = {
      answers: Object.entries(dictionary).map(([key, value]) => ({
        question_id: parseInt(key),
        answer_ids: value,
      })),
    };

    const token = localStorage.getItem("token");

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
  };

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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Lesson;
