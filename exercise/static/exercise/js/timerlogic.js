//Handlebars template so that the timer can be refreshed after each workout set
const currentExerciseTemplate = `

<div class="bg-light" id='current-exercise-top' style= 'display: block'>
  <h1>{{name}}:</h1>
  <h2>{{setNumber}}/{{totalSets}}</h2>
  <div id='rest-notification'>
    <h3>REST!</h3>
  </div>
  
</div>

<div class="projects-section bg-light" id="circle-timer">
  <input type="hidden" id="start"/><br/>
  <input type="hidden" id="stop"/><br/>
  <input type="hidden" id="diff"/><br/>
  <h2 id='done'>ALL DONE! :)</h2>

  <div id="app" class="app">
      <div class="base-timer">
          <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
              <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
              <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining green"
                d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
              ></path>
            </g>
          </svg>
          <span id="base-timer-label" class="base-timer__label">
              <div id='time-display'>

              </div>
              <br>
              <div id="pause-button" style="position: absolute; top:60%">
                  <button id="btnStart" type="button" style="display: none;" >
                      <i class="fa fa-play"></i>
                  </button>
                  <button id="btnStop" type="button">
                      <i class="fa fa-pause"></i>
                  </button>
              </div>

          </span>
        </div>
  </div>
</div>

<div class="bg-light" id='current-exercise-bottom' >
  <div class="jumbotron">
    <p class="lead"><b>Description:</b>{{description}}</p>
    <hr class="my-4">
    Examples
    <!--Carousel Wrapper-->
    <div id="video-carousel-example" class="carousel slide carousel-fade" >
      <!--Indicators-->
      <ol class="carousel-indicators">
        <li data-target="#video-carousel-example" data-slide-to="0" class="active"></li>
        <li data-target="#video-carousel-example" data-slide-to="1"></li>
        <li data-target="#video-carousel-example" data-slide-to="2"></li>
      </ol>
      <!--/.Indicators-->
      <!--Slides-->
      <div class="carousel-inner" role="listbox">
        <div class="carousel-item active">
            <div id='video'>
                <iframe width='10%' class='video-fluid' src="https://www.youtube.com/embed/aclHkVaku9U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>                 
        </div>
        <div class="carousel-item">
            <img class="video-fluid" src='https://blog.paleohacks.com/wp-content/uploads/2015/06/Butt_Exercise_2.gif'>
        </div>
        <div class="carousel-item">
          <video class="video-fluid" autoplay loop muted>
            <source src="https://mdbootstrap.com/img/video/Agua-natural.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <!--/.Slides-->
      <!--Controls-->

      <!--/.Controls-->
    </div>
    <!--Carousel Wrapper-->     
  </div>
</div>

                                `


var start,
    stop,
    pause,
    timeElapsed,
    timeLimit,
    refreshIntervalId,
    setNumber,
    restTime,
    totalResets,
    exerciseNum,
    elStart=document.getElementById("start"),
    elStop=document.getElementById("stop"),
    elDiff=document.getElementById("diff"),
    elBtnStart=document.getElementById("btnStart");
    elBtnStop=document.getElementById("btnStop");

const endOfSet = new Event('endOfSet');
const endOfEx = new Event('endOfExercise');
const endOfWork = new Event('endOfWorkout');
const endOfRest = new Event('endOfRest');



restTime= 1000*60;
totalResets= 0;

const FULL_DASH_ARRAY = 283;

//Values for timers color threshold at certain ratios ie .5 == 50% of the way there   
const WARNING_THRESHOLD = .5;
const ALERT_THRESHOLD = .75;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let remainingPathColor = COLOR_CODES.info.color;


timeLimit = 60*1000;
let prev = 0
var refreshIntervalId = window.setInterval(startTimer,97);
clearInterval(refreshIntervalId);

//beginning animation variables
const nums = document.querySelectorAll('.nums span');
const counter = document.querySelector('.counter');
const finalMessage = document.querySelector('.final');
const repl = document.getElementById('replay');
runStartAnimation();


//initially starts the timer
function startTimer(){
    stop=Date.now();

    timeElapsed = (stop-start) + prev;
     
    elStop.value=stop;
    elDiff.value=formatTime(secs2Time((timeLimit - timeElapsed)));
    if (timeElapsed >= timeLimit){
        clearInterval(refreshIntervalId);
        elDiff.value=formatTime(secs2Time(0))
        
        prev = 0;
        start=Date.now();

        if (totalResets%2 == 0){
          
          document.dispatchEvent(endOfSet);

        }
        else{
          setNumber += 1;
          if(setNumber == 4){
            document.dispatchEvent(endOfSet);
            document.getElementById('rest-notification').style.display = 'none';
          }
          else{
            document.dispatchEvent(endOfRest);
          }    
        }
        
        totalResets += 1;
      
    }
    else{
        setCircleDasharray();
        setRemainingPathColor(timeElapsed);
        document.getElementById("base-timer-path-remaining").className = `base-timer__path-remaining ${remainingPathColor}`;
        document.getElementById('time-display').innerHTML = `${formatTime(secs2Time((timeLimit - timeElapsed)))}`;
        document.getElementById('start').value = `Start: ${start}`;
        document.getElementById('stop').value = `Stop: ${stop} `;
        document.getElementById('diff').value = `Diff: ${formatTime(secs2Time((timeLimit - timeElapsed)))} t.e: ${prev}`;
    }
}

//formats the time on timer to a standard format
function formatTime(obj){
    var x=[];
    var y=[];
    x.push(obj.m);
    x.push(obj.s);
    x = x.join(':')
    y.push(x)
    y.push(obj.ms)
    return y.join('.')
}

//converts ms into readable form 
function secs2Time(ms) {
    
    var secs = ms/1000;
    var minutes = Math.floor(secs / 60);
    var seconds = Math.floor(secs % 60);
    ms = Math.trunc((ms%1000)/100)
    var obj = {
    "m": minutes.toString().length === 1 ? '0' + minutes : minutes,
    "s": seconds.toString().length === 1 ? '0' + seconds : seconds,
    "ms": ms.toString()
    };
    
    return obj;
}

//calculates percentage of time passed in order to update the dash array graphic
function calculateTimeFraction() {
    const rawTimeFraction = timeElapsed / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}  

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
    const circleDasharray = `${(
      FULL_DASH_ARRAY - (calculateTimeFraction() * FULL_DASH_ARRAY)
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
}

//keeps track of time elapsed and changes the ring color of the time accordingly
function setRemainingPathColor(timeElapsed) {
    const { alert, warning, info } = COLOR_CODES;
    let ratio = timeElapsed/timeLimit

    // If the remaining time is less than or equal to 25%, change to red.
    if (ratio >= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
  
    // If the remaining time is less than or equal to 50%, change to yellow.
    } else if (ratio >= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
}


//////////////////////////////////////////////////////////////////
//logic for the countdown timer graphic at the beginning of the workout
function runStartAnimation() {
    nums.forEach((num, idx) => {
        const penultimate = nums.length - 1;
        num.addEventListener('animationend', (e) => {
            if(e.animationName === 'goIn' && idx !== penultimate){
                num.classList.remove('in');
                num.classList.add('out');
            } else if (e.animationName === 'goOut' && num.nextElementSibling){
                num.nextElementSibling.classList.add('in');
            } else {
                counter.classList.add('hide');
                finalMessage.classList.add('show');
            }
        });
    });
    

    document.addEventListener('animationend', (e) => {
            console.log(e.animationName)

            
            if (e.animationName === 'hide'){

              finalMessage.classList.remove('show');
              finalMessage.classList.add('hide');
              finalMessage.classList.add('start');

              console.log('Hello 2')
              exerciseNum = 0;
              var workout = JSON.parse(localStorage.getItem('currentWorkout'));
              refreshIntervalId = window.setInterval(startTimer,97);
              
              
              setNumber = 1;
              
              createTimer(workout);
              console.log(workout);
            
              start=Date.now();   
              elStart.value=start;
              elBtnStop.addEventListener('click', pause, false)
              elBtnStart.addEventListener('click',play,false);


              // Listens for the end of the set and resets the timer according to where you are in the workout.
              document.addEventListener('endOfSet', function (e) {

                
                prev = 0;
                timeElapsed = 0; 
                if(setNumber <= 3) {
                  
                  prev = 0;
                  refreshIntervalId = window.setInterval(startTimer,97);
                  start=Date.now();    
                  elStart.value=start;
                  timeLimit = 60000;

                  

                }
                else{
                  console.log(2)
                  if (exerciseNum == workout.length ){
                    console.log('workout over!')
                    clearInterval(refreshIntervalId);
                    document.getElementById('app').style.display = 'none';
                    document.getElementById('done').style.display = 'block';  
                  }
                  else{
                    exerciseNum += 1;
                    setNumber = 1;
                    console.log('here')
                    createTimer(workout);
                    prev = 0;
                    refreshIntervalId = window.setInterval(startTimer,97);
                    elBtnStop.addEventListener('click', pause, false)
                    elBtnStart.addEventListener('click',play,false);
                    
                  }   
                }
                document.getElementById('rest-notification').style.display = 'block';
              }, false);

              document.addEventListener('endOfRest', function(){
                prev = 0;
                timeElapsed = 0;
                createTimer(workout);


                refreshIntervalId = window.setInterval(startTimer,97);
                elBtnStop.addEventListener('click', pause, false)
                elBtnStart.addEventListener('click',play,false);
                
                document.getElementById('rest-notification').style.display = 'none';
                console.log('End of Rest')
              })

            }        
    });
}



//creates Timer Element
function createTimer(workout){
    
  let pageBody = document.getElementById('body-container');
  let templateFunction = Handlebars.compile(currentExerciseTemplate);
    
  prev = 0;  
  pageBody.innerHTML = '';
  timeLimit = (((workout[exerciseNum].time_to_complete)-3)/3)*20000;
  
  
  let timer = document.createElement('div');
  timer.setAttribute('id','timer-container');
  
  
  
  timer.innerHTML = templateFunction({ description: workout[exerciseNum].description, setNumber: setNumber , totalSets: '3' , name: workout[exerciseNum].name});
     
  pageBody.appendChild(timer);
  document.getElementById('time-display').innerHTML = `${formatTime(secs2Time((timeLimit)))}`;
  //document.getElementById('time-debugger').innerHTML = `Time Debugger start:${start}stop:${stop}`;
  elBtnStart=document.getElementById("btnStart");
  elBtnStop=document.getElementById("btnStop");
}


//function to pause the timer
function pause(){
  clearInterval(refreshIntervalId); 
   
  elBtnStop.style.display = 'none'; 
  elBtnStart.style.display = 'block'; 
  prev = timeElapsed; 
  
}

//function to play the timer after pausing
function play(){
  timeElapsed=0;
  start=Date.now();
  refreshIntervalId = window.setInterval(startTimer,97);
   
  elBtnStop.style.display = 'block'; 
  elBtnStart.style.display = 'none';
}