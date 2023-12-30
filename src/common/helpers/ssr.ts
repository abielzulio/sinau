import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
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
    props: {
      user: session.user,
    },
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
    const auth = await handleAuth(ctx);

    if ("props" in auth) {
      const { subject_id } = ctx.query;

      if (typeof subject_id !== "string") {
        return redirectTo("/subject");
      }

      const data = await db.subject.findUnique({
        where: { id: subject_id },
        select: {
          id: true,
          name: true,
          cover: true,
          isCompleted: true,
          createdAt: true,
          updatedAt: true,
          lastActiveModuleId: true,
          lastSelectedModuleId: true,
          modules: {
            select: {
              id: true,
              title: true,
              overview: true,
              video: {
                select: {
                  id: true,
                  title: true,
                  cover: true,
                  url: true,
                  transcript: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        return redirectTo("/subject");
      }

      return {
        props: {
          ...auth.props,
          subject: JSON.parse(JSON.stringify(data)) as typeof data,
        },
      };
    }

    return auth;
  };
};
