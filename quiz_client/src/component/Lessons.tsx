import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

interface Lesson {
    id: number;
    lesson: string;
    average_score: number;
}

function Lessons() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${BASE_URL}/quiz/lessons`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(response => response.json())
            .then((data: any) => {
                setLessons(data.lessons)})
            .catch(error => console.error(error));
    }, []);

    const handleStart = (lessonId: number) => {
        navigate(`/lesson/?lessonid=${lessonId}`);
    };

    return (
        <div>
            <h1>Lessons</h1>
            {/* Render the fetched data */}
            {lessons.map((lesson: Lesson) => (
                <div key={lesson.id}>
                    <h2>{lesson.lesson}</h2>
                    <p>Average score: {lesson.average_score}</p>
                    <button onClick={() => handleStart(lesson.id)}>Start quiz</button>
                </div>
            ))}
        </div>
    );
}

export default Lessons;