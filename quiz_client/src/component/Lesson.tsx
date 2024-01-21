import React, { useEffect, useState } from 'react';

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

function Lesson () {
    const [questions, setQuestions] = useState<Question[]>([]);

    const dictionary: { [key: number]: number[] }  = {};
    

    useEffect(() => {
        const fetchLessonData = () => {
            const search = window.location.search;
            const params = new URLSearchParams(search);
            const lessonId = params.get('lessonid');

            const token = localStorage.getItem('token');

            return fetch(`http://localhost:8000/quiz/lesson/${lessonId}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    const questionArray: Question[] = data.map((item: any) => {
                        return {
                            id: item.question.id,
                            text: item.question.text,
                            answers: item.question.answers.map((answer: any) => {
                                return {
                                    id: answer.id,
                                    text: answer.text
                                };
                            })
                        }
                    }
                    );
                    setQuestions(questionArray);
                })
                .catch(error => {
                    console.error('Error fetching lesson data:', error);
                });
        };

        fetchLessonData();
    }, []);

    

    const handleAnswer = (questionId:number, answerId:number) => {
        if (dictionary[questionId] === undefined) {
            dictionary[questionId] = [answerId];
        } else {
            if (dictionary[questionId].includes(answerId)) {
                dictionary[questionId] = dictionary[questionId].filter((item) => item !== answerId);
            } else {
                dictionary[questionId].push(answerId);
            }
        }
        console.log(dictionary);
    }


    return (
        <div>
            {questions.map(question => (
                <div key={question.id}>
                  <h3>{question.text}</h3>
                 
                    {question.answers.map(answer => (
                        <div key={answer.id}>
                            <label>
                                <input type="checkbox" onClick={()=>handleAnswer(question.id, answer.id)} />
                                {answer.text}
                            </label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
    

export default Lesson;
