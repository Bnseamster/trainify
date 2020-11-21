
document.addEventListener('DOMContentLoaded', function(){
    let category = document.getElementById('selected-category');
    get_shared_workouts('Top');
    category.addEventListener("change", function(){get_shared_workouts(this.value)});

})

//gets all shared workouts on the site
function get_shared_workouts(categoryValue){
    fetch(`/get_shared_workouts`,{
        method: 'POST',
        body: JSON.stringify({
            categoryValue: categoryValue   
        }),
        credentials: 'same-origin',
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(sharedWorkouts => {
        
        let cardContainer = document.getElementById('shared-workouts-container');

        cardContainer.innerHTML = '';
        
        let templateFunction = Handlebars.compile(myWorkoutCardTemplate);

        sharedWorkouts.forEach(function(workout,n) {
            let workoutTime = 0;
            workout.exercises.forEach(x => {workoutTime += x.time_to_complete})

            let newDiv = document.createElement('div')
            newDiv.setAttribute("id", `my-workout-${n}`)

            newDiv.innerHTML = templateFunction({myWorkoutX:`${n}`,workoutName:workout.name, workoutDescription: 'placeholder', workoutLength:workoutTime, currentWorkout:JSON.stringify(workout.exercises), likes: JSON.stringify(workout.likes) });
            
            cardContainer.appendChild(newDiv);

            newDiv.addEventListener('click',function(){setCurrentWorkout(workout, workout.name)},false );
            $(`#my-workout-${n}`).click( function(e) {
                e.preventDefault();
                
            });
        })
    })
}

//sets current workout in local storage to be displayed on the preview page
function setCurrentWorkout(currentWorkout, workoutName){
    localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout.exercises));
    localStorage.setItem('workoutName', workoutName);
    localStorage.setItem('workoutLikes', currentWorkout.likes);
    localStorage.setItem('currentWorkoutId', currentWorkout.id);
    window.location.replace("http://127.0.0.1:8000/workout_preview");            
    
   
}

//allows the user to like the displayed workout
function like_workout(){
    fetch(`/like_workout`,{
        method: 'GET',
        body: JSON.stringify({
            currentWorkoutId: document.getElementById('like-button').value

        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('likes').innerHTML =`Likes: ${data.likes}`
    })
}