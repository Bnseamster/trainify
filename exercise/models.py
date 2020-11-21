from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    def __str__(self):
        return self.username

#Model for specific exercise
class Exercise(models.Model):
    name = models.CharField(max_length=35, unique=True)
    main_muscles = models.ManyToManyField("Muscle", related_name='exercies',blank= 'True')
    time_to_complete = models.IntegerField()
    lower_or_upper = models.CharField(max_length=5)
    description = models.TextField(max_length=512)
    
    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "name": self.name,
            "main_muscles":[muscle.name for muscle in Muscle.objects.filter(exercises=self).all()],
            "time_to_complete":self.time_to_complete,
            "description": self.description,

        }

#Model for specific muscles, links them to exercises
class Muscle(models.Model):
    name = models.CharField(max_length=25, null=True)
    exercises = models.ManyToManyField("Exercise", related_name='muscle', blank='True')
    muscleGroup = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

#Model that keeps track of the users starting weight for certain exercises and max weight of that exercise
class Starting_and_max(models.Model):
    user = models.ForeignKey('User', on_delete= models.CASCADE, related_name='starting_weight')
    exercise = models.ForeignKey('Exercise', on_delete= models.CASCADE)
    starting_weight = models.IntegerField(blank='True')
    max_weight = models.IntegerField(blank='True')
    competed_before = models.BooleanField(default='False')


#Model that groups together different muscles that are a part of a particular group of exercies (Push, Pull, Legs, Back, Chest, Arms etc.)
class Muscle_groups(models.Model):
    group_name = models.CharField(max_length=25) 
    muscles_in_group = models.ManyToManyField('Exercise')

#Models that allows user to save different workouts that they have made or would like to save
class User_workouts(models.Model):
    name = models.CharField(max_length=50)
    description= models.TextField(max_length=500)
    exercises = models.ManyToManyField('Exercise')
    user = models.ForeignKey('User', on_delete= models.CASCADE, related_name='myWorkouts')
    shared = models.BooleanField(default=False)
    likes = models.IntegerField(default=0)
    datecreated = models.DateTimeField(auto_now_add=True)
    users_who_liked= models.ManyToManyField('User', related_name='liked_workouts', blank=True )

    def __str__(self):
        return self.name
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "exercises":[exercise.serialize() for exercise in self.exercises.all()],
            "user":self.user.username,
            "likes":self.likes,
            "datecreated":self.datecreated

        }