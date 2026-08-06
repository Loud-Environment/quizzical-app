import QuizForm from "./components/quiz-form.jsx";
import QuizOptions from "./components/quiz-options.jsx";
import { useState, useEffect } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [quizOptions, setQuizOptions] = useState({ default: "default" });

  function handleStart() {
    setGameStarted((prev) => true);
  }

  function getOptions(formData) {
    const amount = formData.get("trivia_amount");
    const category = formData.get("trivia_category");
    const difficulty = formData.get("trivia_difficulty");
    const type = formData.get("trivia_type");
    setQuizOptions({
      amount,
      category,
      difficulty,
      type,
    });
  }

  return (
    <main>
      {!gameStarted && (
        <section className="start-menu">
          <h1>Quizzical</h1>
          <QuizOptions getOptions={getOptions} />
          <button type="submit" onClick={handleStart}>
            Start quiz
          </button>
        </section>
      )}
      {gameStarted && <QuizForm quizOptions={quizOptions} />}
    </main>
  );
}
