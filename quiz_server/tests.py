from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from quiz_server.models import Lesson, LessonQuestion, Question, QuestionAnswer

class LessonsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test', password='test')
        self.token = Token.objects.create(user=self.user)
        
        l1 = Lesson.objects.create(text="Lesson 1")
        l2 = Lesson.objects.create(text="Lesson 2")
        
        q1 = Question.objects.create(text="Question 1")
        q2 = Question.objects.create(text="Question 2")
        
        a1 = q1.answers.create(text="Answer 1")
        a2 = q1.answers.create(text="Answer 2")
        
        QuestionAnswer.objects.create(question=q1, answer=a1, is_correct=True)
        QuestionAnswer.objects.create(question=q2, answer=a2, is_correct=True)
        
        LessonQuestion.objects.create(lesson=l1, question=q1)
        LessonQuestion.objects.create(lesson=l1, question=q2)
        
    
    
    def test_lessons(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get("/quiz/lessons/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['lessons'][0]['lesson'], "Lesson 1")
        self.assertEqual(response.data['lessons'][1]['lesson'], "Lesson 2")
        
    def test_lesson(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get("/quiz/lesson/1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['question']['text'], "Question 1")
        self.assertEqual(response.data[1]['question']['text'], "Question 2")
        
    def test_check_answers(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        data = {"answers": [{"question_id": 1, "answer_ids": [1]}, {"question_id": 2, "answer_ids": [2]}]}
        response = self.client.post("/quiz/check_answers/1", data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['score'], 20)
