import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn path="/sign-in" redirectUrl="/subject" />;
}
