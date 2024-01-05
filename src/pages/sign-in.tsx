import { SignIn } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSidePropsContext } from "next";

export default function SignInPage() {
  return <SignIn />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const auth = getAuth(ctx.req);

  if (auth.userId) {
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
