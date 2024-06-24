"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Spinner from "@/components/Spinner";
import apiRequest from "@/services/apiRequest";
import { faAngleLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Answer {
  id: number;
  letter: string;
  questionId: number;
}

interface Option {
  id: number;
  letter: string;
  name: string;
  questionId: number;
}

interface Question {
  id: number;
  name: string;
  type: string;
  score: number;
  quizId: number;
  answer: Answer[];
  option: Option[];
}

interface QuizData {
  id: number;
  name: string;
  description: string;
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

const InfoPage: React.FC<AssignPageProps> = ({ params }) => {
  const [data, setData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await apiRequest("GET", `/quiz/${params.quizId}`);
        setData(result);
        console.log(result);
      } catch (error) {
        message.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.quizId]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Spinner />
      </DefaultLayout>
    );
  }

  if (!data) {
    return (
      <DefaultLayout>
        <div className="flex h-[50px] w-full items-center justify-between rounded-md bg-white">
          <Link
            href="/quiz"
            className="ms-2 flex cursor-pointer items-center rounded-sm px-3 text-primary"
          >
            <FontAwesomeIcon icon={faAngleLeft} className="me-1 h-[15px]" />
            Back
          </Link>
        </div>
        <div className="mt-2 flex w-full items-center justify-between rounded-md bg-white">
          <div className="ms-2 py-3 text-lg">
            No data available for the selected quiz.
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex h-[50px] w-full items-center justify-between rounded-md bg-white">
        <Link
          href="/quiz"
          className="ms-2 flex cursor-pointer items-center rounded-sm px-3 text-primary"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="me-1 h-[15px]" />
          Back
        </Link>
        <div className="flex h-full w-2/3 items-center justify-between ">
          <div className="max-lines-1 w-2/3 text-lg">Title : {data.name}</div>
          <div className="max-lines-1 w-1/3 text-lg">Pass Score : 50pt</div>
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-between rounded-md bg-white">
        <div className="ms-2 py-3 text-lg">
          Description : {data.description}
        </div>
      </div>
      {data.questions.map((question) => (
        <div
          key={question.id}
          className="mt-2 flex w-full items-center justify-between rounded-md bg-white"
        >
          <div className="m-5 w-1/3 ">
            <div className="my-1">Question: {question.name}</div>
            <div className="my-1">Type: {question.type}</div>
            <div className="my-1">Score: {question.score}pt</div>
          </div>
          <div className="m-5 w-2/3">
            {question.option.map((opt) => (
              <div key={opt.id} className="my-2 flex items-center">
                <div className="me-2">
                  {question.answer.some((ans) => ans.letter === opt.letter) ? (
                    <FontAwesomeIcon icon={faCheck} className="text-primary" />
                  ) : (
                    <span className="block h-[15px] w-[15px]" />
                  )}
                </div>
                <div>
                  Option {opt.letter}: {opt.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DefaultLayout>
  );
};

export default InfoPage;
