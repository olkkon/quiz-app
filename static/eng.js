const correct = document.querySelectorAll("#answerOptions .true");

if (correct.length == 0) {
  document.querySelector("#warning").innerHTML =
    "You don't currently have a correct answer. Consider adding one!<br/><br/>";
}
