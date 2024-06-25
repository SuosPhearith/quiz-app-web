/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserLayout from "@/components/Layouts/UserLayout";
import apiRequest from "@/services/apiRequest";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Option {
  id: number;
  letter: string;
  name: string;
  questionId: number;
}

interface Question {
  id: number;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  score: number;
  quizId: number;
  option: Option[];
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  totalScore: string;
  passScore: string;
  status: boolean;
  createdAt: string;
  createdBy: number;
  questions: Question[];
}

interface AssignPageProps {
  params: {
    quizId: number;
  };
}

interface Answer {
  questionId: number;
  option: { letter: string }[];
}

interface UserQuiz {
  id: number;
  assigner: string;
  quizId: number;
  userId: number;
  status: boolean;
  quiz: Quiz;
}

interface AssignPageProps {
  params: {
    quizId: number;
  };
}
const Page: React.FC<AssignPageProps> = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [data, setData] = useState<UserQuiz | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest("GET", `/user-quiz/${params.quizId}`);
        if (response) {
          setData(response);
        }
      } catch (error) {
        message.error("Something went wrong");
      }
    };
    fetchData();
  }, [params.quizId]);

  if (!data)
    return (
      <UserLayout>
        <div>Loading...</div>
      </UserLayout>
    );

  const handleSingleChange = (questionId: number, letter: string) => {
    setAnswers((prev) => {
      const newAnswers = prev.filter(
        (answer) => answer.questionId !== questionId,
      );
      return [...newAnswers, { questionId, option: [{ letter }] }];
    });
  };

  const handleMultipleChange = (questionId: number, letter: string) => {
    setAnswers((prev) => {
      const existingAnswer = prev.find(
        (answer) => answer.questionId === questionId,
      );
      if (existingAnswer) {
        const option = existingAnswer.option.some(
          (option) => option.letter === letter,
        )
          ? existingAnswer.option.filter((option) => option.letter !== letter)
          : [...existingAnswer.option, { letter }];
        return prev.map((answer) =>
          answer.questionId === questionId ? { ...answer, option } : answer,
        );
      }
      return [...prev, { questionId, option: [{ letter }] }];
    });
  };

  const handleSubmit = async () => {
    try {
      console.log({ answers: answers });
      const response = await apiRequest("POST", `/user-quiz/${params.quizId}`, {
        answers: answers,
      });
      if (response) {
        message.success("Submited successfully");
        router.push("/my-quiz");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserLayout>
      <div className="flex w-full flex-col items-center rounded-md bg-white dark:bg-gray-dark dark:shadow-card">
        <div className="flex w-full items-center justify-around px-2 py-3 max-[850px]:flex-col max-[850px]:items-start">
          <div className="min-w-[200px]">Title : {data.quiz.name}</div>
          <div className="min-w-[150px]">
            Pass Score : {data.quiz.passScore}pt
          </div>
          <div className="min-w-[150px]">
            Full Score : {data.quiz.totalScore}px
          </div>
          <div className="min-w-[250px]">Assigner : {data.assigner}</div>
        </div>
        <div className="flex w-full justify-start px-2 py-3">
          Description : {data.quiz.description}
        </div>
      </div>
      {/* Question section */}
      {data.quiz.questions.map((question, index) => (
        <div
          key={question.id}
          className="my-3 flex w-full flex-col justify-center rounded-md dark:bg-gray-dark dark:shadow-card"
        >
          <div className="bg-slate-200 px-9 py-3 dark:bg-gray-dark dark:shadow-card">
            {index + 1} . {question.name}{" "}
            <span className="text-primary">{question.score}pt</span>
          </div>
          {question.option.map((option) => (
            <div
              key={option.id}
              className="mt-1 flex items-center bg-white px-9 py-3 dark:bg-gray-dark dark:shadow-card"
            >
              <input
                className="h-[20px] w-[20px]"
                type={question.type === "SINGLE" ? "radio" : "checkbox"}
                name={`question-${question.id}`}
                checked={
                  answers
                    .find((answer) => answer.questionId === question.id)
                    ?.option.some(
                      (selectedOption) =>
                        selectedOption.letter === option.letter,
                    ) || false
                }
                onChange={() =>
                  question.type === "SINGLE"
                    ? handleSingleChange(question.id, option.letter)
                    : handleMultipleChange(question.id, option.letter)
                }
              />
              <div className="ms-2">{option.name}</div>
            </div>
          ))}
        </div>
      ))}
      <div
        onClick={showModal}
        className="my-9 flex h-[50px] w-full cursor-pointer items-center justify-center rounded-md bg-primary text-xl text-white hover:bg-blue-500"
      >
        Submit
      </div>
      <Modal
        title="Confirm"
        className="font-satoshi"
        open={isModalOpen}
        onOk={() => handleSubmit()}
        onCancel={handleCancel}
        footer
      >
        <div className="flex w-full flex-col items-center justify-center py-9 text-primary">
          <FontAwesomeIcon icon={faCircleInfo} className="me-4 h-[60px]" />
          <span className=" text-[30px]">Are you sure?</span>
          <div>
            <button
              onClick={() => handleCancel()}
              className="mx-3 mt-6 rounded-lg bg-slate-400 px-5 py-2 text-lg text-white "
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit()}
              className="bg- mx-3 mt-6 rounded-md bg-primary px-5 py-2 text-lg text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </UserLayout>
  );
};

export default Page;
