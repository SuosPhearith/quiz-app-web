/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRequest from "@/services/apiRequest";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { convertToCambodiaTime } from "@/utils/help";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
  faToggleOff,
  faToggleOn,
  faTrash,
  faUnlockKeyhole,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Select, message } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";

const UserPage = () => {
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

  const fetchInitialData = async () => {
    const pageQuery = Number(searchParams.get("page")) || 1;
    const searchQuery = searchParams.get("key") || "";
    const pageSizeQuery = Number(searchParams.get("pageSize")) || 10;
    setPage(pageQuery);
    setSearch(searchQuery);
    setPageSize(pageSizeQuery);
    setLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/account?page=${pageQuery}&key=${searchQuery}&pageSize=${pageSizeQuery}`,
      );
      if (response) {
        setTotalPages(response.totalPages);
        setData(response.data);
        setLoading(false);
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

  //::======================================================================
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const showModal = () => {
    setIsModalCreateOpen(true);
  };

  const handleOk = () => {
    setIsModalCreateOpen(false);
  };

  const handleCancel = () => {
    setIsModalCreateOpen(false);
  };

  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      await apiRequest("POST", "/account", {
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
      });
      fetchInitialData();
      setIsModalCreateOpen(false);
      reset();
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
    }
  };
  const getOne = async (id: number) => {
    try {
      const data = await apiRequest("GET", `/account/${id}`);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("gender", data.gender);
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
    }
  };
  const handleUpdate = (id: number) => {
    getOne(id);
  };

  // const toggleActive = async (id: number) => {
  //   try {
  //     const response = await apiRequest("PATCH", `/quiz/${id}`);
  //     if (response) {
  //       fetchInitialData();
  //     }
  //   } catch (error: any) {
  //     message.error(error?.message);
  //   }
  // };
  //::======================================================================

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Quiz" />
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
              <div className="max-w-[30%]">
                <button
                  className="rounded-md bg-primary px-4 py-2 text-white"
                  onClick={showModal}
                >
                  Create
                </button>
              </div>
            </div>

            <div className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 ">
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">Name</p>
              </div>
              <div className=" w-[30%] min-w-[200px] items-center">
                <p className="font-medium">Email</p>
              </div>
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Status</p>
              </div>
              <div className="flex w-[25%] min-w-[100px] items-center">
                <p className="font-medium">Gender</p>
              </div>
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">Action</p>
              </div>
            </div>

            {data?.map((user: any) => (
              <div
                className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 "
                key={user.id}
              >
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">{user.name}</p>
                </div>
                <div className=" w-[30%] min-w-[200px] items-center ">
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
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <div className="max-lines-1 font-medium">
                    <button className="me-1 rounded-md bg-blue-400 px-2 py-1 text-sm text-white">
                      <FontAwesomeIcon icon={faUnlockKeyhole} />
                    </button>
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="me-1 rounded-md bg-primary px-2 py-1 text-sm text-white"
                    >
                      <FontAwesomeIcon icon={faUserPen} />
                    </button>
                    <button className="me-1 rounded-md bg-red px-2 py-1 text-sm text-white">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
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
        <Modal
          className="font-satoshi"
          title="Create new user"
          open={isModalCreateOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("name", { required: true, minLength: 3 })}
              type="text"
              placeholder="Name"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <input
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              type="text"
              placeholder="Email"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <input
              {...register("password", { required: true, minLength: 8 })}
              type="password"
              placeholder="Password"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <select
              {...register("gender", { required: true })}
              id="gender"
              name="gender"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            >
              <option value="" className="hidden">
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div className="flex w-full items-center justify-end">
              <div
                onClick={() => (setIsModalCreateOpen(false), reset())}
                className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
              >
                Cancel
              </div>
              <button
                type="submit"
                className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
                disabled={loading}
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} /> : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

type Inputs = {
  name: string;
  email: string;
  password: string;
  gender: string;
};

export default UserPage;
