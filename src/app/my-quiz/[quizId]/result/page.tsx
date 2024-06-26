/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
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
import UserLayout from "@/components/Layouts/UserLayout";

interface AssignPageProps {
  params: {
    quizId: number;
  };
}
const ResultPage: React.FC<AssignPageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedSearch = searchParams.get("key") || "";
  const selectedPageSize = Number(searchParams.get("pageSize")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [search, setSearch] = useState(selectedSearch);
  const [pageSize, setPageSize] = useState(selectedPageSize);
  const [data, setData] = useState<any>([]);
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
        `/quiz/${params.quizId}/get-result-each-user?page=${pageQuery}&key=${searchQuery}&pageSize=${pageSizeQuery}`,
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
    <UserLayout>
      <div className="mx-auto mt-4 max-w-7xl">
        <div className="overflow-x-auto">
          <div className="min-w-fit rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex items-center justify-between px-4 py-3 md:px-6 xl:px-9">
              <div className="min-w-[200px] max-w-[30%]  max-[800px]:max-w-[50%]"></div>
              <div className="min-w-[200px]  max-w-[30%]">
                Title : {data[0]?.quiz?.name}
              </div>
              <div className="min-w-[200px]  max-w-[30%]">
                Pass Score : {data[0]?.quiz?.passScore} pt
              </div>
              <div className="min-w-[200px]  max-w-[30%]">
                Total Score : {data[0]?.quiz?.totalScore} pt
              </div>
            </div>

            <div className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 ">
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">User Name</p>
              </div>
              <div className=" w-[30%] min-w-[200px] items-center">
                <p className="font-medium">Score</p>
              </div>
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Result</p>
              </div>
            </div>

            {data?.map((quiz: any) => (
              <div
                className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 "
                key={quiz.id}
              >
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium">{quiz.user.name}</p>
                </div>
                <div className=" w-[30%] min-w-[200px] items-center ">
                  <p className="max-lines-1 font-medium ">{quiz.score} pt</p>
                </div>
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium">
                    {quiz.isPass ? (
                      <div className="text-primary">Pass</div>
                    ) : (
                      <div className="text-red">Fail</div>
                    )}
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
    </UserLayout>
  );
};

export default ResultPage;
