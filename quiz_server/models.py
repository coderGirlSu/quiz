from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=200)
    answers = models.ManyToManyField("Answer", through="QuestionAnswer")
    def __str__(self) -> str:
        return self.text

class Answer(models.Model):
    text = models.CharField(max_length=200)
    def __str__(self) -> str:
        return self.text

class QuestionAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    def __str__(self) -> str:
        return self.question.text + " - " + self.answer.text + " - " + str(self.is_correct)

class Lesson(models.Model):
    text = models.CharField(max_length=200)
    lesson = models.ManyToManyField("Question", through="LessonQuestion")
    def __str__(self) -> str:
        return self.text
    
class LessonQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return self.lesson.text + " - " + self.question.text
    
class Attempt(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:
        return self.lesson.text + " - " + str(self.score) + " - " + str(self.date)
    