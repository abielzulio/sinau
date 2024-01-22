import { getServerAuthSession } from "@/server/auth";
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
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

  if (!session) {
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
    const { subject_id } = ctx.params as { subject_id: string };

    const { userId } = getAuth(ctx.req);

    const user = userId ? await clerkClient.users.getUser(userId) : null;

    if (!user?.id) {
      return redirectToAuth;
    }

    const userHaveSubject = await db.subject.findFirst({
      where: {
        id: subject_id,
        userId: user.id,
      },
    });

    if (!userHaveSubject) return redirectTo("/subject");

    return {
      props: {},
    };
  };
};
