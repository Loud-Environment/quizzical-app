import React from "react";
import he from "he";
import clsx from "clsx";
import LoadingSVG from "../images/loading.svg";

export default function QuizForm({ quizOptions, setGameStarted }) {
  const [score, setScore] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [quizArray, setQuizArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newGameStarted, setNewGameStarted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  console.log(quizOptions);
  const amount =
    quizOptions.amount === "" ? 5 : `&amount=${quizOptions.amount}`;
  const category =
    quizOptions.category === "any" ? "" : `&category=${quizOptions.category}`;
  const difficulty =
    quizOptions.difficulty === "any"
      ? ""
      : `&difficulty=${quizOptions.difficulty}`;
  const type = quizOptions.type === "any" ? "" : `&type=${quizOptions.type}`;

  const amountOfQuestions = quizOptions.amount || "5";

  function shuffle(incorrectAnswersArray, correctAns) {
    const newOptionsArray = [...incorrectAnswersArray];
    const randomIndex = Math.floor(
      Math.random() * (newOptionsArray.length + 1),
    );
    newOptionsArray.splice(randomIndex, 0, correctAns);
    return newOptionsArray;
  }

  React.useEffect(() => {
    async function fetchQuiz() {
      setIsLoading(true);
      try {
        const res = await fetch(
          !quizOptions.amount
            ? "https://opentdb.com/api.php?amount=5"
            : `https://opentdb.com/api.php?amount=${quizOptions.amount}${category}${difficulty}${type}`,
        );
        if (!res.ok) {
          throw {
            message: "Something went wrong",
            statusText: res.statusText,
            status: res.status,
          };
        }
        const data = await res.json();
        setQuizArray(
          data.results.map((object, index) => ({
            id: `question-${index + 1}`,
            legend: object.question,
            options: shuffle(object.incorrect_answers, object.correct_answer),
            correctAnswer: object.correct_answer,
          })),
        );
      } catch (err) {
        if (err.status === 429) {
          setErrorMessage("Too many attempts. Wait a little and try again.");
        } else {
          setErrorMessage(`Error ${err.status}. Wait a little and try again.`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [newGameStarted]);

  console.log(quizArray);

  function handleNewGame() {
    setNewGameStarted((prev) => !prev);
  }

  function getAnswers(formData) {
    if (isSubmitted) {
      handleNewGame();
      setScore(0);
      setIsSubmitted(false);
      setSelectedAnswers({});
    } else {
      let userScore = 0;
      quizArray.forEach((q) => {
        const userAnswer = formData.get(q.id);

        if (userAnswer === he.decode(q.correctAnswer)) {
          userScore++;
        }
      });
      setScore(userScore);
      setIsSubmitted(true);
    }
  }

  function handleRadioSelect(questionID, selectedAnswer) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionID]: selectedAnswer,
    }));
  }

  return isLoading ? (
    <img src={LoadingSVG} />
  ) : errorMessage ? (
    <>
      <h1>{errorMessage}</h1>
      <button
        className="back-to-menu-btn"
        onClick={() => setGameStarted(false)}
      >
        Return to main menu
      </button>
    </>
  ) : (
    <section className="quiz">
      <form action={getAnswers}>
        {quizArray.map((q) => (
          <fieldset key={q.id}>
            <legend>{he.decode(q.legend)}</legend>
            <div>
              {q.options.map((opt, index) => {
                const inputID = `${q.id}-option${index + 1}`;
                const isThisInputChecked =
                  selectedAnswers[q.id] === he.decode(opt);
                return (
                  <React.Fragment key={inputID}>
                    <input
                      className="radio-input"
                      type="radio"
                      id={inputID}
                      name={q.id}
                      value={he.decode(opt)}
                      disabled={isSubmitted}
                      onChange={() => {
                        handleRadioSelect(q.id, he.decode(opt));
                      }}
                      checked={isThisInputChecked}
                    />
                    <label
                      className={clsx({
                        answer: !isSubmitted,
                        correct: isSubmitted && opt === q.correctAnswer,
                        wrong:
                          isSubmitted &&
                          isThisInputChecked &&
                          he.decode(opt) !== he.decode(q.correctAnswer),
                      })}
                      htmlFor={inputID}
                    >
                      {he.decode(opt)}
                    </label>
                  </React.Fragment>
                );
              })}
            </div>
            <hr />
          </fieldset>
        ))}
        <div className="result-section">
          {isSubmitted && (
            <span>
              You scored {score}/{amountOfQuestions} correct answers
            </span>
          )}
          <button onClick={() => setGameStarted(false)}>
            Return to main menu
          </button>
          <button type="submit">
            {!isSubmitted
              ? "Check answers"
              : isLoading
                ? "Loading quiz"
                : "Play again"}
          </button>
        </div>
      </form>
    </section>
  );
}
