import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BsFillPencilFill } from "react-icons/bs";
import { CurrencyContext, type CurrencySymbol } from "../utils/context";
import { HiOutlineLogout } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { swalStyle, handleSuccess } from "../utils/utils";
import { profileSchema, type ProfileInput } from "../utils/schemas";
import { TEST_ACCOUNT_EMAIL } from "../utils/constants";
import {
  useDeleteAccount,
  useLogout,
  useMe,
  useUpdateProfile,
} from "../hooks/useAuth";

const CURRENCY_RATES: Record<CurrencySymbol, number> = {
  "£": 1,
  "€": 1.18,
  $: 1.2,
};

export default function Profile() {
  const [showDetails, setShowDetails] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const { currencySymbol, setCurrencySymbol, setCurrencyRate } =
    useContext(CurrencyContext);
  const { user, isLoading } = useMe();
  const updateProfileMutation = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const logout = useLogout();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  const updateProfile = (data: ProfileInput) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => setEditProfile(false),
    });
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/signin");
      return;
    }
    // the schema expects strings, missing fields would fail validation
    reset({
      name: user.name ?? "",
      address: user.address ?? "",
      city: user.city ?? "",
      postcode: user.postcode ?? "",
      dateOfBirth: user.dateOfBirth_toISODate ?? "",
    });
  }, [isLoading, user, reset, router]);

  // leave the page first, otherwise the redirect above sends us to /signin
  const logOut = async () => {
    await router.push("/");
    logout();
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
      Swal.close();
      if (result.isDismissed) {
        deleteAccount.mutate(undefined, {
          onSuccess: async () => {
            await logOut();
            handleSuccess("Account deleted successfully");
          },
        });
      }
    });
  };

  const setCurrency = (symbol: CurrencySymbol) => {
    setCurrencySymbol(symbol);
    setCurrencyRate(CURRENCY_RATES[symbol]);
  };

  return (
    <div className="mx-6 mt-5 flex flex-col items-center gap-3 rounded-md bg-white p-5 shadow md:mx-44 lg:mx-[300px] xl:mx-[500px] 2xl:mx-[600px] 3xl:mx-[800px]">
      <h2 className="text-xl font-bold">Welcome {user && user.firstName}</h2>
      <Image
        className="h-[50px] w-[50px] rounded-full"
        src="/images/user.svg"
        width={50}
        height={50}
        alt="avatar"
        unoptimized
      />
      <div className="flex items-center gap-2">
        <p>Details</p>
        <button
          onClick={() => {
            setShowDetails(!showDetails);
          }}
          aria-label="Show details"
          aria-expanded={showDetails}
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
              <div className="relative mt-3 flex flex-col">
                <label
                  htmlFor="name"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-blue-500"
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  name="name"
                  className="w-[228px] rounded border-gray-300 shadow"
                />
                <p className="pt-1 text-[12px] text-red-600">
                  {errors?.name?.message}
                </p>
              </div>
              <div className="relative mt-3 flex flex-col">
                <label
                  htmlFor="address"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-blue-500"
                >
                  Address
                </label>
                <input
                  {...register("address")}
                  type="text"
                  id="address"
                  name="address"
                  className="w-[228px] rounded border-gray-300 shadow"
                />
                <p className="pt-1 text-[12px] text-red-600">
                  {errors?.address?.message}
                </p>
              </div>
              <div className="relative mt-3 flex flex-col">
                <label
                  htmlFor="city"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-blue-500"
                >
                  City
                </label>
                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  name="city"
                  className="w-[228px] rounded border-gray-300 shadow"
                />
              </div>
              <div className="relative mt-3 flex flex-col">
                <label
                  htmlFor="postcode"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-blue-500"
                >
                  Postcode
                </label>
                <input
                  {...register("postcode")}
                  type="text"
                  id="postcode"
                  name="postcode"
                  className="w-[228px] rounded border-gray-300 shadow"
                />
                <p className="pt-1 text-[12px] text-red-600">
                  {errors?.postcode?.message}
                </p>
              </div>
              <div className="relative mt-3 flex flex-col">
                <label
                  htmlFor="dateOfBirth"
                  className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-blue-500"
                >
                  Date of birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className="w-[228px] rounded border-gray-300 shadow"
                />
                <p className="pt-1 text-[12px] text-red-600">
                  {errors?.dateOfBirth?.message}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="mt-5 w-[110px] rounded bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] py-0.5 text-[14px] shadow"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditProfile(false)}
                  type="button"
                  className="mt-5 w-[110px] rounded bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-[14px] shadow"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex min-w-[120px] flex-col">
            <button
              onClick={() => setEditProfile(!editProfile)}
              aria-label="Edit details"
              className="mb-2 self-end"
            >
              <BsFillPencilFill />
            </button>
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
        <p className="my-3 text-center">Currency:</p>
        <div className="flex gap-5">
          <button
            onClick={() => setCurrency("£")}
            className={`${
              currencySymbol === "£" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] rounded border border-[#f0c14b] text-xl shadow hover:bg-[#f7dfa5]`}
          >
            £
          </button>
          <button
            onClick={() => setCurrency("€")}
            className={`${
              currencySymbol === "€" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] rounded border border-[#f0c14b] text-xl shadow hover:bg-[#f7dfa5]`}
          >
            €
          </button>
          <button
            onClick={() => setCurrency("$")}
            className={`${
              currencySymbol === "$" && "bg-[#f7dfa5]"
            } h-[40px] w-[40px] rounded border border-[#f0c14b] text-xl shadow hover:bg-[#f7dfa5]`}
          >
            $
          </button>
        </div>
      </div>
      <div className="my-3 flex flex-col items-center gap-7">
        <button onClick={() => logOut()} className="flex items-center gap-2">
          <HiOutlineLogout className="text-3xl" />
          <p className="text-lg font-semibold">Log out</p>
        </button>
        {user && user.email !== TEST_ACCOUNT_EMAIL && (
          <button
            onClick={confirmDelete}
            className="border-[3px] border-red-400 p-1 text-red-400"
          >
            Delete account
          </button>
        )}
      </div>
    </div>
  );
}
