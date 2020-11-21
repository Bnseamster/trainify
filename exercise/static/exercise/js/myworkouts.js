document.addEventListener('DOMContentLoaded', () =>{
    getMyWorkouts();
    displayWorkout();
})

//gets the users saved workouts
function getMyWorkouts(){
    fetch(`/get_my_workouts`)
    .then(response => response.json())
    .then(myWorkouts => {
        let cardContainer = document.getElementById('my-workouts-container');
        
        let templateFunction = Handlebars.compile(myWorkoutCardTemplate);
        console.log(myWorkouts)
        if (myWorkouts.length >1){
            myWorkouts.forEach(function(workout,n) {
                console.log(workout)
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
        } else {
            let noWorkouts = document.createElement('h2');
            noWorkouts.innerHTML = 'No Workouts Saved!'
            noWorkouts.style.textAlign = 'center';
            cardContainer.innerHTML += noWorkouts;
        }
        

        
    })
}

//sets the current workout in storage to be displayed on the preview page
function setCurrentWorkout(currentWorkout, workoutName){
    
    localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout.exercises));
    localStorage.setItem('workoutName', workoutName);
    localStorage.setItem('workoutLikes', currentWorkout.likes);
    localStorage.setItem('currentWorkoutId', currentWorkout.id);
    window.location.replace("http://127.0.0.1:8000/workout_preview");            
    
   
}

//displays that current workout saved in storage
function displayWorkout(){
    

    let workout = JSON.parse(localStorage.getItem('currentWorkout'));
    let workoutName = localStorage.getItem('workoutName');
    
    

    const selectedExercises = document.getElementById('selected-exercises');
    selectedExercises.innerHTML= '';
    
    let workoutInfo = document.getElementById('workout-info')
    const workoutInfoTemplateFunction = Handlebars.compile(workoutInfoTemplate);
    
    workoutInfo.innerHTML += workoutInfoTemplateFunction({workoutName:workoutName, description:'place holder', likes: localStorage.getItem('workoutLikes'), id: localStorage.getItem('currentWorkoutId')})

    workout.forEach(function(w){
        let newExerciseTile = document.createElement("div");
        newExerciseTile.setAttribute("id","exercise-tile");
        newExerciseTile.setAttribute("name","exercise-tile");
        newExerciseTile.setAttribute("class", "card mb-3 ml-2 mr-2");
        newExerciseTile.setAttribute("style", "box-shadow: 7px 7px 5px 1px rgba(0, 0, 0, 0.5); max-width: 30rem;")
        

        let mainMuscles = w.main_muscles;
        let mainMusclesString = ''
        mainMuscles.forEach(function(x,c){
            if (mainMuscles.length-1 != c){
                mainMusclesString += x + ', ';
            }
            else{
                mainMusclesString += x + '.';
            }

        })
        
        const exerciseTileTemplateFunction = Handlebars.compile(exerciseTileTemplate);
        newExerciseTile.innerHTML = exerciseTileTemplateFunction({ description: w.description, url: 'https://s.yimg.com/ny/api/res/1.2/I8UXp5uksPso1horzms57g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://s.yimg.com/cd/resizer/2.0/original/psi55OfDJy_yBWyE7Y_nhsiAVMA', muscles: mainMusclesString, name: w.name, duration:w.time_to_complete});
        
        newExerciseTile.style.display= 'none';
        selectedExercises.appendChild(newExerciseTile);        
    })
    
    let exerciseTiles = document.getElementsByName('exercise-tile');
    let numOfTiles = exerciseTiles.length
    
    exerciseTiles.forEach(function(t,c){

        
            t.style.display= 'block';
            t.setAttribute('style',`
            display:block;
            animation: 1.0s ease-out 0s 1 slideInFromLeft;
            `)
            
    })
    document.getElementById('like-button').addEventListener('click',()=>like_workout(),false)
}

//allows the user to like the displayed workout
function like_workout(){
    fetch(`/like_workout`,{
        method: 'POST',
        body: JSON.stringify({
            currentWorkoutId: document.getElementById('like-button').value
        }),
        credentials: 'same-origin',
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('likes').innerHTML =`Likes: ${data.likes}`
    })
}

