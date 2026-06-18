import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content) return null;

  // Split content by code blocks to separate code from text
  const parts = content.split(/(```[\s\S]*?```)/g);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderTextBlock = (text: string, blockIndex: number) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listType: 'bullet' | 'numeric' | null = null;

    const flushList = (key: string) => {
      if (listItems.length === 0) return;
      if (listType === 'bullet') {
        elements.push(
          <ul id={`ul-${key}`} key={`ul-${key}`} className="list-disc pl-5 my-3 text-slate-700 space-y-1.5 text-sm">
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`} className="leading-relaxed">
                {parseInlineStyles(item)}
              </li>
            ))}
          </ul>
        );
      } else if (listType === 'numeric') {
        elements.push(
          <ol id={`ol-${key}`} key={`ol-${key}`} className="list-decimal pl-5 my-3 text-slate-700 space-y-1.5 text-sm">
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`} className="leading-relaxed">
                {parseInlineStyles(item)}
              </li>
            ))}
          </ol>
        );
      }
      listItems = [];
      listType = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // End of blank line might flush list
      if (!line.trim()) {
        flushList(`empty-${i}`);
        continue;
      }

      // 1. Headings
      if (line.startsWith('# ')) {
        flushList(`h1-${i}`);
        elements.push(
          <h1 id={`h1-${blockIndex}-${i}`} key={`h1-${i}`} className="font-display text-2xl font-bold text-slate-800 border-b border-slate-100 pb-2 mt-6 mb-3">
            {parseInlineStyles(line.slice(2))}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList(`h2-${i}`);
        elements.push(
          <h2 id={`h2-${blockIndex}-${i}`} key={`h2-${i}`} className="font-display text-xl font-bold text-slate-800 mt-5 mb-2.5">
            {parseInlineStyles(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList(`h3-${i}`);
        elements.push(
          <h3 id={`h3-${blockIndex}-${i}`} key={`h3-${i}`} className="font-display text-lg font-semibold text-slate-800 mt-4 mb-2">
            {parseInlineStyles(line.slice(4))}
          </h3>
        );
      } 
      // 2. Unordered lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.slice(2);
        if (listType !== 'bullet' && listType !== null) {
          flushList(`flush-bef-bullet-${i}`);
        }
        listType = 'bullet';
        listItems.push(itemContent);
      }
      // 3. Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/);
        const itemContent = match ? match[2] : line;
        if (listType !== 'numeric' && listType !== null) {
          flushList(`flush-bef-num-${i}`);
        }
        listType = 'numeric';
        listItems.push(itemContent);
      }
      // 4. Blockquotes
      else if (line.startsWith('> ')) {
        flushList(`quote-${i}`);
        elements.push(
          <blockquote id={`quote-${blockIndex}-${i}`} key={`quote-${i}`} className="border-l-4 border-streamlit pl-4 py-1.5 my-3 bg-slate-50 text-slate-600 italic text-sm rounded-r-md">
            {parseInlineStyles(line.slice(2))}
          </blockquote>
        );
      }
      // 5. Standard paragraph
      else {
        flushList(`para-before-${i}`);
        elements.push(
          <p id={`p-${blockIndex}-${i}`} key={`para-${i}`} className="text-slate-700 leading-relaxed mb-3 text-sm">
            {parseInlineStyles(line)}
          </p>
        );
      }
    }

    // Flush any remaining list elements
    flushList(`flush-end-${blockIndex}`);
    
    return <div key={`text-block-${blockIndex}`}>{elements}</div>;
  };

  // Parses inline elements: `code`, **bold**, *italics*
  const parseInlineStyles = (text: string) => {
    // Escape or deal with common math terms $...$ simply by stripping or italicizing
    let processedText = text;
    
    // Convert math delimiters like $2600\text{Wh}$ to italic accents
    processedText = processedText.replace(/\$(.*?)\$/g, '$1');

    // Split by inline code tag: `text`
    const codeParts = processedText.split(/(`[^`]+`)/g);

    return codeParts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeText = part.slice(1, -1);
        return (
          <code key={`inline-${index}`} className="font-mono text-xs bg-slate-100 text-streamlit border border-slate-200 px-1 py-0.5 rounded font-medium">
            {codeText}
          </code>
        );
      }

      // Handle bold **text** and italics *text*
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          const boldText = subPart.slice(2, -2);
          return (
            <strong key={`bold-${subIndex}`} className="font-semibold text-slate-900">
              {boldText}
            </strong>
          );
        }

        const italicParts = subPart.split(/(\*[^*]+\*)/g);
        return italicParts.map((item, itemIndex) => {
          if (item.startsWith('*') && item.endsWith('*')) {
            const italicText = item.slice(1, -1);
            return (
              <em key={`ital-${itemIndex}`} className="italic text-slate-800">
                {italicText}
              </em>
            );
          }
          return item;
        });
      });
    });
  };

  return (
    <div className="space-y-2">
      {parts.map((p, index) => {
        if (p.startsWith('```') && p.endsWith('```')) {
          // Parse code block
          const lines = p.split('\n');
          const firstLine = lines[0].replace('```', '').trim();
          const language = firstLine || 'code';
          const codeLines = lines.slice(1, -1).join('\n');
          
          return (
            <div id={`codeblock-container-${index}`} key={`code-block-${index}`} className="group relative my-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 text-slate-300">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-850 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>{language}</span>
                <button
                  id={`btn-copy-${index}`}
                  onClick={() => copyToClipboard(codeLines, index)}
                  className="flex items-center gap-1 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                  title="Copy to Clipboard"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Code Pre */}
              <pre className="p-4 overflow-x-auto font-mono text-xs text-emerald-400 leading-relaxed bg-slate-950">
                <code>{codeLines}</code>
              </pre>
            </div>
          );
        } else {
          return renderTextBlock(p, index);
        }
      })}
    </div>
  );
}
