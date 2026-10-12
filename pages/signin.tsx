import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  loginSchema,
  type LoginInput,
  type SignupInput,
} from "../utils/schemas";
import { errorMessage, useLogin, useMe, useSignup } from "../hooks/useAuth";

export default function SignIn() {
  const [showSignup, setShowSignup] = useState(true);
  const router = useRouter();
  const { user } = useMe();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const errorSignup = signupMutation.isError
    ? errorMessage(signupMutation.error)
    : "";
  const errorLogin = loginMutation.isError
    ? errorMessage(loginMutation.error)
    : "";

  // also runs right after a successful login or signup
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const signup = (data: SignupInput) => signupMutation.mutate(data);

  // called without data by the test account button
  const login = (data?: LoginInput) => loginMutation.mutate(data);

  return (
    <div className=" flex flex-col mx-3 xs:mx-auto xs:max-w-[400px] my-10 ">
      <h2 className="text-3xl font-semibold self-start">Welcome</h2>
      <div className=" shadow-md max-w-[400px]  border-gray-300 bg-white rounded-md mt-3">
        <div
          className={`rounded-t-md border-t-2 p-4 ${
            !showSignup ? " bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="authMode"
              onChange={() => setShowSignup(true)}
              checked={showSignup}
              className="h-4 w-4 checked:ring-orange-400 text-orange-400 checked:bg-orange-400 hover:bg-orange-400"
            />
            <h3 className="font-bold text-medium text-[14px]">
              Create account.
              <span className="text-md font-bold text-[13px]">
                New to amazon?
              </span>
            </h3>
          </div>
          <div className={showSignup ? "" : "hidden"}>
            <p className="text-[12px] text-red-600 pl-4 pt-2">{errorSignup}</p>
            <form
              className="flex flex-col mx-1"
              id="signup"
              onSubmit={handleSubmit(signup)}
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
                form="signup"
                className="mt-5 p-3 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
        <div
          className={`rounded-b-md border-t-2 p-4 ${
            showSignup ? " bg-slate-100" : ""
          }`}
        >
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="authMode"
              onChange={() => setShowSignup(false)}
              checked={!showSignup}
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
          <div className={showSignup ? "hidden" : ""}>
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
                id="emailLogin"
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
                id="passwordLogin"
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
