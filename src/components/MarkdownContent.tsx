import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

interface MarkdownContentProps {
  content: string;
}

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      aria-label="Copy code"
      title="Copy code to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
      )}
    </button>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose lg:prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:!p-0 prose-pre:!bg-transparent prose-pre:!border-0 prose-pre:!shadow-none prose-code:before:content-none prose-code:after:content-none prose-ul:list-disc prose-ol:list-decimal">
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
          // Custom code block with copy button
          code: ({node, inline, className, children, ...props}) => {
            if (inline) {
              return (
                <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md" {...props}>
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, '');
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return (
              <div className="relative group">
                <pre 
                  className="p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto text-sm my-6 shadow-lg border border-gray-800 font-mono"
                >
                  {language && (
                    <div className="absolute top-0 left-0 px-2 py-1 text-xs font-medium text-gray-300 bg-gray-800 rounded-br">
                      {language}
                    </div>
                  )}
                  <CopyButton text={codeText} />
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
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
