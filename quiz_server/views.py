# from django.shortcuts import render
# from quiz_server.models import Question
# from django.http import JsonResponse
# from quiz_server.models import Lesson
# from quiz_server.models import LessonQuestion
# from quiz_server.models import Attempt
# from quiz_server.models import QuestionAnswer
# import json
# from django.views.decorators.csrf import csrf_exempt
# from datetime import date

# def lesson(request, lesson_id):
#     filtered = LessonQuestion.objects.filter(lesson=lesson_id).select_related('question')
   
#     questions = [
#         {'id': q.question.id, 
#         'text': q.question.text,
#         'answers': [{'id':answer.id, 'text': answer.text} for answer in q.question.answers.all()]
#         } for q in filtered]
    
#     scores = Attempt.objects.filter(lesson=lesson_id).values_list('score', flat=True)
#     if len(scores) == 0:
#         average = 0
#     else:
#         average = int(sum(scores) / len(scores))
    
#     data = {
#         "lesson_questions": list(questions),
#         "lesson_average_score":  average,
#     }
#     return JsonResponse(data)

# @csrf_exempt # disabling CSRF protection
# def check_answers(request, lesson_id):
#     body = json.loads(request.body)
#     provided_answers = body['answers']
#     results = []
#     score = 0
#     all_correct = True
    
#     for answer in provided_answers:
#         question = Question.objects.get(pk=answer['question_id']).text
#         provided_question_id = answer['question_id']
#         provided_answer_id = answer['answer_id']
        
#         # Fetch the question IDs for the provided lesson from the database
#         lesson_question_ids = LessonQuestion.objects.filter(lesson=lesson_id).values_list('question_id', flat=True)
#         # Fetch the question IDs provided by the client
#         provided_question_ids = [answer['question_id'] for answer in provided_answers]
        
#         # Check if all provided questions are in the lesson
#         in_lesson = all(question_id in lesson_question_ids for question_id in provided_question_ids)
#         if not in_lesson:
#             print("Question not in lesson")
#             return JsonResponse({"error": "Question does not exist in this lesson"}, status=400)
       
#         # Fetch the correct answer from the database
#         correct_answers = QuestionAnswer.objects.filter(question=provided_question_id, is_correct=True)
#         if correct_answers.exists():
#            correct_answers_text = [answer.answer.text for answer in correct_answers]
#            correct_answers_ids = [answer.answer.id for answer in correct_answers]
#         else:
#             print("No correct answer found")
        
#         # Check if the provided answer is correct
#         is_correct = sorted(provided_answer_id) == sorted(correct_answers_ids)
#         if is_correct:
#             score += 10
        
#         if not is_correct:
#             all_correct = False
            
#         results.append({
#             "question": question,
#             "user_answer": is_correct,
#             "correct_answer": correct_answers_text,
#         },)
    
#     # Create the Attempt object with lesson id, score and date
#     lesson = Lesson.objects.get(id=lesson_id)
#     Attempt.objects.create(lesson=lesson, score=score,  date=date.today())
        
#     return JsonResponse({'results':results,"score":score})


    
# def lessons(request):
#     lessons = Lesson.objects.all()
#     data = {
#         "lessons": list(lessons.values())
#     }
#     return JsonResponse(data)