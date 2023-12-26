import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { GetServerSidePropsContext } from "next";

export const redirectTo = (path: string) => ({
  redirect: {
    destination: path,
    permanent: false,
  },
});

export const redirectToAuth = {
  redirect: {
    destination: "/sign-in",
    permanent: false,
  },
};

export const withAuth = () => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

    if (!session) {
      return redirectToAuth;
    }

    if (ctx.req.url === "/") {
      return redirectTo("/subject");
    }

    return {
      props: {
        session,
      },
    };
  };
};
