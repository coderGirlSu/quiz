from django.urls import path
from quiz_server.api.views import lesson
from quiz_server.api.views import lessons
from quiz_server.api.views import check_answers


urlpatterns = [
    # path("question_list/", question_list, name="question_list"),
    path("lessons/", lessons, name="lessons"),
    path("lesson/<int:lesson_id>/", lesson, name="lesson"),
    path("check_answers/<int:lesson_id>", check_answers, name="check_answers")
]
