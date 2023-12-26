import { Button } from "@/common/components/ui/button";
import { Image } from "@/common/components/ui/image";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const onSignIn = () => {
    void signIn("google", { callbackUrl: "/" });
  };
  return (
    <main className="bg-off-white flex min-h-screen items-center justify-center ">
      <div className="flex w-[300px] flex-col items-center gap-[20px] rounded-md border-[1px] border-black/10 bg-white px-[24px] py-[36px] text-center">
        <Image
          src="/brand/sinau.svg"
          alt="Google Login"
          className="h-[24px] w-[24px] opacity-50"
        />
        <div className="flex flex-col gap-[5px]">
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-sm opacity-50">Please sign-in to continue</p>
        </div>
        <Button
          variant="default"
          size="default"
          onClick={onSignIn}
          className="w-full"
        >
          <Image
            src="/brand/google.png"
            alt="Google Login"
            className="mr-4 h-[16px] w-[16px]"
          />
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

  if (session) {
    return {
      redirect: {
        destination: "/subject",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
