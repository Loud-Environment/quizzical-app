List of fixes to add to the app:

1. **DONE** Add the ability to choose quiz options
   - Number of questions
   - Category
   - Difficulty
   - Type
2. **DONE** Add the ability to change quiz options after checking answers
3. **DONE** Add a loading state with animation/text while fetching
   **DONE** 3.1 Fix the "You scored 0/5 correct answers" bug — question count wasn't always 5
4. **DONE** Check responsiveness
5. **DONE** Switch fetch from .then to async/await
6. **DONE** Add happy path — was it already there?
7. **DONE** Add sad path to the fetch — show an error message and a "back to menu" button on failure
8. **DONE** Check accessibility

9. Add more accessibility:
   - Announce correct/incorrect answers for screen readers
   - aria-expanded for Show/Hide quiz options
   - aria-controls
