import QuizForm from "./src/components/quiz-form.jsx";
import QuizOptions from "./src/components/quiz-options.jsx";
import { useState, useEffect } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [quizOptions, setQuizOptions] = useState({});

  function handleStart() {
    setGameStarted((prev) => true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
    handleStart();
  }

  return (
    <main>
      {!gameStarted && (
        <section className="start-menu">
          <h1>Quizzical</h1>
          <QuizOptions handleSubmit={handleSubmit} />
        </section>
      )}
      {gameStarted && (
        <QuizForm quizOptions={quizOptions} setGameStarted={setGameStarted} />
      )}
    </main>
  );
}
