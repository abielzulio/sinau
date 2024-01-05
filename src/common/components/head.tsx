import NextHead from "next/head";
import { PRODUCTION_DOMAIN } from "../constant";

const Head = ({
  title = "Sinau — Generative learning path platform",
  description = "Sinau is a generative learning path platform to help anyone learn any subject from zero knowledge. It's a platform to guide and help you to learn anything that was unthinkable before.",
  image = `${PRODUCTION_DOMAIN}/og.png`,
}: {
  title?: string;
  description?: string;
  image?: string;
}) => {
  return (
    <NextHead>
      <link rel="icon" href="/brand/sinau-white.svg" type="image/svg+xml" />
      <title>Sinau</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta itemProp="image" content={image} />
      <meta
        property="og:logo"
        content={`${PRODUCTION_DOMAIN}/sinau-black.png`}
      ></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@abielzulio" />
      <meta name="twitter:creator" content="@abielzulio" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </NextHead>
  );
};

export default Head;
