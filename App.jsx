import QuizForm from "./components/quiz-form.jsx";
import QuizOptions from "./components/quiz-options.jsx";
import { useState, useEffect } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [quizOptions, setQuizOptions] = useState({ default: "default" });
  const [saved, setSaved] = useState(false);

  function handleStart() {
    setGameStarted((prev) => true);
  }

  function handleSumbit(e) {
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main>
      {!gameStarted && (
        <section className="start-menu">
          <h1>Quizzical</h1>
          <QuizOptions
            handleSumbit={handleSumbit}
            setSaved={setSaved}
            saved={saved}
          />
          <button type="submit" onClick={handleStart}>
            Start quiz
          </button>
        </section>
      )}
      {gameStarted && (
        <QuizForm quizOptions={quizOptions} setGameStarted={setGameStarted} />
      )}
    </main>
  );
}
