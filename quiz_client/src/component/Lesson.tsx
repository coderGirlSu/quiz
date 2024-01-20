import React, { useEffect, useState } from 'react';

interface LessonProps {
    id: number;
    title: string;
    }

function fetchLesson(id: number): Promise<LessonProps> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id,
                title: `Lesson ${id}`,
            });
        }, 1000);
    });
}


function Lesson() {
    const [lesson, setLesson] = useState<LessonProps | null>(null);
    useEffect(() => {
        fetchLesson(1).then((lesson) => {
            setLesson(lesson);
        });
    }, []);
    if (!lesson) {
        return <div>Loading...</div>;
    }

  return (
    <div>
      <h1>Lesson</h1>
    </div>
  );
}

export default Lesson;