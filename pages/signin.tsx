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
    <div className="mx-3 my-10 flex flex-col xs:mx-auto xs:max-w-[400px]">
      <h2 className="self-start text-3xl font-semibold">Welcome</h2>
      <div className="mt-3 max-w-[400px] rounded-md border-gray-300 bg-white shadow-md">
        <div
          className={`rounded-t-md border-t-2 p-4 ${
            !showSignup ? "bg-slate-100" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="authMode"
              onChange={() => setShowSignup(true)}
              checked={showSignup}
              className="h-4 w-4 text-orange-400 checked:bg-orange-400 checked:ring-orange-400 hover:bg-orange-400"
            />
            <h3 className="text-medium text-[14px] font-bold">
              Create account.
              <span className="text-md text-[13px] font-bold">
                New to amazon?
              </span>
            </h3>
          </div>
          <div className={showSignup ? "" : "hidden"}>
            <p className="pl-4 pt-2 text-[12px] text-red-600">{errorSignup}</p>
            <form
              className="mx-1 flex flex-col"
              id="signup"
              onSubmit={handleSubmit(signup)}
            >
              <label htmlFor="name" className="py-2 pl-2 font-semibold">
                First and last name
              </label>
              <input
                className="border-1 rounded-[3px] border-solid border-slate-400 p-2.5 focus:border-transparent focus:outline-orange-300 focus:ring-0"
                type="text"
                id="name"
                {...register("name")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errors?.name?.message}
              </p>
              <label htmlFor="email" className="py-2 pl-2 font-semibold">
                Email
              </label>
              <input
                className="border-1 rounded-[3px] border-solid border-slate-400 p-2.5 focus:border-transparent focus:outline-orange-300 focus:ring-0"
                type="email"
                id="email"
                {...register("email")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errors?.email?.message}
              </p>
              <label htmlFor="password" className="py-2 pl-2 font-semibold">
                Password
              </label>
              <input
                className="border-1 rounded-[3px] border-solid border-slate-400 p-2.5 focus:border-transparent focus:outline-orange-300 focus:ring-0"
                type="password"
                id="password"
                {...register("password")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errors?.password?.message}
              </p>
              <button
                type="submit"
                form="signup"
                className="mt-5 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] p-3"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
        <div
          className={`rounded-b-md border-t-2 p-4 ${
            showSignup ? "bg-slate-100" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="authMode"
              onChange={() => setShowSignup(false)}
              checked={!showSignup}
              className="h-4 w-4 text-orange-400 checked:bg-orange-400 checked:ring-orange-400 hover:bg-orange-400 focus:border-transparent focus:ring-0"
            />
            <h3 className="text-medium text-[14px] font-bold">
              Sign-In.
              <span className="text-md text-[13px] font-bold">
                {" "}
                Already a customer?
              </span>
            </h3>
          </div>
          <div className={showSignup ? "hidden" : ""}>
            <p className="pl-4 pt-2 text-[12px] text-red-600">{errorLogin}</p>
            <form
              className="mx-1 flex flex-col"
              onSubmit={handleSubmitLogin(login)}
            >
              <label htmlFor="emailLogin" className="py-2 pl-2 font-semibold">
                Email
              </label>
              <input
                className="border-1 rounded-[3px] border-solid border-slate-400 p-2.5 focus:border-transparent focus:outline-orange-300 focus:ring-0"
                type="email"
                id="emailLogin"
                {...registerLogin("emailLogin")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errorsLogin?.emailLogin?.message}
              </p>
              <label
                htmlFor="passwordLogin"
                className="py-2 pl-2 font-semibold"
              >
                Password
              </label>
              <input
                className="border-1 rounded-[3px] border-solid border-slate-400 p-2.5 focus:border-transparent focus:outline-orange-300 focus:ring-0"
                type="password"
                id="passwordLogin"
                {...registerLogin("passwordLogin")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errorsLogin?.passwordLogin?.message}
              </p>
              <button
                className="mt-5 rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] p-3"
                type="submit"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-[30px] flex flex-col items-center gap-2">
        <p className="w-[100px] border-b border-black text-center leading-[0.1em]">
          <span className="bg-[#f1f5f9] p-2">or</span>
        </p>
        <button
          className="mt-5 border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] p-4 text-sm"
          onClick={() => login()}
        >
          Login with test account
        </button>
      </div>
    </div>
  );
}
