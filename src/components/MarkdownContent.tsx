import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose lg:prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:shadow-sm prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-ul:list-disc prose-ol:list-decimal">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Override list rendering for better spacing and styling
          ul: ({node, ...props}) => <ul className="pl-5 list-disc space-y-2 my-4" {...props} />,
          ol: ({node, ...props}) => <ol className="pl-5 list-decimal space-y-2 my-4" {...props} />,
          li: ({node, ...props}) => <li className="pl-1 marker:text-blue-500" {...props} />,
          // Style checkbox items
          input: ({node, ...props}) => {
            if (props.type === 'checkbox') {
              return (
                <input
                  {...props}
                  disabled={false}
                  className="mr-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              );
            }
            return <input {...props} />;
          },
          // Custom heading styles
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-800" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
