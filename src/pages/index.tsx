import { withAuth } from "@/common/helpers/ssr";

export default function HomePage() {
  return <p>home</p>;
}

export const getServerSideProps = withAuth();
