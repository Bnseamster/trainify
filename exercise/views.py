from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django import forms
from .models import User, Exercise, Muscle, Starting_and_max, Muscle_groups, User_workouts
import json
import random
import time

r = random.SystemRandom()

def index(request):
    return render(request, "exercise/index.html")

class WorkoutForm(forms.Form):
    pass

# allows user to login
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "exercise/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "exercise/login.html")

#allows user to logout
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

#allows new users to make an account
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "exercise/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "exercise/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "exercise/register.html")

#sends user to randomly generated workout page
def workout_form(request):
    if request.user.is_authenticated:
        return render(request, "exercise/workout_form.html")
    else:
        return HttpResponseRedirect(reverse("login"))

#generates random workout for the user by pulling random workouts from the database
@csrf_exempt
def generate_workout(request):

    data = json.loads(request.body)
 
    
    randomMuscle = []
    selected_exercises=[]
    exerciseTotal=0
    x=0
    muscles = Muscle.objects.filter(muscleGroup= data['group']).all()
    duration = int(data['duration'])
    timeToCompleteSum = 0
    

    while timeToCompleteSum <= duration: 
        
        randomMuscle.append(r.choice(muscles)) 
        
        
        exercises = randomMuscle[x].exercises.all()
        
        randomExercise = r.choice(exercises)
        
        
        
        x += 1
        if (randomExercise not in selected_exercises):
            selected_exercises.append(randomExercise)
            exerciseTotal += 1
            
            timeToCompleteSum += randomExercise.time_to_complete

        if x >= 100:
            return JsonResponse([exercise.serialize() for exercise in selected_exercises],safe=False)

    return JsonResponse([exercise.serialize() for exercise in selected_exercises],safe=False)

#saves users workouts to database
def save_workout (request):
    
    
    try:
        data = json.loads(request.body)



        user = User.objects.filter(username=request.user).first()

        exercises = [Exercise.objects.filter(name=exercise['name']).first() for exercise in data['workout']]


        newWorkout = User_workouts(name=data['name'], user= user)
        newWorkout.save()

        for exercise in exercises:

            newWorkout.exercises.add(exercise)
            newWorkout.save()

        return JsonResponse({"message":"Success", "name":data['name']})
    
    except:
       return JsonResponse({"message":"Error"})

#starts workout timer
def start_workout(request):
    data = request.POST.getlist('workout-set')
    #data = request.body

    

    return render(request, "exercise/workout.html")

#loads users myworkouts page
def my_workouts (request):
    return render(request, "exercise/myworkouts.html")

#gets the workouts that the user has saved
def get_my_workouts (request):

    currentUser = User.objects.filter(username= request.user).first()
    myWorkouts = currentUser.myWorkouts.all()

    return JsonResponse([workout.serialize() for workout in myWorkouts],safe=False)

#lets user see a preveiw of the workout before they start it
def workout_preview (request):
    return render(request, "exercise/workout_preview.html")

#loads the sharedworkouts page
def shared_workouts(request):
    return render(request, "exercise/sharedworkouts.html")

#gets all the current shared workouts on the website
def get_shared_workouts(request):

    data = json.loads(request.body)
 

    publicWorkouts = User_workouts.objects.filter(shared =True).all()
    
    if(data['categoryValue'] == 'Top'):
        publicWorkouts = publicWorkouts.order_by('-likes')
        

    elif(data['categoryValue'] == 'Most Recent'):
        publicWorkouts = publicWorkouts.order_by('-datecreated')
   
    


    return JsonResponse([workout.serialize() for workout in publicWorkouts], safe=False)

#function that takes in ajax request and sends back information about likes
def like_workout(request):

    data = json.loads(request.body)

    currentWorkoutId = int(data['currentWorkoutId'])

    currentUser = User.objects.filter(username=request.user).first()
    currentWorkout = User_workouts.objects.filter(id=currentWorkoutId).first()

    if currentUser in currentWorkout.users_who_liked.all():
        currentWorkout.likes -= 1
        currentWorkout.users_who_liked.remove(currentUser)
        currentWorkout.save()
        
    
    else:
        currentWorkout.likes += 1
        currentWorkout.users_who_liked.add(currentUser)
        currentWorkout.save()
        

    return JsonResponse({'likes': currentWorkout.likes})
