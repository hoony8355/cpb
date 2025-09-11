import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FaqItem } from '../types';

interface FaqSectionProps {
  faqItems: FaqItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqItems }) => {
  return (
    <div className="mt-12 bg-slate-100 p-6 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
            {faqItems.map((item, index) => (
                <details key={index} className="bg-white p-4 rounded-lg shadow-sm group">
                    <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                        {item.question}
                        <span className="text-slate-400 group-open:rotate-90 transition-transform duration-200">&#9656;</span>
                    </summary>
                    <div className="mt-3 pt-3 border-t text-slate-600">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {item.answer}
                      </ReactMarkdown>
                    </div>
                </details>
            ))}
        </div>
    </div>
  );
};

export default FaqSection;
