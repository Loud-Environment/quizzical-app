export function shuffle(incorrectAnswersArray, correctAns) {
  const newOptionsArray = [...incorrectAnswersArray];
  const randomIndex = Math.floor(Math.random() * (newOptionsArray.length + 1));
  newOptionsArray.splice(randomIndex, 0, correctAns);
  return newOptionsArray;
}
