/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { message } from "antd";
import apiRequest from "@/services/apiRequest";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

type Inputs = {
  name: string;
  email: string;
  gender: string;
  avatar: string;
  file: FileList; // Change to FileList
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, setValue, getValues } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await apiRequest("PATCH", "/auth/updateProfile", {
        name: data.name,
        email: data.email,
        gender: data.gender,
      });
      if (response) {
        fetchData();
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/auth/me");
      if (response) {
        setValue("name", response.name);
        setValue("email", response.email);
        setValue("gender", response.gender);
        setValue("avatar", response.avatar);
        localStorage.setItem("avatar", response.avatar);
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div>Loading...</div>
      </DefaultLayout>
    );
  }

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiRequest("POST", "/auth/uploadAvatar", formData);
      if (response) {
        fetchData();
        message.success("Updated successfully");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />
      <div className="flex w-full flex-col items-center justify-center rounded-md bg-white py-10 dark:bg-gray-dark dark:shadow-card">
        <div className="my-5 flex flex-col items-center">
          <div className="h-[100px] w-[100px]">
            <Image
              src={`${imageUrl}${getValues("avatar")}`}
              width={100}
              height={100}
              alt="profile"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <input
            {...register("file")}
            onChange={handleUploadAvatar}
            className="mt-1"
            type="file"
            name="file"
            id="file"
          />
        </div>
        <form
          className="flex w-full flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-2 w-full max-w-[400px]">Name:</div>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="my-1 w-full max-w-[400px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <div className="mt-2 w-full max-w-[400px]">Email:</div>
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="my-1 w-full max-w-[400px] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <div className="mt-2 w-full max-w-[400px]">Gender:</div>
          <select
            {...register("gender")}
            id="gender"
            name="gender"
            className="my-1 block w-full max-w-[400px] rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary sm:text-sm"
          >
            <option value="" className="hidden">
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button
            type="submit"
            className="mt-2 w-full max-w-[400px] cursor-pointer rounded-md bg-primary py-3 text-center text-white hover:bg-blue-500"
          >
            Save Change
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
