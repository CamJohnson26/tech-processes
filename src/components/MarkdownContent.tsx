import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose lg:prose-lg max-w-none">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </article>
  );
}
