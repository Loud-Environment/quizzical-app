import React from "react";
import he from "he";
import clsx from "clsx";

export default function QuizForm(props) {
  const [score, setScore] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});

  console.log(props.quizArray);

  function getAnswers(formData) {
    if (isSubmitted) {
      props.handleNewGame();
      setScore(0);
      setIsSubmitted(false);
      setSelectedAnswers({});
    } else {
      let userScore = 0;
      props.quizArray.forEach((q) => {
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

  return (
    <section className="quiz">
      <form action={getAnswers}>
        {props.quizArray.map((q) => (
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
          {isSubmitted && <span>You scored {score}/5 correct answers</span>}
          <button type="submit">
            {!isSubmitted
              ? "Check answers"
              : props.isLoading
                ? "Loading quiz"
                : "Play again"}
          </button>
        </div>
      </form>
    </section>
  );
}
