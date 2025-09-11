import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Product } from '../types';

interface ProductSectionProps {
  product: Product;
  index: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({ product, index }) => {
  return (
    <section className="mb-12 border-t border-gray-200 pt-8">
      <h3 className="text-xl md:text-2xl font-semibold text-slate-800">{`${index}. ${product.name}`}</h3>
      
      <a href={product.link} target="_blank" rel="noopener noreferrer sponsored" className="block my-4">
        {product.imageUrl && (
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full max-w-xs mx-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            />
        )}
      </a>

      {(product.rating || product.reviewCount) && (
        <div className="flex items-center justify-center text-sm text-slate-500 my-4">
          {product.rating && <span>⭐ {product.rating}/5</span>}
          {product.rating && product.reviewCount && <span className="mx-2">|</span>}
          {product.reviewCount && <span>리뷰 {product.reviewCount}개</span>}
        </div>
      )}

      <div className="prose prose-slate max-w-none lg:prose-lg mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {product.description}
        </ReactMarkdown>
      </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-bold text-emerald-800">👍 장점</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700">
            {product.pros.map((pro, i) => <li key={i} className="text-sm md:text-base">{pro}</li>)}
          </ul>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h4 className="font-bold text-rose-800">👎 단점</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700">
            {product.cons.map((con, i) => <li key={i} className="text-sm md:text-base">{con}</li>)}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <a href={product.link} target="_blank" rel="noopener noreferrer sponsored" 
          className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          최저가 확인하기
        </a>
      </div>
    </section>
  );
};

export default ProductSection;
