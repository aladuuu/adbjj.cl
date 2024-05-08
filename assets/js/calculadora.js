$(document).ready(function () {
  $("#lastExamMonthYear").datepicker({
    format: "mm/yyyy",
    startView: "months",
    minViewMode: "months",
    language: "es",
    autoclose: true,
  });
});

document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var lastExamMonthYear = document.getElementById("lastExamMonthYear").value;
    var classesPerWeek = parseInt(
      document.getElementById("classesPerWeek").value
    );
    var currentGrade = document.getElementById("currentGrade").value;

    var lastExamInput = document.getElementById("lastExamMonthYear");
    var classesPerWeekInput = document.getElementById("classesPerWeek");
    var currentGradeInput = document.getElementById("currentGrade");

    var lastExamError = document.getElementById("lastExamError");
    var classesPerWeekError = document.getElementById("classesPerWeekError");
    var currentGradeError = document.getElementById("currentGradeError");

    if (!lastExamMonthYear || !classesPerWeek || !currentGrade) {
      showErrorMessage(
        lastExamInput,
        lastExamError,
        "Por favor completa todos los campos."
      );
      showErrorMessage(classesPerWeekInput, classesPerWeekError, "");
      showErrorMessage(currentGradeInput, currentGradeError, "");
      return;
    }

    var currentDate = new Date();
    var lastExamYear = parseInt(lastExamMonthYear.split("/")[1]);
    var lastExamMonth = parseInt(lastExamMonthYear.split("/")[0]) - 1; // Meses en JavaScript son 0-indexados
    var lastExamDate = new Date(lastExamYear, lastExamMonth);
    var timeDifference = currentDate - lastExamDate;

    if (timeDifference < 0) {
      showErrorMessage(
        lastExamInput,
        lastExamError,
        "Por favor selecciona una fecha anterior o igual a la actual."
      );
      showErrorMessage(classesPerWeekInput, classesPerWeekError, "");
      showErrorMessage(currentGradeInput, currentGradeError, "");
      return;
    }

    if (classesPerWeek > 3) {
      showErrorMessage(lastExamInput, lastExamError, "");
      showErrorMessage(
        classesPerWeekInput,
        classesPerWeekError,
        "El número máximo de clases por semana es 3."
      );
      showErrorMessage(currentGradeInput, currentGradeError, "");
      return;
    }

    var weeksSinceLastExam = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24 * 7)
    );
    var totalClassesPassed = weeksSinceLastExam * classesPerWeek;

    var classesLeft = 288 - totalClassesPassed;
    if (classesLeft < 0) {
      var nextGrade = getNextGrade(currentGrade);
      document.getElementById("examMessage").innerHTML =
        "Tu próximo examen es para el grado: <span>" + nextGrade + "</span>";
      var gradeClass = nextGrade
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      document.querySelector("#examMessage > span").classList.add(gradeClass);

      var weeksOverdue = Math.abs(Math.floor(classesLeft / classesPerWeek));
      var monthsOverdue = Math.floor(weeksOverdue / 4);
      var yearsOverdue = Math.floor(monthsOverdue / 12);
      monthsOverdue = monthsOverdue % 12;

      var timeMessage = yearsOverdue > 0 ? yearsOverdue + " años y " : "";
      timeMessage += monthsOverdue + " meses";
      document.getElementById("timeUntilExam").textContent =
        "Hace " + timeMessage;
      document.getElementById("classesUntilExam").textContent = "Ninguna";
    } else {
      var nextGrade = getNextGrade(currentGrade);
      var remainingWeeks = Math.ceil(classesLeft / classesPerWeek);
      var monthsLeft = Math.floor(remainingWeeks / 4);
      var yearsLeft = Math.floor(monthsLeft / 12);
      monthsLeft = monthsLeft % 12;

      document.getElementById("examMessage").innerHTML =
        "Tu próximo examen es para el grado: <span>" + nextGrade + "</span>";
      var gradeClass = nextGrade
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      document.querySelector("#examMessage > span").classList.add(gradeClass);

      document.getElementById("timeUntilExam").textContent =
        yearsLeft + " años y " + monthsLeft + " meses";
      document.getElementById("classesUntilExam").textContent =
        classesLeft + " clases";
    }
    document.getElementById("result").style.display = "block";
  });
function getNextGrade(currentGrade) {
  switch (currentGrade) {
    case "blanco":
      return "Azul";
    case "azul":
      return "Purpura";
    case "purpura":
      return "Marrón";
    case "marrón":
      return "Negro";
    default:
      return "Negro";
  }
}
function showErrorMessage(inputElement, errorElement, message) {
  if (message) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = message;
  } else {
    inputElement.classList.remove("is-invalid");
    errorElement.textContent = "";
  }
}
