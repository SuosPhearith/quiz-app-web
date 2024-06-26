/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import apiRequest from "@/services/apiRequest";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { convertToCambodiaTime, logout } from "@/utils/help";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Popconfirm, message } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const isAdmin = async () => {
    try {
      const user = await apiRequest("GET", "/auth/me");
      if (user) {
        if (user.roleId !== 1) {
          logout();
        }
      }
    } catch (error) {}
  };

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
        `/auth/getSession/getAll?page=${pageQuery}&key=${searchQuery}&pageSize=${pageSizeQuery}`,
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
    isAdmin();
    fetchInitialData();
  }, [selectedPage, selectedSearch, selectedPageSize]);

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    router.push(`?page=1&key=${search}&pageSize=${newSize}`);
  };

  const deleteUser = async (sessionToken: number) => {
    try {
      const response = await apiRequest(
        "DELETE",
        `/auth/account/logoutDevice/${sessionToken}`,
      );
      if (response) {
        fetchInitialData();
        message.success("Delete successfully");
      }
    } catch (error) {
      message.error("Cannot delete!");
    }
  };

  const logoutAllDevices = async () => {
    try {
      const response = await apiRequest(
        "PATCH",
        `/auth/account/logoutAllDevices`,
      );
      if (response) {
        fetchInitialData();
        message.success("Delete successfully");
      }
    } catch (error) {
      message.error("Cannot Logout!");
    }
  };

  //::======================================================================
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

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return message.error("Invalid Confirm Password");
    }
    try {
      setLoading(true);
      const response = await apiRequest("PATCH", "/auth/changePassword", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      if (response) {
        fetchInitialData();
        setIsModalCreateOpen(false);
        reset();
      }
    } catch (error: any) {
      console.log(error?.message);
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleSubmitDeleteAcc = async () => {
    if (confirmText !== "CONFIRM") {
      return message.error("Please Confirm");
    }
    try {
      setLoading(true);
      const response = await apiRequest("DELETE", "/auth/deleteAccount");
      if (response) {
        fetchInitialData();
        setIsModalOpen(false);
      }
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  //::======================================================================

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Setting" />
        <div className="overflow-x-auto">
          <div className="min-w-fit rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex justify-between px-4 py-3 md:px-6 xl:px-9">
              <div className="max-w-[60%] max-[800px]:max-w-[60%]">
                <button
                  className="rounded-md bg-primary px-4 py-2 text-white"
                  onClick={showModal}
                >
                  Change Password
                </button>
                <Popconfirm
                  title="Logout All Devices"
                  description="Are you sure to Logout All Devices?"
                  onConfirm={() => logoutAllDevices()}
                  onCancel={() => ""}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className="mx-2 rounded-md bg-primary px-4 py-2 text-white">
                    Logout All Devices
                  </button>
                </Popconfirm>
              </div>
              <div className="max-w-[30%]">
                <button
                  className="rounded-md bg-red px-4 py-2 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 ">
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">No.</p>
              </div>
              <div className=" w-[30%] min-w-[200px] items-center">
                <p className="font-medium">Device</p>
              </div>
              <div className="flex w-[15%] min-w-[100px] items-center">
                <p className="font-medium">Browser</p>
              </div>
              <div className="flex w-[25%] min-w-[100px] items-center">
                <p className="font-medium">Login Date</p>
              </div>
              <div className="flex w-[15%] min-w-[200px] items-center">
                <p className="font-medium">Action</p>
              </div>
            </div>

            {data?.map((session: any, index: number) => (
              <div
                className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-dark-3 "
                key={session.id}
              >
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">
                    {index + 1 + (page - 1) * pageSize}
                  </p>
                </div>
                <div className=" w-[30%] min-w-[200px] items-center ">
                  <p className="max-lines-1 font-medium ">{session.device}</p>
                </div>
                <div className="flex w-[15%] min-w-[100px] items-center">
                  <p className="max-lines-1 font-medium ">{session.browser}</p>
                </div>
                <div className="flex w-[25%] min-w-[200px] items-center">
                  <p className="max-lines-1 font-medium">
                    {convertToCambodiaTime(session.createdAt)}
                  </p>
                </div>
                <div className="flex w-[15%] min-w-[200px] items-center">
                  <div className="max-lines-1 font-medium">
                    <Popconfirm
                      title="Delete Session"
                      description="Are you sure to delete this session?"
                      onConfirm={() => deleteUser(session.sessionToken)}
                      onCancel={() => ""}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="me-1 rounded-md bg-red px-2 py-1 text-sm text-white">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Popconfirm>
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
          title="Change Password"
          open={isModalCreateOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={false}
          footer
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("currentPassword", { required: true, minLength: 8 })}
              type="password"
              placeholder="Current Password"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            />
            <input
              {...register("newPassword", {
                required: true,
                minLength: 8,
              })}
              type="password"
              placeholder="New Password"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            />
            <input
              {...register("confirmPassword", {
                required: true,
                minLength: 8,
              })}
              type="password"
              placeholder="Confirm Password"
              className="my-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            />
            <div className="flex w-full items-center justify-end">
              <div
                onClick={() => (handleCancel(), reset())}
                className="me-1 mt-5 cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-white"
              >
                Cancel
              </div>
              <button
                type="submit"
                className="me-1 mt-5 rounded-md bg-primary px-4 py-2 text-white"
                disabled={loading}
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} /> : "Save Change"}
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          title="Confirm"
          className="font-satoshi"
          open={isModalOpen}
          onOk={() => handleSubmitDeleteAcc()}
          onCancel={() => setIsModalOpen(false)}
          footer
        >
          <div className="flex w-full flex-col items-center justify-center py-9 text-primary">
            <FontAwesomeIcon icon={faCircleInfo} className="me-4 h-[60px]" />
            <span className=" text-[30px]">Are you sure?</span>
            <div className="rounded-md bg-slate-100 p-3 text-lg text-black">
              Please type: CONFIRM
            </div>
            <input
              type="text"
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="my-2 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3  text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            />
            <div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mx-3 mt-6 rounded-lg bg-slate-400 px-5 py-2 text-lg text-white "
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitDeleteAcc()}
                className="bg- mx-3 mt-6 rounded-md bg-red px-5 py-2 text-lg text-white"
              >
                Delete Account
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default UserPage;
