import { Button } from "@/common/components/ui/button";
import { Image } from "@/common/components/ui/image";
import { useUser } from "@/common/hooks/user";
import { getServerAuthSession } from "@/server/auth";
import { BookOpenText, MessagesSquare, MonitorPlay, User } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Balancer from "react-wrap-balancer";

export default function HomePage() {
  const { isAuthenticated } = useUser();
  const { push } = useRouter();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isRendered) return;
    setIsRendered(true);
  }, []);

  return (
    <main className="min-w-screen flex h-fit min-h-screen flex-col bg-gradient-to-b from-off-white to-indigo-200">
      <nav className="mx-auto flex w-full flex-row items-center justify-between px-[18px] py-[18px] md:w-3/4 md:px-[24px]">
        <div className="flex flex-row items-center gap-[10px]">
          <Image
            src="/brand/sinau-black.svg"
            alt="Sinau Logo"
            className="h-[18px] w-[18px]"
          />
          <p className="font-medium">Sinau</p>
        </div>
        <div className="flex flex-row items-center gap-[15px]">
          {isAuthenticated ? (
            <Button onClick={() => push("/subject")}>Open Dashboard</Button>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => push("/sign-in")}
              icon={{ icon: User }}
            >
              Login
            </Button>
          )}
        </div>
      </nav>
      <section className="flex w-full">
        <div className="mx-auto mt-[40px] flex w-full flex-col items-center gap-[40px] px-[12px] text-center">
          <div className="flex w-full flex-col items-center gap-[20px]">
            <div className="w-3/4 text-5xl font-medium tracking-tight lg:w-1/2">
              <h1>Learn towards the unthinkable</h1>
            </div>
            <p className="text-lg font-normal opacity-50 md:text-xl">
              <Balancer>
                Sinau is a generative module-based learning path platform to
                help anyone learn any subject with zero knowledge. It's a
                platform to guide and help you to learn anything that was
                unthinkable before.
              </Balancer>
            </p>
            <Button
              onClick={() => push("/sign-up")}
              icon={{ icon: BookOpenText }}
            >
              Start Learn Now
            </Button>
          </div>
          {/** TODO: Replace this with loom  */}
          {isRendered ? (
            <div className="relative h-[300px] w-full md:h-[450px] md:w-[900px]">
              <ReactPlayer
                width="100%"
                height="100%"
                controls
                url="https://www.youtube.com/watch?v=seqLW_jFnCs"
                light={<Image src="/sinau-app.png" alt="Sinau Logo" />}
              />
            </div>
          ) : null}

          <div className="grid w-full grid-rows-2 gap-[30px] px-[24px] text-left text-[14px] opacity-50 md:w-[80vw] md:grid-cols-2 xl:w-[50vw]">
            <div className="flex flex-col gap-[3px]">
              <MonitorPlay size={24} className="mb-[15px]" />
              <p className="font-semibold">Module-based learning path</p>
              <p>
                Each sub-topic will have relevant Youtube video, summarized
                reading material & references, and quiz to help you understand
                deeper
              </p>
            </div>
            <div className="flex flex-col gap-[3px]">
              <MessagesSquare size={24} className="mb-[15px]" />
              <p className="font-medium">AI-assisted Contextualized chatbot</p>
              <p>
                Still don't understand the topic? No worry. We have a
                contextualized chatbot to answer all your curiosity
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="mx-auto flex w-full flex-col items-center px-[18px] py-[18px] pb-[40px] text-center md:w-3/4 md:px-[24px]">
        <p className="opacity-50">© Sinau, 2023. Indonesia.</p>
      </footer>
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
