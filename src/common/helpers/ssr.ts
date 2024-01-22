import db from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
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

export const redirectToAuth = redirectTo("/sign-in");

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

    const userHaveSubject = await db.query.subject.findFirst({
      columns: {
        id: true,
      },
      where: (subject, { eq }) =>
        eq(subject.id, subject_id) && eq(subject.userId, user.id),
    });

    if (!userHaveSubject) return redirectTo("/subject");

    return {
      props: {},
    };
  };
};
