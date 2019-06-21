// require('config.js');

(function () {
      if (!window.assignments) return;
      if (!window.useGoals) return;
      var assignment = window.assignments[window.assignmentID];
      if (!assignment) return;
      var goals = assignment.goals;
      if (!goals || !goals.length) return;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'goals/goals.html', true);
      xhr.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return;
            var goalBar = document.getElementById('goalbar');
            goalBar.innerHTML = this.responseText;
            document.getElementById('world').style.height = "calc(100% - " + goalBar.offsetHeight + "px)";
            window.goalBar = new GoalBar(assignment);
      };
      xhr.send();
})();

function GoalBar(assignment) {

      function copy(obj) {
            return JSON.parse(JSON.stringify(obj));
      }

      var assignmentObjectives = assignment.goals;
      document.getElementById("assignmentChosen").innerHTML = assignment.name;

      /* Trace logger for database*/
      function log(message, data) {
            Trace.log(message, data);
      }
      /* when the page first loads, want to record that a Subgoal has been started*/
      log("Subgoal.started");
      /* end Logger setup ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

      /* start Assignment setup /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
      /* constructing objectives */

      /* the current objective that the player is trying to complete */
      var currentObjective;
      /* variables related to progress bar */
      var bar = document.querySelector(".bar-fill");
      /* variable for all objective buttons*/
      var buttonsHide = document.querySelectorAll(".aButton");
      /* the finished objective and choose different objective buttons*/
      var chooseButtons = document.querySelectorAll(".switchButtons");
      /* the congratulations text */
      var congratulations = document.getElementById("Congratulations");
      congratulations.innerHTML = "Objectives complete! When you're finished, export your project. Click <a href='logging/assignment.html' target='_blank'>here</a> to select a new assignment.";
      /* all the buttons including objectives, finished objective, and choose different objective buttons*/
      var theButtons = document.querySelector(".theButtons");
      /* array of objective buttons*/
      var objectiveButtons = document.querySelectorAll(".aButton input");
      /* array of objective buttons, there is a objective Buttons 2 for css reasons*/
      var objectiveButtons2 = document.querySelectorAll(".theInput");
      /* the div element of the objective buttons*/
      var objectiveButtons3 = document.querySelectorAll(".aButton");

      var instructions = document.getElementById("instructions");

      /* end Assignment setup /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

      /* fill the progress bar when objective has been completed */
      function fillProgressBar() {
            var countCompleted = assignmentObjectives.filter(function (objective) {
                  return objective.isCompleted;
            }).length;

            var percent = 100 * countCompleted / assignmentObjectives.length;
            bar.style.width = percent + "%";

      }

      /* traverses the assignmentObjectives array and determines which objectives to show and not show based on whether assignment has been completed and prerequisites have been met */
      function toUpdateObjectives() {
            var count = 0;
            /** while count is less than the amount of objectives and the objective buttons of which 4 can be shown at at time */
            for (var arrayCount = 0; arrayCount < assignmentObjectives.length && count < objectiveButtons.length; arrayCount++) {
                  var objective = assignmentObjectives[arrayCount];
                  // if objective is completed, check the next objective
                  if (objective.isCompleted) {
                        continue;
                  }
                  /* check to see if prerequisites have been met for specific objective */
                  if (objective.prerequisites.length > 0) {
                        var met = true;
                        for (var i = 0; i < objective.prerequisites.length; i++) {
                              /** if prerequisites not met break out of loop*/
                              if (!assignmentObjectives.some(function (prereqObjective) {
                                    return prereqObjective.isCompleted && prereqObjective.title == objective.prerequisites[i];

                              })) {

                                    met = false;
                                    break;
                              }
                        }
                        // if prerequisites have not been met, check next objective because objectives can only be shown if prerequisites have been met.
                        if (!met) {
                              continue;
                        }
                  }
                  /** if objective has not been completed and prerequisites have been met, then show the objective and increase count*/
                  buttonsHide[count].style.display = "";
                  objectiveButtons[count++].value = objective.title;
            }

            // hide the remaining objectives
            for (; count < objectiveButtons.length; count++) {
                  buttonsHide[count].style.display = "none";
            }

            /* hide the choose different objective and finished objective buttons*/
            for (var k = 0; k < chooseButtons.length; k++) {
                  chooseButtons[k].style.display = "none";
            }
            /* choose different objective and finished objective call update objective and so currentObjective has to be set to null. currentObjective is set in chooseObjective */
            currentObjective = null;
            theButtons.className = "theButtons";
            for (var q = 0; q < objectiveButtons2.length; q++) {
                  objectiveButtons2[q].className = "theInput";
                  objectiveButtons2[q].style.pointerEvents = 'auto';
            }
            for (var y = 0; y < objectiveButtons3.length; y++) {
                  objectiveButtons3[y].className = "aButton";
            }

            var finished = assignmentObjectives.every(function (objective) {
                  return objective.isCompleted;
            });
            congratulations.style.display = finished ? "initial" : "";
            instructions.innerHTML = finished ? "" : "Choose an objective:";
            updateChecks();
            fillProgressBar();
      }


      /* used only in the special case when there is only 1 objective left, this function is called in chooseObjective */
      function updateButtons2() {
            var count = 0;
            for (var i = 0; i < assignmentObjectives.length && count <= 2; i++) {
                  if (!assignmentObjectives[i].isCompleted) {
                        count++;
                  }
            }
            if (count == 1 && currentObjective != null) {
                  for (var i = 0; i < 5; i++) {
                        buttonsHide[i].style.display = "none";
                  }
                  buttonsHide[5].style.display = "";
            }
      }

   function updateChecks(){
      var metPrerequisites = true;
      document.getElementById("assignmentTitle").innerHTML = assignment.name;
      var table = document.getElementById("objectivesTable");
      table.innerHTML = "";
      var createChild = function(parent, tag, html, clazz) {
            var element = document.createElement(tag);
            if (html) element.innerHTML = html;
            if (clazz) element.classList.add(clazz);
            if (parent) parent.appendChild(element);
            return element;
      };

      var header = createChild(table, "tr");
      createChild(header, "th", "Objective");
      createChild(header, "th", "Description");
      createChild(header, "th", "Complete", "progressCheck");

      /** update available objectives*/
      for (var i = 0; i < assignmentObjectives.length; i++){
         var objective = assignmentObjectives[i];
         metPrerequisites = true;
         for(var c = 0; c < objective.prerequisites.length; c++){
            if(!assignmentObjectives.some(function (prereqs){
               return prereqs.isCompleted && prereqs.title == objective.prerequisites[c];
            })){
               metPrerequisites = false;
               break;
            }
         }

         var row = createChild(table, "tr");
         var textColor = metPrerequisites ? "black" : "#E4E1E2";
         var checkColor = objective.isCompleted ? "rgb(150,174,58)" : "#E4E1E2";

         createChild(row, "td", objective.title).style.color = textColor;
         createChild(row, "td", objective.description).style.color = textColor;
         createChild(row, "td", "<i class=\"fa fa-check fa-2x\"></i>", "progressCheck").style.color = checkColor;
      }
   }

      /** for loading and saving the state of the nav bar */
      this.saveState = function () {
            var currentState = {
                  allObjectives: assignmentObjectives
            }
            var state = copy(currentState);
            return state;
      }


      this.loadState = function (state) {
            state = copy(state);
            log("Subgoal.loadState", state);
            assignmentObjectives = state.allObjectives;
            toUpdateObjectives();
      }

      /* user has choosen to go back to list of objectives and select a new objective*/
      this.chooseDifferentObjective = function() {
            log("Subgoal.chooseDifferentObjective", currentObjective.title);
            toUpdateObjectives();

      }

      /* attached to the Finished Objective button, sets current objective to completed and pushes objective to the completedAssignmentObjectives array, updates progress bar, calls the toUpdateObjectives function */
      this.finishedObjective = function() {
            log("Subgoal.finished", currentObjective.title);
            currentObjective.isCompleted = true;
            toUpdateObjectives();
      }

      /* function for the objective buttons: hides objective buttons, displays the FINISHED OBJECTIVE button and the CHOOSE OBJECTIVE button, and displays description text */
      this.chooseObjective = function(ele) {
            var id = ele.id;
            var title = document.getElementById(id).value;
            log("Subgoal.selected", title);
            var description = document.getElementById(id);
            var parentEl = document.getElementById(id).parentElement;
            var theButtonSelected = document.getElementById(id);
            document.getElementById(id).style.pointerEvents = 'none';
            for (var i = 0; i < assignmentObjectives.length; i++) {
                  if (assignmentObjectives[i].title == title) {
                        /* set the currentObjective variable to the objective the user selected */
                        currentObjective = assignmentObjectives[i];
                        description.value = assignmentObjectives[i].description;
                        instructions.innerHTML = "Click the check when finished.";
                        /* hide objective buttons and display the FINISHED OBJECTIVE button and the CHOOSE OBJECTIVE button*/
                        for (var i = 0; i < 4; i++) {
                              buttonsHide[i].style.display = "none";
                        }
                        /* unhide the button that was selected */
                        parentEl.style.display = "";
                        for (var q = 0; q < objectiveButtons2.length; q++) {
                              objectiveButtons2[q].className = "aButtonAlternative";
                        }
                        for (var y = 0; y < objectiveButtons3.length; y++) {
                              objectiveButtons3[y].className = "widthAdjust";
                        }
                        /* unhide the choose different objective and finished objective buttons*/
                        chooseButtons[0].style.display = "";
                        chooseButtons[1].style.display = "";
                        /* do not need to iterate through the rest of the array */
                        break;
                  }
            }
      }

      this.assignmentObjectives = assignmentObjectives;

      // Project Data saving / loading
      var myself = this;
      var originalState = this.saveState();
      var oldGet = IDE_Morph.prototype.getProjectData;
      IDE_Morph.prototype.getProjectData = function() {
            var data = oldGet.call(this);
            data.assignmentID = window.assignmentID;
            data.goals = myself.saveState();
            return data;
      };

      var oldSet = IDE_Morph.prototype.setProjectData;
      IDE_Morph.prototype.setProjectData = function(data) {
            oldSet.call(this, data);
            if (!this.projectData) return;
            var assignmentID = this.projectData.assignmentID;
            var goals = this.projectData.goals;
            if (!goals || (assignmentID && assignmentID != window.assignmentID)) {
                  goals = originalState;
            }
            myself.loadState(goals);
      }

      var oldCodeChanged = Trace.onCodeChanged;
      var objectivesFlashing = false;
      Trace.onCodeChanged = function(code) {
		if (oldCodeChanged) oldCodeChanged(code);
            if (!objectivesFlashing && !currentObjective) {
                  objectivesFlashing = true;
                  for (var i = 0; i < objectiveButtons.length; i++) {
                        objectiveButtons[i].classList.add("highlight");
                        instructions.classList.add("highlight");
                  }
                  setTimeout(function() {
                        objectivesFlashing = false;
                        for (var i = 0; i < objectiveButtons.length; i++) {
                              objectiveButtons[i].classList.remove("highlight");
                              instructions.classList.remove("highlight");
                        }
                  }, 500);
            }
	  }

      var checkButton = document.getElementById("button6");
      setInterval(function() {
            if (!currentObjective) return;
            checkButton.classList.add("highlight");
            setTimeout(function() {
                  checkButton.classList.remove("highlight");
            }, 800);
      }, 4000)

      toUpdateObjectives();

      if (window.world && window.world.useFillPage) {
            window.world.fillPage();
      }
}

function showModal() {
      document.getElementById('openModal').classList.add('showing');
      Trace.log('Subgoal.showModal');
}

function hideModal() {
      document.getElementById('openModal').classList.remove('showing');
      Trace.log('Subgoal.hideModal');
}