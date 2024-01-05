import { getAuth } from "@clerk/nextjs/server";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

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

const handleAuth = async (ctx: GetServerSidePropsContext) => {
  const auth = getAuth(ctx.req);

  if (!auth.userId) {
    return redirectToAuth;
  }

  if (ctx.req.url === "/") {
    return redirectTo("/subject");
  }

  return {
    props: {},
  };
};

export type WithAuthType = InferGetServerSidePropsType<
  ReturnType<typeof withAuth>
>;

export const withAuth = () => {
  return async (ctx: GetServerSidePropsContext) => {
    return await handleAuth(ctx);
  };
};

export type WithSubjectType = InferGetServerSidePropsType<
  ReturnType<typeof withSubject>
>;

export const withSubject = () => {
  return async (ctx: GetServerSidePropsContext) => {
    return await handleAuth(ctx);
  };
};
