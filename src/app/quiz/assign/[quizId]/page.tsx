/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRequest from "@/services/apiRequest";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";

interface AssignPageProps {
  params: {
    quizId: number;
  };
}

const AssignPage: React.FC<AssignPageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const selectedPage = Number(searchParams.get("page")) || 1;
  const selectedSearch = searchParams.get("key") || "";
  const selectedPageSize = Number(searchParams.get("pageSize")) || 10;
  const [page, setPage] = useState(selectedPage);
  const [search, setSearch] = useState(selectedSearch);
  const [pageSize, setPageSize] = useState(selectedPageSize);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<{ id: number }[]>([]);

  const fetchInitialData = async () => {
    const pageQuery = Number(searchParams.get("page")) || 1;
    const searchQuery = searchParams.get("key") || "";
    const pageSizeQuery = Number(searchParams.get("pageSize")) || 10;
    setPage(pageQuery);
    setSearch(searchQuery);
    setPageSize(pageSizeQuery);
    setLoading(true);
    const response = await apiRequest(
      "GET",
      `/account?page=${pageQuery}&key=${searchQuery}&pageSize=${pageSizeQuery}`,
    );
    setTotalPages(response.totalPages);
    setData(response.data);
    setLoading(false);
  };

  const fetchSelectedUser = async () => {
    try {
      const selectedUsers = await apiRequest(
        "GET",
        `/account/get/selected/users/${params.quizId}`,
      );
      setSelectedUsers(selectedUsers); // Set selected users
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchSelectedUser();
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

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((user) => user.id === userId)) {
        return prevSelectedUsers.filter((user) => user.id !== userId);
      } else {
        return [...prevSelectedUsers, { id: userId }];
      }
    });
  };

  const handleAssignAll = async () => {
    try {
      setLoading(true);
      const quizId = params.quizId;
      const users = await apiRequest("GET", `/account/get/every/${quizId}`);
      const response = await apiRequest(
        "POST",
        `/quiz/assign/${quizId}`,
        users,
      );
      if (response) {
        setLoading(false);
        router.push("/quiz");
        message.success(response.message);
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSelected = async () => {
    try {
      setLoading(true);
      const quizId = params.quizId;
      const response = await apiRequest("POST", `/quiz/assign/${quizId}`, {
        users: selectedUsers,
      });
      if (response) {
        setLoading(false);
        router.push("/quiz");
        message.success(response.message);
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Assign" />
        <div className="overflow-x-auto">
          <div className="min-w-fit rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex justify-between px-4 py-3 md:px-6 xl:px-9">
              <div className="max-w-[30%] max-[800px]:max-w-[50%]">
                <input
                  onChange={(e) => handleSearch(e.target.value)}
                  value={search}
                  type="text"
                  placeholder="Search User"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="max-w-[40%]">
                <button
                  className="ms-3 rounded-md bg-primary px-4 py-2 text-white"
                  disabled={loading}
                  onClick={handleAssignSelected}
                >
                  Assign Selected Users
                </button>
                <button
                  className="ms-3 rounded-md bg-primary px-4 py-2 text-white"
                  disabled={loading}
                  onClick={handleAssignAll}
                >
                  Assign All Users
                </button>
              </div>
            </div>

            <div className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 ">
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">Assign</p>
              </div>
              <div className="flex w-[20%] min-w-[200px] items-center">
                <p className="font-medium">Name</p>
              </div>
              <div className=" w-[35%] min-w-[200px] items-center">
                <p className="font-medium">Email</p>
              </div>
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Status</p>
              </div>
              <div className="flex w-[25%] min-w-[100px] items-center">
                <p className="font-medium">Gender</p>
              </div>
            </div>

            {data?.map((user: any) => (
              <div
                className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 "
                key={user.id}
              >
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <input
                    className="h-[20px] w-[20px]"
                    type="checkbox"
                    checked={selectedUsers.some(
                      (selected) => selected.id === user.id,
                    )}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </div>
                <div className="flex w-[20%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">{user.name}</p>
                </div>
                <div className=" w-[35%] min-w-[200px] items-center ">
                  <p className="max-lines-1 font-medium ">{user.email}</p>
                </div>
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium">
                    {user.status ? (
                      <button>
                        <FontAwesomeIcon
                          icon={faToggleOn}
                          className="h-[25px]"
                        />
                      </button>
                    ) : (
                      <button>
                        <FontAwesomeIcon
                          icon={faToggleOff}
                          className="h-[25px]"
                        />
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex w-[25%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">{user.gender}</p>
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

export default AssignPage;
