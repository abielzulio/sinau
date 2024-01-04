import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown: React.FC<{
  text: string;
}> = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ node, ...props }) => <p {...props} className="m-0.5 p-0" />,
      ul: ({ node, ...props }) => (
        <ul {...props} className="m-0 list-inside list-disc p-0" />
      ),
      ol: ({ node, ...props }) => (
        <ol {...props} className="my-1 list-decimal pl-[20px]" />
      ),
      li: ({ node, ...props }) => <li {...props} className="leading-1 px-2" />,
      a: ({ node, ...props }) => (
        <a {...props} className="text-primary hover:underline" />
      ),
      strong: ({ node, ...props }) => (
        <strong {...props} className="font-bold" />
      ),
      em: ({ node, ...props }) => <em {...props} className="italic" />,
      del: ({ node, ...props }) => <del {...props} className="line-through" />,
      h1: ({ node, ...props }) => (
        <h1 {...props} className="my-4 text-2xl font-semibold" />
      ),
      h2: ({ node, ...props }) => (
        <h2 {...props} className="mb-1 mt-3 text-xl font-semibold" />
      ),
      h3: ({ node, ...props }) => (
        <h3 {...props} className="my-2 text-lg font-medium" />
      ),
      h4: ({ node, ...props }) => <h4 {...props} className="my-2 text-lg" />,
      h5: ({ node, ...props }) => <h5 {...props} className="my-1 text-base" />,
      h6: ({ node, ...props }) => <h6 {...props} className="my-1 text-sm" />,
    }}
  >
    {text}
  </ReactMarkdown>
);

export default Markdown;
