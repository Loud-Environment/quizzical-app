import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { quizCategories } from "../constants/quizCategories";

export default function QuizOptions({ handleSubmit }) {
  const [optionsShown, setOptionsShown] = React.useState(false);

  return (
    <form className="form-api" onSubmit={handleSubmit}>
      <button
        onClick={() => {
          setOptionsShown((prev) => !prev);
        }}
        className="options-header"
        type="button"
        aria-expanded={optionsShown}
      >
        {!optionsShown ? "Show quiz options" : "Hide quiz options"}
        {!optionsShown ? <IoIosArrowDown /> : <IoIosArrowUp />}
      </button>
      {optionsShown ? (
        <>
          <label className="trivia_amount_class" htmlFor="trivia_amount">
            Number of Questions (1-10)
          </label>
          <input
            type="number"
            id="trivia_amount"
            name="trivia_amount"
            placeholder="5"
            min="1"
            max="10"
            defaultValue="5"
            className="form-control"
          />
          <label htmlFor="trivia_category">Select Category: </label>
          <select name="trivia_category" className="form-control">
            {quizCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor="trivia_difficulty">Select Difficulty: </label>
          <select name="trivia_difficulty" className="form-control">
            <option value="any">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <label htmlFor="trivia_type">Select Type: </label>
          <select name="trivia_type" className="form-control">
            &gt;
            <option value="any">Any Type</option>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </>
      ) : null}
      <button type="submit" className="options-submit">
        Start quiz
      </button>
    </form>
  );
}
