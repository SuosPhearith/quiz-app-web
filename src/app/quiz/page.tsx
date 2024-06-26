/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRequest from "@/services/apiRequest";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { convertToCambodiaTime } from "@/utils/help";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileLines,
  faToggleOff,
  faToggleOn,
  faTrash,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, PopconfirmProps, message } from "antd";

const QuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedSearch = searchParams.get("key") || "";
  const selectedPageSize = Number(searchParams.get("pageSize")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [search, setSearch] = useState(selectedSearch);
  const [pageSize, setPageSize] = useState(selectedPageSize);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInitialData = async () => {
    const pageQuery = Number(searchParams.get("page")) || 1;
    const searchQuery = searchParams.get("key") || "";
    const pageSizeQuery = Number(searchParams.get("pageSize")) || 10;
    setPage(pageQuery);
    setSearch(searchQuery);
    setPageSize(pageSizeQuery);
    try {
      const response = await apiRequest(
        "GET",
        `/quiz?page=${pageQuery}&key=${searchQuery}&pageSize=${pageSizeQuery}`,
      );
      if (response) {
        setTotalPages(response.totalPages);
        setData(response.data);
      }
    } catch (error) {
      message.error("something went wrong");
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, [selectedPage, selectedSearch, selectedPageSize]);

  const handleSearch = (value: any) => {
    setSearch(value);
    router.push(`?page=1&key=${value}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    router.push(`?page=1&key=${search}&pageSize=${newSize}`);
  };
  //::==================================================================
  const confirm = async (id: number) => {
    try {
      await apiRequest("DELETE", `/quiz/${id}`);
      fetchInitialData();
      message.success("Deleted successfully");
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    return;
  };

  const toggleActive = async (id: number) => {
    try {
      const response = await apiRequest("PATCH", `/quiz/${id}`);
      if (response) {
        fetchInitialData();
      }
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  //::==================================================================

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Quiz" />
        <div className="overflow-x-auto">
          <div className="min-w-fit rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex items-center justify-between px-4 py-3 md:px-6 xl:px-9">
              <div className="max-w-[30%] max-[800px]:max-w-[50%]">
                <input
                  onChange={(e) => handleSearch(e.target.value)}
                  value={search}
                  type="text"
                  placeholder="Search Quiz"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="max-w-[30%]">
                <Link
                  href="/quiz/create"
                  className=" rounded-md bg-primary px-4 py-2 text-white"
                >
                  Create
                </Link>
              </div>
            </div>

            <div className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 ">
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Quiz Name</p>
              </div>
              <div className=" w-[30%] min-w-[200px] items-center">
                <p className="font-medium">Description</p>
              </div>
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Status</p>
              </div>
              <div className="flex w-[25%] min-w-[100px] items-center">
                <p className="font-medium">Create Date</p>
              </div>
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">Action</p>
              </div>
            </div>

            {data?.map((quiz: any) => (
              <div
                className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 "
                key={quiz.id}
              >
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium">{quiz.name}</p>
                </div>
                <div className=" w-[30%] min-w-[200px] items-center ">
                  <p className="max-lines-1 font-medium ">{quiz.description}</p>
                </div>
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium">
                    {quiz.status ? (
                      <button onClick={() => toggleActive(quiz.id)}>
                        <FontAwesomeIcon
                          icon={faToggleOn}
                          className="h-[25px]"
                        />
                      </button>
                    ) : (
                      <button onClick={() => toggleActive(quiz.id)}>
                        <FontAwesomeIcon
                          icon={faToggleOff}
                          className="h-[25px]"
                        />
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex w-[25%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">
                    {convertToCambodiaTime(quiz.createdAt)}
                  </p>
                </div>
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">
                    <Link
                      href={`/quiz/assign/${quiz.id}/result`}
                      className="me-1 rounded-md bg-blue-400 px-2 py-1 text-sm text-white"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      href={`/quiz/assign/${quiz.id}/info`}
                      className="me-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white"
                    >
                      <FontAwesomeIcon icon={faFileLines} />
                    </Link>
                    <Link
                      href={`/quiz/assign/${quiz.id}`}
                      className="me-1 rounded-md bg-primary px-2 py-1 text-sm text-white"
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                    </Link>
                    <Popconfirm
                      title="Delete the Quiz"
                      description="Are you sure to delete this quiz?"
                      onConfirm={() => confirm(quiz.id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="me-1 rounded-md bg-red px-2 py-1 text-sm text-white">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Popconfirm>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-9 mt-4 flex items-center justify-end">
          <Link
            href={`?page=${selectedPage > 1 ? selectedPage - 1 : 1}&key=${search}&pageSize=${pageSize}`}
            className={`rounded-sm bg-primary p-2 text-white ${selectedPage <= 1 ? "cursor-not-allowed opacity-50" : ""}`}
            aria-disabled={selectedPage <= 1}
          >
            Previous
          </Link>
          <div className="mx-4 text-xl">
            {selectedPage}/{totalPages}
          </div>
          <Link
            href={`?page=${selectedPage < totalPages ? selectedPage + 1 : totalPages}&key=${search}&pageSize=${pageSize}`}
            className={`rounded-sm bg-primary p-2 text-white ${selectedPage >= totalPages ? "cursor-not-allowed opacity-50" : ""}`}
            aria-disabled={selectedPage >= totalPages}
          >
            Next
          </Link>

          <div className="ms-3">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border border-stroke bg-white px-4 py-2"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default QuizPage;
