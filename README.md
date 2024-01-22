# README

Try it out: [https://quiz.codergirlsu.dev](https://quiz.codergirlsu.dev)

## Description

This Quiz app is an interactive and educational quiz application designed to test and enhance users' knowledge about animals and plants. Built with robust technologies, the app features a seamless blend of Django Rest Framework and Python for the backend, ensuring efficient data handling and RESTful API services. The front end is created with React and TypeScript.

Features:

- Multi-user authentication
- Create a number of lessons/quizzes
- Configure Lessons/quizzes to contain your own custom questions and answers
- Questions can have single (only one answer out of the possible choices is correct) or multi (more than one answer out of the possible choices is correct) answers
- JSON REST API
- Data validation using Django REST Framework serializers
- Lesson/quiz score calculation
- Lesson/quiz average score calculation per user

## Hosting

An instance of the project is hosted in AWS running on an EC2 instance. The EC2 instance is using NGINX reverse proxy as a security layer and to allow running frontend backend on the same server. SSL was configured using `certbot` [Let’s Encrypt](https://letsencrypt.org).

```mermaid
flowchart LR
	  User --> NGINX
		subgraph EC2
			NGINX --> F["Frontend - React"]
			NGINX --> B["Backend - Django"]
		end
```

DNS has been configured with A Records pointing from

- Frontend - [https://quiz.codergirlsu.dev](https://quiz.codergirlsu.dev)
- Backend - [https://quiz-api.codergirlsu.dev](https://quiz-api.codergirlsu.dev)

## Testing

### Unit Testing

There are a set of unit tests written to test each backend endpoint. Run the unit tests with the command `python3 manage.py test`.

### Frontend manual testing

[https://quiz.codergirlsu.dev](https://quiz.codergirlsu.dev)

Test user account:

- username: `Su` (case-sensitive)
- password: `thisisapassword`

### Backend manual testing

Use a tool such as Postman to access the backend API

**POST [https://quiz-api.codergirlsu.dev/user/login/](https://quiz-api.codergirlsu.dev/user/login/)**

Login and obtain an access token

Request

```text
Form data
username: Su
password: thisisapassword
```

Response

```json
{
    "token": "284376cc2015a1dadbbc974b6208a055cd669b1b"
}
```

**POST [https://quiz-api.codergirlsu.dev/user/logout/](https://quiz-api.codergirlsu.dev/user/logout/)**

Destroy login token and logout

Request

```text
Headers
Authorization: Token 284376cc2015a1dadbbc974b6208a055cd669b1b
```

Response

```text
status 200
```

**GET [https://quiz-api.codergirlsu.dev/quiz/lessons](https://quiz-api.codergirlsu.dev/quiz/lessons)**

Get a list of lessons available

```text
Headers
Authorization: Token 284376cc2015a1dadbbc974b6208a055cd669b1b
```

Response

```json
{
    "lessons": [
        {
            "id": 1,
            "lesson": "Animal",
            "average_score": 28
        },
        {
            "id": 2,
            "lesson": "Plant",
            "average_score": 5
        }
    ]
}
```

**GET [https://quiz-api.codergirlsu.dev/quiz/lesson/](https://quiz-api.codergirlsu.dev/quiz/lesson/1){LESSON_ID}**

Get a lesson’s questions and answer options

Request

```text
GET https://quiz-api.codergirlsu.dev/quiz/lesson/1

Headers
Authorization: Token 284376cc2015a1dadbbc974b6208a055cd669b1b
```

Response

```json
[
    {
        "question": {
            "id": 13,
            "text": "Which of the following animals are mammals?",
            "answers": [
                {
                    "id": 25,
                    "text": "Dolphin"
                },
                {
                    "id": 24,
                    "text": "Bat"
                },
                {
                    "id": 40,
                    "text": "Crocodile"
                },
                {
                    "id": 42,
                    "text": "Penguin"
                }
            ]
        }
    },

    ......

]
```

**POST [https://quiz-api.codergirlsu.dev/quiz/check_answers/](https://quiz-api.codergirlsu.dev/quiz/check_answers/1){LESSON_ID}**

Submit an attempt at a lesson and get score

**VALID data**

Request

```text
POST https://quiz-api.codergirlsu.dev/quiz/check_answers/1

Headers
Authorization: Token 284376cc2015a1dadbbc974b6208a055cd669b1b

{
    "answers": 
    [
        {"question_id":13, "answer_ids": [25,24]},
        {"question_id":15, "answer_ids": [47,49,50]}
    ]
}
```

Response

```json
{
    "results": [
        {
            "question": "Which of the following animals are mammals?",
            "user_answer": true,
            "correct_answer": [
                "Dolphin",
                "Bat"
            ]
        },
        {
            "question": "Which of these birds are known to be flightless?",
            "user_answer": true,
            "correct_answer": [
                "Ostrich",
                "Emu",
                "Penguin"
            ]
        }
    ],
    "score": 20
}
```

**INVALID data example**

Request

```text
POST https://quiz-api.codergirlsu.dev/quiz/check_answers/1

Headers
Authorization: Token 284376cc2015a1dadbbc974b6208a055cd669b1b

{
    "answers": 
    [
        {"question_id":13}
    ]
}
```

Response

```json
{
    "answers": [
        {
            "answer_ids": [
                "This field is required."
            ]
        }
    ]
}
```

## Repository overview

The repository contains both the frontend (quiz_client) and backend (quiz_server).

### Frontend (quiz_client)

Written using React, the frontend client consists of a number of simple pages covering the main functionality of the API.

Configure the API base URL in the `config.js` file.

Start the client locally using `npm run start`.

### Backend (quiz_server)

Written using Python 3, Django and the Django REST Framework (DRF). The backend provides a set of APIs to view lessons and attempt quizzes.

Run the API locally using `python3 manage.py runserver`
