# Welcome to My Capstone Project: Fitness

### Description:
Hello, my capstone project, Trainify, is a web app that allows people to
generate random workouts based on their needs. The app utilizes Django and
is mobile responsive! 

>The main folders and files of the app that I worked on are in the 'capstone/exercise' directory. Within this directory you will find the 'static' folder, which contains all of the static files I utilized (such as the javascript, css and some of the assest like photos that I utilized), next is the 'templates' folder which contains all of the HTML files that are used by 'views.py', other useful files are the 'views.py' file, which is where the functionality for the backend is, the 'urls.py' file, which contains all of the views pathways that can be called, and the 'models.py' file which contains the models that are used for my database.

### Design:
>Fitness utilizes mostly bootstrap 4 to create a clean modern looking design. The index page borrows much of its design from a bootstrap template called 'Grayscale'. Using ideas from the template I was able to create a more cohesive design throughout the website. The 'Greyscale' css stylesheet is included under the file 'style.css'. For the 5,4,3,2,1 timer I modified an animation by developer 'Florin Pop'(If I am allowed to modify others animations for this let me know and I can take it out ), for the other circle timer I followed a tutorial as a base to create the updating timer position and color, and fleshed out the timer with additional features using javascript and adding other buttons such as the pause/play button using fontawesome icons.

### Front End:
>This project heavily relies on javascript for the functionality of the program. Not only does the javascript of this project handle DOM manipulation to make the page responsive, but it also utilizes AJAX calls so that the user is not constantly having to reload the page and handles the logic of the (extremely complicated for me) circle coutdown timer functionality. This includes the pause and play functionallity, counting down, reseting once the timer is at 0, counting the exercise sets and notifying the user when the timer is completely done. Many of the animations are handled by CSS keyframes.

### Back End:
>Using Django with python I was able to easily create a backend thatworked for my project. The models function of Django allowed me toeasily create entries in any of my six database tables/models andsort through them in order to send information to the frontend.

