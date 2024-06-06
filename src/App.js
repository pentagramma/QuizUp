import './App.css';
import { FaAngleLeft, FaAngleRight, FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineReplay } from "react-icons/md";

import { useEffect, useState } from 'react';


function App() {

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timer, setTimer] = useState(null);
  const [answers, setAnswers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState("ANSWER");
  const [checkCorrect, setCheckCorrect] = useState("");
  const [wonQuestions, setWonQuestions] = useState(0);
  const [lostQuestions, setLostQuestions] = useState(0);

  const handleReplayQuiz = () => {
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setTimer(null);
    setAnswers([]);
    setIsLoading(true);
    setCorrectAnswer("ANSWER");
    setCheckCorrect("");
    setWonQuestions(0);
    setLostQuestions(0);
    fetchQuestions();
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const URL = "https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple";

  const fetchQuestions = async () => {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
        throw new Error('No valid data received');
      }

      const shuffledAnswers = data.results.map(question => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        return shuffleArray(answers);
      });
      setQuestions(data.results);
      setAnswers(shuffledAnswers);
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
    setCorrectAnswer("ANSWER");
    setCheckCorrect("");
  };


  // const handlePrevQuestion = () => {
  //   setQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  // };

  const handleAnswer = (selectedAnswer) => {

    if (questionIndex)
      clearTimeout(timer);
    const currentQuestion = questions[questionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1);
      setSelectedAnswer(selectedAnswer);
      setCheckCorrect(<FaCheck />);
      setWonQuestions((prevWon) => prevWon + 1);

    } else {

      setCheckCorrect(<RxCross2 />);
      setLostQuestions((prevLost) => prevLost + 1);
      setSelectedAnswer("wrong");
    }

    const newTimer = setTimeout(() => {
      handleNextQuestion();

    }, 2000);
    setTimer(newTimer);


  }

  const handelAnswerClick = () => {
    if (correctAnswer === "ANSWER") {
      setCorrectAnswer(questions[questionIndex].correct_answer);
    } else {
      setCorrectAnswer("ANSWER");
    }
  }

  return (
    <div className='grid place-items-center bg-gradient-to-b from-purple-900 to-purple-300 h-screen w-full'>
      <div className='shadow-2xl w-[500px] sm:px-5 bg-gradient-to-t from-white to-slate-100 rounded-xl h-[18cm]'>
        {isLoading ? (
          <div className='h-full'>
            <div className='flex items-center justify-center font-bold p-4'>
              <h1 className='font-abc text-4xl'>
                QuizUp
              </h1>
            </div>
            <div className='flex justify-end px-20'>
              <h3>Score: {score}</h3>
            </div>

            <div className='h-[13cm] flex justify-center items-center'>
              <img src="https://retchhh.files.wordpress.com/2015/03/loading1.gif?w=300&h=300" alt=""
                className='size-40'
              />
            </div>
          </div>
        ) : questionIndex + 1 < 21 ? (
          <>
            <div className='flex items-center justify-center font-bold p-4'>
              <h1 className='font-abc text-4xl'>
                QuizUp
              </h1>
            </div>
            <div className='flex justify-end px-20'>
              <h3>Score: {score}</h3>
            </div>
            {questions.length > 0 && questions[questionIndex] && (

              <div className='p-10 fade-in-animation h-[220px]'>
                <h2 className='py-4 font-semibold text-2xl'>Question {questionIndex + 1}
                </h2>
                <h2 className={`p-1 text-3xl h-10 ${selectedAnswer !== questions[questionIndex].correct_answer ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                  {checkCorrect}
                </h2>
                <p className='font-bcd text-xl font-medium h-20'>
                  {questions[questionIndex].question}
                </p>
              </div>
            )}
            <div className='flex flex-col px-8 py-3 fade-in-animation'>

              {questions.length > 0 &&
                questions[questionIndex] &&
                answers[questionIndex].map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(answer)}
                    className={`border border-purple-500 hover:bg-purple-600 hover:text-white m-1.5 rounded-full p-2 `}
                  >
                    {answer}
                  </button>
                ))}

            </div>
            <div className='flex items-center justify-between px-7'>

              <button className='border border-dotted w-fit border-purple-600 p-1 rounded-md text-start'
                onClick={handelAnswerClick}
              >
                {correctAnswer}</button>

              <button className='hover:bg-gray-300 rounded-full p-2 hover:scale-125 duration-100 my-3'
                onClick={handleNextQuestion}
              >
                <FaAngleRight />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='flex justify-center items-center'>
              <h1 className='mt-24 font-cde text-6xl'>
                Scoreboard
              </h1>
            </div>
            <div className='flex justify-center items-center'>
              <h3 className='mt-[25px] font-def text-2xl font-semibold'>
                Congrats! You scored {score}.
              </h3>
            </div>
            <div className='text-xl'>
              <h2 className='flex justify-start ml-16 mt-10'>
                No. of correct Questions: {wonQuestions}
              </h2>
              <h2 className='flex justify-start ml-16 mt-10'>
                No. of incorrect Questions: {lostQuestions}
              </h2>
            </div>
            <div className='flex justify-end items-center'>
              <button className='mt-[250px] flex mx-10 text-xl hover:text-white hover:bg-purple-600 px-2 rounded-full font-abc'
                onClick={handleReplayQuiz}
              >
                <MdOutlineReplay className=' m-1 size-6' />
                Replay Quiz
              </button>
            </div>
          </>
        )
        }
      </div>
    </div >
  );
}

export default App;
