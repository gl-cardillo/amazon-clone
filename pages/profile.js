import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BsFillPencilFill } from "react-icons/bs";
import { UserContext, CurrencyContext } from "../utils/context";
import { HiOutlineLogout } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { swalStyle, handleSuccess, handleError } from "../utils/utils";

export default function Profile() {
  const [showDetails, setShowDetails] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const { currencySymbol, setCurrencySymbol, setCurrencyRate } =
    useContext(CurrencyContext);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(2)
      .max(50)
      .matches(/^[a-zA-Z0-9 _]{0,}$/, {
        message: "Special character not allowed.",
      })
      .required("name is a required field"),
    address: yup.string().max(50),
    city: yup.string().max(30),
    postcode: yup.string().max(10),
    dateOfBirth: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .max(new Date(), "Are you from the future?"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const updateProfile = async (data) => {
    // only way i found to store date of birth without time in mongodb
    let dateOfBirth = null;
    if (data.dateOfBirth) {
      const date = new Date(data.dateOfBirth);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      dateOfBirth = new Date(date.getTime() - userTimezoneOffset);
    }
    try {
      const response = await axios.put("/api/user/updateProfile", {
        id: user._id,
        name: data.name,
        dateOfBirth,
        city: data.city,
        address: data.address,
        postcode: data.postcode,
      });

      localStorage.setItem("user_amazon_lc", JSON.stringify(response.data));
      setUser(response.data);
      setEditProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_amazon_lc"));

    if (!user) {
      router.push("/singin");
      return;
    }

    let defaultValues = {
      name: user.name,
      address: user.address,
      city: user.city,
      postcode: user.postcode,
      dateOfBirth: user.dateOfBirth_toISODate,
    };

    reset({ ...defaultValues });
  }, [user]);

  const logOut = () => {
    setUser(null);
    localStorage.clear();
    delete axios.defaults.headers.Authorization;
    router.push("/");
  };

  const deleteAccount = async () => {
    try {
      await axios.delete("/api/user/deleteAccount");
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure you want to delete this account?",
      position: "top",
      showCancelButton: true,
      confirmButtonText: "Close",
      cancelButtonText: "Delete",
      ...swalStyle,
    }).then((result) => {
      if (result.isDismissed) {
        deleteAccount();
        Swal.close();
        handleSuccess("Account deleted successfully");
      } else {
        Swal.close();
      }
    });
  };

  const setCurrency = (symbol) => {
    if (symbol === currencySymbol) return;
    switch (symbol) {
      case "£":
        setCurrencySymbol("£");
        setCurrencyRate(1);
        break;
      case "€":
        setCurrencySymbol("€");
        setCurrencyRate(1.18);
        break;
      case "$":
        setCurrencySymbol("$");
        setCurrencyRate(1.2);
        break;
      default:
        break;
    }
  };

  return (
    <div className=" mt-5 mx-6 md:mx-44 lg:mx-[300px] xl:mx-[500px] 2xl:mx-[600px] 3xl:mx-[800px] flex items-center flex-col p-5 bg-white rounded-md gap-3 shadow">
      <h2 className="font-bold text-xl">Welcome {user && user.firstName}</h2>
      <img
        className="w-[50px] h-[50px] rounded-full"
        src="/images/user.jpeg"
        alt="avatar"
      />
      <div className="flex gap-2 items-center">
        <p>Details</p>
        <button
          onClick={() => {
            setShowDetails(!showDetails);
          }}
        >
          <MdKeyboardArrowDown
            className={`${showDetails && "rotate-180 text-xl"} "text-xl"`}
          />
        </button>
      </div>
      {showDetails &&
        (editProfile ? (
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(updateProfile)}>
              <div className="mt-3 flex flex-col relative">
                <label
                  htmlFor="name"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-blue-500 text-sm"
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  name="name"
                  className="w-[228px] border-gray-300 rounded shadow"
                />
                <p className="text-[12px] text-red-600 pt-1">
                  {errors?.name?.message}
                </p>
              </div>
              <div className="mt-3 flex flex-col relative">
                <label
                  htmlFor="address"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-blue-500 text-sm"
                >
                  Address
                </label>
                <input
                  {...register("address")}
                  type="text"
                  id="address"
                  name="address"
                  className="w-[228px] border-gray-300 rounded shadow"
                />
                <p className="text-[12px] text-red-600 pt-1">
                  {errors?.address?.message}
                </p>
              </div>
              <div className="mt-3 flex flex-col relative">
                <label
                  htmlFor="city"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-blue-500 text-sm"
                >
                  City
                </label>
                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  name="city"
                  className="w-[228px] border-gray-300 rounded shadow"
                />
              </div>
              <div className="mt-3 flex flex-col relative">
                <label
                  htmlFor="postcode"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-blue-500 text-sm"
                >
                  Postcode
                </label>
                <input
                  {...register("postcode")}
                  type="text"
                  id="postcode"
                  name="postcode"
                  className="w-[228px] border-gray-300 rounded shadow"
                />
                <p className="text-[12px] text-red-600 pt-1">
                  {errors?.postcode?.message}
                </p>
              </div>
              <div className="mt-3 flex flex-col relative">
                <label
                  htmlFor="dateOfBirth"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-blue-500 text-sm"
                >
                  Date of birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className="w-[228px] border-gray-300 rounded shadow"
                />
                <p className="text-[12px] text-red-600 pt-1">
                  {errors?.dateOfBirth?.message}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="mt-5 w-[110px] text-[14px] rounded py-0.5 shadow bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditProfile(false)}
                  type="button"
                  className="mt-5 w-[110px] text-[14px] rounded shadow bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col min-w-[120px] ">
            <BsFillPencilFill
              onClick={() => setEditProfile(!editProfile)}
              className="self-end mb-2"
            />
            <p>
              <span className="font-bold">Name:</span> {user && user.name}
            </p>
            <p>
              <span className="font-bold">Address:</span>
              {user && user.address}
            </p>
            <p>
              <span className="font-bold">City:</span> {user && user.city}
            </p>
            <p>
              <span className="font-bold">Postcode:</span>
              {user && user.postcode}
            </p>
            <p>
              <span className="font-bold">Date of birth: </span>
              {user && user.dateOfBirth && user.dateOfBirth_formatted}
            </p>
          </div>
        ))}
      <div>
        <p className="text-center my-3">Currency:</p>
        <div className="flex gap-5">
          <button
            onClick={() => setCurrency("£")}
            className={`${
              currencySymbol === "£" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border border-[#f0c14b] hover:bg-[#f7dfa5] rounded shadow`}
          >
            £
          </button>
          <button
            onClick={() => setCurrency("€")}
            className={`${
              currencySymbol === "€" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border border-[#f0c14b] hover:bg-[#f7dfa5] rounded shadow`}
          >
            €
          </button>
          <button
            onClick={() => setCurrency("$")}
            className={`${
              currencySymbol === "$" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border border-[#f0c14b] hover:bg-[#f7dfa5] rounded shadow`}
          >
            $
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-7 items-center my-3">
        <button onClick={() => logOut()} className="flex gap-2 items-center">
          <HiOutlineLogout className="text-3xl" />
          <p className="font-semibold text-lg">Log out</p>
        </button>
        {user && user.email !== "testAccount@example.com" && (
          <button
            onClick={confirmDelete}
            className="p-1 text-red-400 border-[3px] border-red-400"
          >
            Delete account
          </button>
        )}
      </div>
    </div>
  );
}
