from django.contrib import admin
from .models import User, Exercise, Muscle, Starting_and_max, Muscle_groups, User_workouts

# Register your models here.

admin.site.register(User)
admin.site.register(Exercise)
admin.site.register(Muscle)
admin.site.register(Starting_and_max)
admin.site.register(Muscle_groups)
admin.site.register(User_workouts)