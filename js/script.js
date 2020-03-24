let preQuestions = [
    {
        category: "Entertainment: Music",
        type: "multiple",
        difficulty: "medium",
        question:
            "The song &quot;Twin Size Mattress&quot; was written by which band?",
        correct_answer: "The Front Bottoms",
        answers: [
            "The Front Bottoms",
            "Twenty One Pilots",
            "The Wonder Years",
            "The Smith Street Band"
        ]
    }
];

fetch("https://quiztai.herokuapp.com/api/quiz")
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(0);
    });

let next = document.querySelector(".next");
let previous = document.querySelector(".previous");

let question = document.querySelector(".question");
let answers = document.querySelectorAll(".list-group-item");

let pointsElem = document.querySelector(".score");
let restart = document.querySelector(".restart");
let list = document.querySelector(".list");
let results = document.querySelector(".results");
let userScorePoint = document.querySelector(".userScorePoint");
let average = document.querySelector(".average");
let index = 0;
let points = 0;

activateAnswers();

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener("click", doAction);
    }
}

function setQuestion(index) {
    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];
    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = "none";
        answers[3].style.display = "none";
    } else {
        answers[2].style.display = "block";
        answers[3].style.display = "block";
    }
}

next.addEventListener("click", function(event) {
    index++;
    if (index >= preQuestions.length) {
        list.style.display = "none";
        results.style.display = "block";
        userScorePoint.innerHTML = points;

        getDataFromLocalStorage();
    } else {
        setQuestion(index);
        activateAnswers();
        removeClassname();
    }
});

function removeClassname() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove("correct");
        answers[i].classList.remove("incorrect");
    }
}

function getDataFromLocalStorage() {
    let playCount = JSON.parse(localStorage.getItem("playCount"));
    let sumOfPoints = JSON.parse(localStorage.getItem("sumOfPoints"));

    playCount += 1;
    sumOfPoints += points;
    avgPoints = sumOfPoints / playCount;

    average.innerHTML = avgPoints;

    localStorage.setItem("avgPoints", avgPoints);
    localStorage.setItem("playCount", playCount);
    localStorage.setItem("sumOfPoints", sumOfPoints);
}

previous.addEventListener("click", function(event) {
    if (index > 0) {
        index--;
        setQuestion(index);
    }
});

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

restart.addEventListener("click", function(event) {
    event.preventDefault();

    index = 0;
    points = 0;

    userScorePoint.innerHTML = points;
    setQuestion(index);
    removeClassname();
    activateAnswers();
    list.style.display = "block";
    results.style.display = "none";
});

function markCorrect(target) {
    target.classList.add("correct");
}

function markInCorrect(target) {
    target.classList.add("incorrect");
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener("click", doAction);
    }
}
