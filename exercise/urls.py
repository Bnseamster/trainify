from django.urls import path

from . import views

urlpatterns =[
    path('',views.index,name='index'),
    path('login',views.login_view,name='login'),
    path('logout',views.logout_view,name='logout'),
    path("register", views.register, name="register"),
    path("workout", views.workout_form, name="workout"),
    path("generate_workout", views.generate_workout, name="generate-workout"),
    path("save_workout", views.save_workout, name="save-workout"),
    path("go", views.start_workout, name='start-workout'),
    path("my_workouts", views.my_workouts, name='my-workouts'),
    path("get_my_workouts", views.get_my_workouts, name='get-my-workouts'),
    path("workout_preview", views.workout_preview, name="workout-preview"),
    path("share", views.shared_workouts, name="shared-workouts"),
    path("get_shared_workouts", views.get_shared_workouts, name="get-shared-workouts"),
    path("like_workout", views.like_workout, name="like-workout")
]