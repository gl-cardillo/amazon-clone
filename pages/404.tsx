import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="mx-auto mt-8 flex w-[220px] flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Sorry page not found :(</h2>
      <button
        onClick={() => router.push("/")}
        className="mt-5 border border-gray-300 bg-linear-to-b from-[#f7dfa5] to-[#f0c14b] p-4 text-sm"
      >
        Go back to home!
      </button>
    </div>
  );
}
