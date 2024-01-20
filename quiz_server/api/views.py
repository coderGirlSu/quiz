from datetime import date
from rest_framework.response import Response
from quiz_server.models import Attempt, Lesson, LessonQuestion, Question, QuestionAnswer
from quiz_server.api.serializers import CheckAnswersSerializer, LessonSerializer, LessonQuestionSerializer, QuestionAnswerSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def lessons(request): 
    lessons = Lesson.objects.all()
    data = []

    for lesson in lessons:
        # get all attempt scores for this lesson and user
        attempt_scores = Attempt.objects.filter(lesson=lesson.id, user_id=request.user.id).values_list('score', flat=True)
        if len(attempt_scores) == 0:
            average_score = 0
        else:
            average_score = int(sum(attempt_scores) / len(attempt_scores))
        data.append({"lesson":lesson.text, "average_score":average_score})  
        
    return Response({"lessons":data})

@api_view(['GET'])
def lesson(request, lesson_id):
    lesson = LessonQuestion.objects.filter(lesson=lesson_id)
    serializer = LessonQuestionSerializer(lesson, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def check_answers(request, lesson_id):
    results = []
    score = 0

    serializer = CheckAnswersSerializer(data= request.data)
    if serializer.is_valid():
        provided_answers = serializer.data['answers']
        for answer in provided_answers:
            question = Question.objects.get(pk=answer['question_id']).text
            provided_question_id = answer['question_id']
            provided_answer_id = answer['answer_id']
        
            # Fetch the question IDs for the provided lesson from the database
            lesson_question_ids = LessonQuestion.objects.filter(lesson=lesson_id).values_list('question_id', flat=True)
            # Fetch the question IDs provided by the client
            provided_question_ids = [answer['question_id'] for answer in provided_answers]
        
            # Check if all provided questions are in the lesson
            in_lesson = all(question_id in lesson_question_ids for question_id in provided_question_ids)
            if not in_lesson:
                print("Question not in lesson")
                return Response({"error": "Question does not exist in this lesson"}, status=400)
       
            # Fetch the correct answer from the database
            correct_answers = QuestionAnswer.objects.filter(question=provided_question_id, is_correct=True)
            if correct_answers.exists():
                correct_answers_text = [answer.answer.text for answer in correct_answers]
                correct_answers_ids = [answer.answer.id for answer in correct_answers]
            else:
                print("No correct answer found")
            
            # Check if the provided answer is correct
            is_correct = sorted(provided_answer_id) == sorted(correct_answers_ids)
            if is_correct:
                score += 10
            
            results.append({
                "question": question,
                "user_answer": is_correct,
                "correct_answer": correct_answers_text,
            },)
    
        # Create the Attempt object with lesson id, score and date
        lesson = Lesson.objects.get(id=lesson_id)
        Attempt.objects.create(lesson=lesson, score=score, date=date.today(), user_id=request.user.id)
    
        return Response({"results":results,"score":score})
    
    else:
        return Response(serializer.errors, status=400)