import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/context";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function Singin() {
  const [showSignin, setShowSignin] = useState(true);
  const [errorSignin, setErrorSignin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);

  const schemaSingin = yup.object().shape({
    name: yup
      .string()
      .min(2)
      .max(50)
      .matches(/^[a-zA-Z0-9 _]{0,}$/, {
        message: "Special character not allowed.",
      })
      .required("name is a required field"),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8)
      .max(15)
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?])[A-Za-z\d@$!%*#?]{8,}$/, {
        message:
          "Password must be eight characters, at least one letter, one number and one special character(@$!%*#?)",
      })
      .required(),
  });

  const schemaLogin = yup.object().shape({
    emailLogin: yup.string().email().required("Email is required"),
    passwordLogin: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSingin),
  });

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: yupResolver(schemaLogin),
  });

  const signin = async (data) => {
    try {
      const response = await axios.post("/api/auth/singin", data);
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("user_amazon_lc", JSON.stringify(user));
      localStorage.setItem("token_amazon_lc", JSON.stringify(token));
      axios.defaults.headers.Authorization = `Bearer ${token}`;

      router.push("/");
    } catch (error) {
      setErrorSignin(err.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const login = async (data) => {
    if (!data) {
      data = { emailLogin: "testAccount@example.com" };
    }

    try {
      const response = await axios.post("/api/auth/login", data);
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("user_amazon_lc", JSON.stringify(user));
      localStorage.setItem("token_amazon_lc", JSON.stringify(token));
      axios.defaults.headers.Authorization = `Bearer ${token}`;

      router.push("/");
    } catch (error) {
      setErrorLogin(error.response.data.message);
    }
  };

  return (
    <div className=" flex flex-col mx-3 xs:mx-auto xs:max-w-[400px] my-10 ">
      <h2 className="text-3xl font-semibold self-start">Welcome</h2>
      <div className=" shadow-md max-w-[400px]  border-gray-300 bg-white rounded-md mt-3">
        <div
          className={`rounded-t-md border-t-2 p-4 ${
            !showSignin ? " bg-slate-100" : ""
          }`}
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
                New to amazon?
              </span>
            </h3>
          </div>
          <div className={showSignin ? "" : "hidden"}>
            <p className="text-[12px] text-red-600 pl-4 pt-2">{errorSignin}</p>
            <form
              className="flex flex-col mx-1"
              id="singin"
              onSubmit={handleSubmit(signin)}
            >
              <label htmlFor="name" className="pl-2 py-2 font-semibold">
                First and last name
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300 focus:border-transparent focus:ring-0"
                type="text"
                id="name"
                {...register("name")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.name?.message}
              </p>
              <label htmlFor="email" className="pl-2 py-2 font-semibold">
                Email
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300 focus:border-transparent focus:ring-0"
                type="email"
                id="email"
                {...register("email")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.email?.message}
              </p>
              <label htmlFor="password" className="pl-2 py-2 font-semibold">
                Password
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300 focus:border-transparent focus:ring-0"
                type="password"
                id="password"
                {...register("password")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.password?.message}
              </p>
              <button
                type="submit"
                form="singin"
                className="mt-5 p-3 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
        <div
          className={`rounded-b-md border-t-2 p-4 ${
            showSignin ? " bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="singin"
              onChange={() => setShowSignin(false)}
              checked={!showSignin}
              className="h-4 w-4 checked:ring-orange-400  text-orange-400 checked:bg-orange-400 hover:bg-orange-400 focus:border-transparent focus:ring-0"
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
            <p className="text-[12px] text-red-600 pl-4 pt-2">{errorLogin}</p>
            <form
              className="flex flex-col mx-1"
              onSubmit={handleSubmitLogin(login)}
            >
              <label htmlFor="emailLogin" className="pl-2 py-2 font-semibold">
                Email
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300 focus:border-transparent focus:ring-0"
                type="email"
                id="email_login"
                {...registerLogin("emailLogin")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errorsLogin?.emailLogin?.message}
              </p>
              <label
                htmlFor="passwordLogin"
                className="pl-2 py-2 font-semibold"
              >
                Password
              </label>
              <input
                className="p-2.5 rounded-[3px] border-solid border-1 border-slate-400 focus:outline-orange-300 focus:border-transparent focus:ring-0"
                type="password"
                id="password_login"
                {...registerLogin("passwordLogin")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errorsLogin?.passwordLogin?.message}
              </p>
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
      <div className="flex flex-col items-center mt-[30px] gap-2">
        <p className="w-[100px] text-center border-b border-black  leading-[0.1em]">
          <span className="p-2 bg-[#f1f5f9]">or</span>
        </p>
        <button
          className="mt-5 p-4 text-sm border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
          onClick={() => login()}
        >
          Login with test account
        </button>
      </div>
    </div>
  );
}
