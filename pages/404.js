import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 mt-8 w-[220px] items-center mx-auto">
      <h2 className="font-bold text-xl">Sorry page not found :(</h2>
      <button onClick={() => router.push('/')} className="mt-5 p-4 text-sm border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]">
        Go back to home!
      </button>
    </div>
  );
}
