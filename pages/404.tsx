import { useRouter } from "next/router";
import Button from "../components/ui/Button";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="mx-auto mt-8 flex w-55 flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Sorry page not found :(</h2>
      <Button size="lg" className="mt-5" onClick={() => router.push("/")}>
        Go back to home!
      </Button>
    </div>
  );
}
