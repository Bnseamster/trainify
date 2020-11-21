//Handlebars Templates for all JS Files
const exerciseTileTemplate = ` <img class="card-img-top" src="{{url}}" alt="Card image cap">
                                <div class="card-body">
                                  <h5 class="card-title">{{name}}</h5>
                                  <p class="card-text">{{description}}</p>
                                  <p class="card-text"><small class="text-muted">Muscles hit: {{muscles}}</small></p>
                                </div>
                                <br>
                              `

const alertTemplate = `
                            <strong>{{status}}</strong> {{message}}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                        `
const myWorkoutCardTemplate= `<div id="{{myWorkoutX}}-div">
                        <a href="" id="{{myWorkoutX}}" >
                            <div  class="card" >
                            <img class="card-img-top" src="https://p1.pxfuel.com/preview/337/634/566/gym-academy-dumbbells-weight.jpg" alt="Card image cap">
                            <div class="card-body">
                              <h5 class="card-title">{{workoutName}}</h5>
                              <p class="card-text">{{workoutDescription}}</p>
                              <p class="card-text"><small class="text-muted">Duration: {{workoutLength}} minutes  Likes: {{likes}}</small></p>
                            </div>
                        </a>
                        </div>
                        `



const workoutInfoTemplate = `
                        <h1 class="display-4">{{ workoutName }}</h1>
                            <p class="lead">{{ description }}</p>
                            <hr class="my-4">
                            <p><span id="likes">Likes: {{likes}}</span>        <button value= "{{id}}" type="button" id="like-button" class="btn btn-success btn-sm">Like</button> </p>
                            <p class="lead">
                          <a class="btn btn-primary btn-lg" href="#after-workout-options" role="button">Start Workout</a>
                        </p>
                    `                           

//run at the beginning of page load based on which page was loaded; changes style and runs functions
document.addEventListener('DOMContentLoaded', function() {

    if(document.title == 'Generate Random Exercise'){
        document.getElementById('generate-exercise').addEventListener('submit',() => {
            generateWorkout();
             return false;
            })
            document.getElementById('name-workout-form').addEventListener('submit', ()=> {
                let workout = localStorage.getItem('currentWorkout');
                let workoutName = document.getElementById("workout-name-input").value;


                save_workout(workout, workoutName);
                return false;
            })
    }


    if(document.title != 'Welcome to Trainify!'){
        
        document.getElementById('mainNav').style.backgroundColor = '#000000f7';
        document.querySelector('.navbar-toggler').style.color = '#ababab';
        document.querySelector('.navbar-toggler').style.border = '1px solid #ababab';
        document.querySelector('.navbar-brand').style.color = '#ababab';
        
        let navLink = document.querySelectorAll('.nav-link');
        
        for (let i =0; i< navLink.length; i++){
            navLink[i].style.color = '#ababab';
            navLink[i].addEventListener('mouseover', ()=>{navLink[i].style.color = '#ffffff'})
            navLink[i].addEventListener('mouseleave', ()=>{navLink[i].style.color = '#ababab'})
        }
    }
        


}, false);

//function that generates a random workout based on the constraints input by the user
function generateWorkout(event){
    fetch(`/generate_workout`,{
        method: 'POST',
        body: JSON.stringify({
            group: document.getElementById('muscle-groups').value,
            duration: document.getElementById('duration').value

        })
    })
    .then(response => response.json())
    .then(workouts => {
        

        localStorage.setItem('currentWorkout', JSON.stringify(workouts))
        document.getElementById('workout-set').setAttribute("value", JSON.stringify(workouts))

        const selectedExercises = document.getElementById('selected-exercises');
        selectedExercises.innerHTML= '';
        workouts.forEach(function(w){
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
            
            const templateFunction = Handlebars.compile(exerciseTileTemplate);
            newExerciseTile.innerHTML = templateFunction({ description: w.description, url: 'https://s.yimg.com/ny/api/res/1.2/I8UXp5uksPso1horzms57g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://s.yimg.com/cd/resizer/2.0/original/psi55OfDJy_yBWyE7Y_nhsiAVMA', muscles: mainMusclesString, name: w.name, duration:w.time_to_complete});
            
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

        document.getElementById('after-workout-options').style.display = 'block';
    })
    return false;
}

//function that allows the user to save their workout after generating it
function save_workout(workout, workoutName){
    fetch(`/save_workout`,{
        method: 'POST',
        body: JSON.stringify({
            workout: JSON.parse(workout),
            name: workoutName,
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


        if (document.getElementById('save-workout-alert') != null){
            document.getElementById('save-workout-alert').remove();
        }

        if (data.message == 'Success'){
            const templateFunction = Handlebars.compile(alertTemplate);
            //alertMessage.innerHTML = templateFunction({status:'success'});
            

            

            let alert = document.createElement('div');
            alert.setAttribute('class',"alert alert-success alert-dismissible fade show");
            alert.setAttribute('role',"alert");
            alert.setAttribute('id','save-workout-alert')
            alert.innerHTML = templateFunction({status:'Success!', message:`Your workout named '${data.name}' was successfully saved.`});

            document.getElementById("name-workout").prepend(alert);
        }
        else{
            const templateFunction = Handlebars.compile(alertTemplate);

            let alert = document.createElement('div');
            alert.setAttribute('class',"alert alert-danger alert-dismissible fade show");
            alert.setAttribute('role',"alert");
            alert.innerHTML = templateFunction({status:'Error.', message:'There was an error saving your workout, please try again.'});

            document.getElementById("name-workout").prepend(alert)
        }
    })

    
}

//function that gets cookies to allow for ajax calls to use csrf token when making POST requests
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
