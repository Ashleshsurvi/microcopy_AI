from django.urls import path
from .views import GenerateMicrocopy

urlpatterns = [
    path('generateMicrocopy/',GenerateMicrocopy.as_view()),
]