from rest_framework import serializers
from quiz_server.models import QuestionAnswer, Question, Answer

class LessonSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    text = serializers.CharField(max_length=200)
   
class QuestionAnswerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    answer = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all())
    is_correct = serializers.BooleanField(read_only=True, default=False)
    
    def create(self, validated_data):
        return QuestionAnswer.objects.create(**validated_data)
    
class AnswerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    text = serializers.CharField()
   
class QuestionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    text = serializers.CharField()
    answers = AnswerSerializer(many=True, read_only=True)
    
class LessonQuestionSerializer(serializers.Serializer):
    # id = serializers.IntegerField(read_only=True)
    # lesson = serializers.PrimaryKeyRelatedField(read_only=True)
    question = QuestionSerializer(read_only=True)

class AttemptSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    lesson = serializers.PrimaryKeyRelatedField(read_only=True)
    score = serializers.IntegerField(min_value=0)
    date = serializers.DateTimeField(read_only=True)

class AttemptAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_ids = serializers.ListField(child=serializers.IntegerField())

class CheckAnswersSerializer(serializers.Serializer):
    answers = AttemptAnswerSerializer(many=True)