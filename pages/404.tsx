import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="mx-auto mt-8 flex w-55 flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Sorry page not found :(</h2>
      <button
        onClick={() => router.push("/")}
        className="mt-5 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Go back to home!
      </button>
    </div>
  );
}
