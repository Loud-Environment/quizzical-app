import React from "react";
import he from "he";
import clsx from "clsx";
import LoadingSVG from "../../images/loading.svg";
import useQuiz from "../hooks/useQuiz";

export default function QuizForm({ quizOptions, setGameStarted }) {
  const [score, setScore] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const {
    quizArray,
    isLoading,
    newGameStarted,
    setNewGameStarted,
    errorMessage,
  } = useQuiz(quizOptions);

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
    <img src={LoadingSVG} alt="Loading quiz" />
  ) : errorMessage ? (
    <div className="error-message-container" role="alert">
      <h1>Something went wrong</h1>
      <p>{errorMessage}</p>
      <button
        className="back-to-menu-btn"
        onClick={() => setGameStarted(false)}
      >
        Return to main menu
      </button>
    </div>
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
            <p role="status" aria-live="polite">
              You scored {score} out of {quizOptions.amount} correct answers.
            </p>
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
