from django.contrib import admin
from quiz_server.models import Question
from quiz_server.models import Answer
from quiz_server.models import QuestionAnswer
from quiz_server.models import Lesson
from quiz_server.models import LessonQuestion
from quiz_server.models import Attempt

# Register your models here.
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(QuestionAnswer)
admin.site.register(Lesson)
admin.site.register(LessonQuestion)
admin.site.register(Attempt)