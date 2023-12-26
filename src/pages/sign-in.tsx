import { Button } from "@/common/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const onSignIn = () => {
    void signIn("google", { callbackUrl: "/" });
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-white ">
      <div className="flex flex-col gap-[20px] text-center">
        <p className="text-xl font-medium">Welcome to Sinau</p>
        <Button variant="default" size="lg" onClick={onSignIn}>
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
