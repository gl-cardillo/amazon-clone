import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
export default function singin() {
  const [showSignin, setShowSignin] = useState(true);
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(2)
      .max(50)
      .matches(/^[a-zA-Z0-9]{0,}$/, {
        message: "Special character not allowed.",
      })
      .required("Name is a required field"),
    email: yup.string().email().required(),
    emailLogin: yup.string().email().required(),
    password: yup
      .string()
      .min(8)
      .max(15)
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?])[A-Za-z\d@$!%*#?]{8,}$/, {
        message:
          "Password must be eight characters, at least one letter, one number and one special character(@$!%*#?)",
      })
      .required(),
    passwordLogin: yup
      .string()
      .min(8)
      .max(15)
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?])[A-Za-z\d@$!%*#?]{8,}$/, {
        message:
          "Password must be eight characters, at least one letter, one number and one special character(@$!%*#?)",
      })
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const signin = (data) => {};
  const login = (data) => {};

  return (
    <div className=" flex flex-col mx-3 md:max-w-[400px] md:mx-auto my-10 ">
      <h2 className="text-3xl font-semibold self-start">Welcome</h2>
      <div className=" max-w-[400px] border-sold border-2 border-gray-300 bg-white rounded-md mt-3">
        <div
          className={` border-t-2 p-4 ${!showSignin ? " bg-slate-100" : ""}`}
        >
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="singin"
              onChange={() => setShowSignin(true)}
              checked={showSignin}
              className="h-4 w-4 checked:ring-orange-400 text-orange-400 checked:bg-orange-400 hover:bg-orange-400"
            />
            <h3 className="font-bold text-medium text-[14px]">
              Create account.
              <span className="text-md font-bold text-[13px]">
                {" "}
                New to amazon?
              </span>
            </h3>
          </div>
          <div className={showSignin ? "" : "hidden"}>
            <form
              className="flex flex-col mx-1"
              onSubmit={handleSubmit(signin)}
            >
              <label htmlFor="name" className="pl-2 py-2 font-semibold">
                First and last name
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300"
                type="text"
                id="name"
                {...register("name")}
              />
              <p>{errors?.name?.message}</p>
              <label htmlFor="email" className="pl-2 py-2 font-semibold">
                Email
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300"
                type="email"
                id="email"
                {...register("email")}
              />
              <p>{errors?.email?.message}</p>
              <label htmlFor="password" className="pl-2 py-2 font-semibold">
                Password
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300"
                type="password"
                id="password"
                {...register("password")}
              />
              <p>{errors?.password?.message}</p>
              <button
                type="submit"
                className="mt-5 p-3 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
        <div className={` border-t-2 p-4 ${showSignin ? " bg-slate-100" : ""}`}>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="singin"
              onChange={() => setShowSignin(false)}
              checked={!showSignin}
              className="h-4 w-4 checked:ring-orange-400 text-orange-400 checked:bg-orange-400 hover:bg-orange-400"
            />
            <h3 className="font-bold text-medium text-[14px]">
              Sign-In.
              <span className="text-md font-bold text-[13px]">
                {" "}
                Already a customer?
              </span>
            </h3>
          </div>
          <div className={showSignin ? "hidden" : ""}>
            <form className="flex flex-col mx-1" onSubmit={handleSubmit(login)}>
              <label htmlFor="email" className="pl-2 py-2 font-semibold">
                Email
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300"
                type="email"
                id="email"
                {...register("email")}
              />
              <p>{errors?.emailLogin?.message}</p>
              <label htmlFor="password" className="pl-2 py-2 font-semibold">
                Password
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300"
                type="password"
                id="password"
                {...register("password")}
              />
              <p>{errors?.passwordLogin?.message}</p>
              <button
                className="mt-5 p-3 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                type="submit"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
