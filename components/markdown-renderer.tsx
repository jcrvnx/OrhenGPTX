"use client"

import { ErrorBoundary } from 'react-error-boundary'
import ReactMarkdown from "react-markdown"
import { CodeBlock } from "@/components/ui/code-block"

const languageDisplayNames: Record<string, string> = {
  js: "JavaScript",
  jsx: "React JSX",
  ts: "TypeScript",
  tsx: "React TSX",
  html: "HTML",
  css: "CSS",
  python: "Python",
  ruby: "Ruby",
  rust: "Rust",
  cpp: "C++",
  c: "C",
  java: "Java",
  go: "Go",
  php: "PHP",
  sql: "SQL",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  bash: "Bash",
  shell: "Shell",
  powershell: "PowerShell",
  dockerfile: "Dockerfile",
}

interface MarkdownRendererProps {
  content: string
}

function FallbackComponent({ error }: { error: Error }) {
  return (
    <div className="text-red-500 p-4">
      Error rendering markdown: {error.message}
    </div>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            if (!children) return null;
            
            const match = /language-(\w+)/.exec(className || '')
            
            if (!inline && match) {
              const language = match[1]
              const code = String(children).replace(/\n$/, '')
              const displayName = languageDisplayNames[language] || language.toUpperCase()
              
              return (
                <CodeBlock 
                  code={code}
                  language={language}
                  title={displayName}
                  showLineNumbers={true}
                />
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-2">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-2">{children}</ol>
          },
          li({ children }) {
            return <li className="text-foreground ml-4">• {children}</li>
          },
          p({ children }) {
            return <p className="mb-4 leading-relaxed">{children}</p>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </ErrorBoundary>
  )
}

export default MarkdownRenderer


