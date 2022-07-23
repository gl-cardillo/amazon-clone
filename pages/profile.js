import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BsFillPencilFill } from "react-icons/bs";
import { UserContext } from "../utils/context";
import { CurrencyContext } from "../utils/context";
import { HiOutlineLogout } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function Profile() {
  const [showDetails, setShowDetails] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const { currencySymbol, setCurrencySymbol, currencyRate, setCurrencyRate } =
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
    dateOfBirth: yup.date().max(new Date(), "Are you from the future?"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const updateProfile = (data) => {
    // only way i found to store date of birth without time in mongodb
    const date = new Date(data.dateOfBirth);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const dateOfBirth = new Date(date.getTime() - userTimezoneOffset);
    axios
      .put(
        "http://localhost:3000/api/user/updateProfile",
        {
          id: user._id,
          name: data.name,
          dateOfBirth,
          city: data.city,
          address: data.address,
          postcode: data.postcode,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token_amazon_lc")
            )}`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("user_amazon_lc", JSON.stringify(res.data));
        setUser(res.data);
        setEditProfile(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_amazon_lc"));

    if (!user) {
      router.push("/singin");
      return;
    }
    let defaultValues = {};
    defaultValues.name = user.name;
    defaultValues.address = user.address;
    defaultValues.city = user.city;
    defaultValues.postcode = user.postcode;
    defaultValues.dateOfBirth = user.dateOfBirth_toISODate;

    reset({ ...defaultValues });
  }, [user]);

  const logOut = () => {
    setUser(null);
    localStorage.clear();
    router.push("/");
  };

  const deleteAccount = () => {
    axios
      .delete("http://localhost:3000/api/user/deleteAccount", {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token_amazon_lc")
          )}`,
        },
      })
      .then(() => {
        logOut();
      })
      .catch((err) => {
        console.log(err);
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
    <div className=" mt-5 mx-6 md:mx-44 lg:mx-[300px] xl:mx-[500px] 2xl:mx-[600px] flex items-center flex-col p-5 bg-white rounded-md gap-3">
      <h2 className="font-bold text-lx">Welcome {user && user.firstname}</h2>
      <p className="flex gap 2 items-center">
        Details
        <MdKeyboardArrowDown
          className={`${showDetails && "rotate-180 text-xl"} "text-xl"`}
          onClick={() => {
            setShowDetails(!showDetails);
          }}
        />
      </p>
      {showDetails &&
        (editProfile ? (
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(updateProfile)}>
              <label htmlFor="name">
                <h4>Name:</h4>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  name="name"
                />
              </label>
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.name?.message}
              </p>
              <label htmlFor="address">
                <h4>Address:</h4>
                <input
                  {...register("address")}
                  type="text"
                  id="address"
                  name="address"
                />
              </label>
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.address?.message}
              </p>
              <label htmlFor="city">
                <h4>City:</h4>
                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  name="city"
                />
              </label>
              <label htmlFor="postcode">
                <h4>Postcode:</h4>
                <input
                  {...register("postcode")}
                  type="text"
                  id="postcode"
                  name="postcode"
                />
              </label>
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.postcode?.message}
              </p>
              <label htmlFor="dateOfBirth">
                <h4> Date of birth:</h4>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                />
              </label>
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.dateOfBirth?.message}
              </p>
              <button
                type="submit"
                className="mt-5  w-[110px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
              >
                Update
              </button>
              <button
                onClick={() => setEditProfile(false)}
                type="button"
                className="mt-5  w-[110px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
              >
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col min-w-[120px] ">
            <BsFillPencilFill
              onClick={() => setEditProfile(!editProfile)}
              className=" self-end mb-2"
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
              <span className="font-bold">Postcode:</span>{" "}
              {user && user.postcode}
            </p>
            <p>
              <span className="font-bold">Date of birth: </span>
              {user && user.dateOfBirth && user.dateOfBirth_formatted}
            </p>
          </div>
        ))}
      <div>
        <p className=" text-center mb-2">Currency:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency("£")}
            className={`${
              currencySymbol === "£" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border-2 border-[#f0c14b] hover:bg-[#f7dfa5] `}
          >
            £
          </button>
          <button
            onClick={() => setCurrency("€")}
            className={`${
              currencySymbol === "€" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border-2 border-[#f0c14b] hover:bg-[#f7dfa5] `}
          >
            €
          </button>
          <button
            onClick={() => setCurrency("$")}
            className={`${
              currencySymbol === "$" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] text-xl border-2 border-[#f0c14b] hover:bg-[#f7dfa5] `}
          >
            $
          </button>
        </div>
      </div>
      <div className="flex flex-col  gap-5 items-center">
        <HiOutlineLogout onClick={() => logOut()} className="text-3xl" />
        <button
          onClick={() => setShowDeleteAccount(true)}
          className="p-1 text-red-400 border-[3px] border-red-400"
        >
          Delete account
        </button>
      </div>
      {showDeleteAccount && (
        <div className=" fixed z-2 top-0 left-0 w-full h-full bg-black/50">
          <div className="absolute z-3 top-1/2 left-1/2 w-[300px] text-[18px] bg-white transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md border-2 border-[#f0c14b] flex flex-col items-center">
            <p className=" text-center font-semibold">
              Are you sure you want to delete this account?
            </p>
            <div className="flex justify-around">
              <button
                className="mt-5 p-2 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                onClick={() => setShowDeleteAccount(false)}
              >
                Cancel
              </button>
              <button
                className="mt-5 p-2 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                onClick={() => deleteAccount()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
