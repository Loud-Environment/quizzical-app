import QuizForm from "./components/quiz-form.jsx";
import { useState, useEffect } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [newGameStarted, setNewGameStarted] = useState(false);
  const [quizArray, setQuizArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function shuffle(incorrectAnswersArray, correctAns) {
    const newOptionsArray = [...incorrectAnswersArray];
    const randomIndex = Math.floor(
      Math.random() * (newOptionsArray.length + 1),
    );
    newOptionsArray.splice(randomIndex, 0, correctAns);
    return newOptionsArray;
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple",
    )
      .then((res) => res.json())
      .then((data) => {
        setQuizArray(
          data.results.map((object, index) => ({
            id: `question-${index + 1}`,
            legend: object.question,
            options: shuffle(object.incorrect_answers, object.correct_answer),
            correctAnswer: object.correct_answer,
          })),
        );
        setIsLoading(false);
      });
  }, [newGameStarted]);

  function handleStart() {
    setGameStarted((prev) => true);
  }

  function handleNewGame() {
    setNewGameStarted((prev) => !prev);
  }

  return (
    <main>
      {!gameStarted && (
        <section className="start-menu">
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button
            className={!isLoading && "active"}
            onClick={handleStart}
            disabled={isLoading}
          >
            {isLoading ? "Loading quiz" : "Start quiz"}
          </button>
        </section>
      )}
      {gameStarted && (
        <QuizForm
          quizArray={quizArray}
          gameStarted={gameStarted}
          handleNewGame={handleNewGame}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}

/* 
  Порядок работы приложения:
  1) Грузится интро с кнопкой, в это же время отправляется запрос API и формируется 
  массив для рендера следующей страницы
  2) При нажатии кнопки Start Quiz игр
  начинается и рендерится компонент QuizForm, который получает массив вопросов и ответов
  3) В компоненте QuizForm рендерятся вопросы и варианты ответов, пользователь выбирает ответы
  4) При отправке формы через кнопку Check Answers вызывается функция getAnswers,
  которая получает выбранные пользователем ответы
  и сравнивает их с правильными ответами из массива correctAnswers, 
  который был сохранен в состоянии App
  5) Результаты сравнения отображаются пользователю в виде количества правильных ответов 
  и появляется кнопка Play Again, которая при нажатии сбрасывает состояние и 
  позволяет начать игру заново
  6) Игра продолжается, пока пользователь не решит выйти из приложения или не закроет его

*/
