from rest_framework.response import Response
from quiz_server.models import Lesson, LessonQuestion, QuestionAnswer
from quiz_server.api.serializers import LessonSerializer, LessonQuestionSerializer, QuestionAnswerSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def lessons(request): 
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def lesson(request, lesson_id):
    lesson = LessonQuestion.objects.filter(lesson=lesson_id)
    serializer = LessonQuestionSerializer(lesson, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def check_answers(request, lesson_id):
    # TODO: If statement is not required here because the only method allowed is POST
    if request.method == "POST":
        data = request.data.copy()
        data["lesson"] = lesson_id
        serializer = QuestionAnswerSerializer(data= data)
        # if serializer.is_valid():
            # serializer.save()
            # return Response(serializer.data)