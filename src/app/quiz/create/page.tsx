"use client";
import React, { useState } from "react";
import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { message } from "antd";
import apiRequest from "@/services/apiRequest";
import { useRouter } from "next/navigation";

const CreatePage = () => {
  const initialQuizState = {
    name: "",
    description: "",
    limit: "",
    passScore: "",
    totalScore: "",
    questions: [
      {
        name: "",
        type: "SINGLE",
        score: "",
        options: [
          { letter: "A", name: "" },
          { letter: "B", name: "" },
          { letter: "C", name: "" },
        ],
        answer: [],
      },
    ],
  };

  const [quiz, setQuiz] = useState(initialQuizState);

  const calculateTotalScore = (questions: any) => {
    return questions.reduce((total: any, question: any) => {
      return total + (parseInt(question.score) || 0);
    }, 0);
  };

  const handleQuizChange = (e: any) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index: any, e: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [e.target.name]: e.target.value,
    };
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
      totalScore: calculateTotalScore(updatedQuestions),
    });
  };

  const handleOptionChange = (qIndex: any, oIndex: any, e: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = {
      ...updatedQuestions[qIndex].options[oIndex],
      name: e.target.value,
    };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAnswerChange = (qIndex: any, oIndex: any, e: any) => {
    const updatedQuestions: any = [...quiz.questions];
    const selectedLetter = updatedQuestions[qIndex].options[oIndex].letter;

    if (e.target.checked) {
      if (updatedQuestions[qIndex].type === "SINGLE") {
        updatedQuestions[qIndex].answer = [{ letter: selectedLetter }];
      } else {
        updatedQuestions[qIndex].answer.push({ letter: selectedLetter });
      }
    } else {
      updatedQuestions[qIndex].answer = updatedQuestions[qIndex].answer.filter(
        (ans: any) => ans.letter !== selectedLetter,
      );
    }

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (qIndex: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options.push({
      letter: String.fromCharCode(65 + updatedQuestions[qIndex].options.length),
      name: "",
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    if (isCurrentQuestionValid()) {
      const updatedQuestions = [
        ...quiz.questions,
        {
          name: "",
          type: "SINGLE",
          score: "",
          options: [
            { letter: "A", name: "" },
            { letter: "B", name: "" },
            { letter: "C", name: "" },
          ],
          answer: [],
        },
      ];
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
        totalScore: calculateTotalScore(updatedQuestions),
      });
    }
  };

  const deleteQuestion = (qIndex: any) => {
    if (quiz.questions.length <= 1) {
      return message.error("Cannot Remove");
    }
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(qIndex, 1);
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
      totalScore: calculateTotalScore(updatedQuestions),
    });
  };

  const isCurrentQuestionValid = () => {
    const currentQuestion = quiz.questions[quiz.questions.length - 1];
    if (
      !currentQuestion.name ||
      !currentQuestion.type ||
      !currentQuestion.score
    ) {
      return false;
    }
    for (let option of currentQuestion.options) {
      if (!option.name) {
        return false;
      }
    }
    if (
      currentQuestion.type === "SINGLE" &&
      currentQuestion.answer.length !== 1
    ) {
      return false;
    }
    if (
      currentQuestion.type === "MULTIPLE" &&
      currentQuestion.answer.length < 2
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (quiz.name === "" || quiz.description === "") {
      return message.error("Please input Name and Description");
    }
    try {
      const response = await apiRequest("POST", "/quiz", quiz);
      if (response) {
        router.push("/quiz");
      }
    } catch (error) {
      console.log(error);
      message.error("Cannot create");
    }
  };

  const router = useRouter();

  return (
    <DefaultLayout>
      <div className="max-[1200px] m-2 flex h-[50px] w-full items-center justify-between rounded-md bg-white py-4 dark:bg-gray-dark dark:shadow-card max-[1200px]:h-fit max-[1200px]:flex-col">
        <Link
          href="/quiz"
          className="ms-2 flex cursor-pointer items-center rounded-sm px-3 text-primary"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="me-1 h-[15px]" />
          Back
        </Link>
        <div className="flex w-[90%] items-center max-[1200px]:flex-col max-[1200px]:justify-start">
          <input
            type="text"
            name="name"
            value={quiz.name}
            onChange={handleQuizChange}
            placeholder="Quiz Title"
            className="mx-3 w-full  min-w-[120px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary max-[12000px]:mt-1"
          />
          <input
            type="text"
            name="description"
            value={quiz.description}
            onChange={handleQuizChange}
            placeholder="Quiz Description"
            className="mx-3 w-full min-w-[150px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary max-[12000px]:mt-1"
          />
          <input
            type="number"
            name="limit"
            value={quiz.limit}
            onChange={handleQuizChange}
            placeholder="Limit"
            className="mx-3 w-full min-w-[150px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary max-[12000px]:mt-1"
          />
          <input
            type="number"
            name="passScore"
            value={quiz.passScore}
            onChange={handleQuizChange}
            placeholder="Pass Score"
            className="mx-3 w-full   min-w-[120px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary max-[12000px]:mt-1"
          />
          <div className="h-full min-w-[120px] py-2">
            Full Scroe : {quiz.totalScore}
          </div>
          {isCurrentQuestionValid() ? (
            <button
              onClick={() => handleSubmit()}
              className="min-h-full min-w-[150px] rounded-md bg-primary px-4 py-2 text-white"
            >
              Create Form
            </button>
          ) : (
            <button className="min-h-full  w-full min-w-[150px] cursor-not-allowed rounded-md bg-gray-400 px-4 py-2 text-white">
              Create Form
            </button>
          )}
        </div>
      </div>
      {quiz.questions.map((question, qIndex) => (
        <div
          key={qIndex}
          className="m-2 flex w-full items-center justify-between rounded-md bg-white dark:bg-gray-dark dark:shadow-card max-[600px]:flex-col"
        >
          <div className="w-[45%] max-[600px]:w-[80%]">
            <div className="ms-4 mt-2 flex items-center justify-between">
              <div>Question {qIndex + 1}</div>
              <button
                className="text-red-500"
                onClick={() => deleteQuestion(qIndex)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <input
              type="text"
              name="name"
              value={question.name}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder="Question Name"
              className="m-3 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <select
              name="type"
              value={question.type}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              className="m-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary sm:text-sm"
            >
              <option value="" className="hidden">
                Select Question Type
              </option>
              <option value="SINGLE">Single answer</option>
              <option value="MULTIPLE">Multiple answers</option>
            </select>
            <input
              type="number"
              name="score"
              value={question.score}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder="Score"
              className="m-3 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="w-1/2 max-[600px]:w-[85%]">
            {question.options.map((opt, oIndex) => (
              <div className="my-2 ms-7 flex w-full items-center" key={oIndex}>
                <div className="w-[5%]">
                  <input
                    className="h-[20px] w-[20px]"
                    type="checkbox"
                    checked={question.answer.some(
                      (ans: any) => ans.letter === opt.letter,
                    )}
                    onChange={(e) => handleAnswerChange(qIndex, oIndex, e)}
                  />
                </div>
                <div className="w-[80%]">
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    placeholder="Option"
                    className="mx-3 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            ))}
            <div className="mb-4 flex w-2/3 justify-center">
              <button
                className="rounded-md bg-primary px-2 py-1 text-sm text-white"
                onClick={() => addOption(qIndex)}
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      ))}
      <div
        className={`m-2 flex w-full cursor-pointer items-center justify-center rounded-md py-2 text-white ${
          isCurrentQuestionValid()
            ? "bg-primary"
            : "cursor-not-allowed bg-gray-400"
        }`}
        onClick={addQuestion}
      >
        Add Question
      </div>
    </DefaultLayout>
  );
};

export default CreatePage;
