import React from "react";
import { shuffle } from "../utils/helpers";

export default function useQuiz(quizOptions) {
  const [quizArray, setQuizArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newGameStarted, setNewGameStarted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    async function fetchQuiz({ amount, category, difficulty, type }) {
      setIsLoading(true);

      const params = new URLSearchParams({
        amount,
        ...(category !== "any" && { category }),
        ...(difficulty !== "any" && { difficulty }),
        ...(type !== "any" && { type }),
      });

      try {
        console.log(`https://opentdb.com/api.php?${params}`);
        const res = await fetch(`https://opentdb.com/api.php?${params}`);

        if (!res.ok) {
          throw {
            message: "Something went wrong",
            statusText: res.statusText,
            status: res.status,
          };
        }

        const data = await res.json();
        console.log(data);

        if (data.response_code === 1) {
          throw {
            message:
              "Could not return results. The API doesn't have enough questions for your query",
            statusText: "No Results",
            status: 1,
          };
        }

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
        } else if (err.status === 1) {
          setErrorMessage(
            "Please choose less questions. The API doesn't have enough questions for your quiz.",
          );
        } else {
          setErrorMessage(`Error ${err.status}. Wait a little and try again.`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz(quizOptions);
  }, [newGameStarted]);

  return {
    quizArray,
    isLoading,
    newGameStarted,
    setNewGameStarted,
    errorMessage,
  };
}
