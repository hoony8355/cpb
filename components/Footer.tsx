
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/90 border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Trend Spotter. All rights reserved.</p>
        <p className="text-xs mt-2">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
        <p className="text-[11px] mt-2 text-slate-400">실제 가격/혜택/재고는 판매처에서 최종 확인해 주세요.</p>
      </div>
    </footer>
  );
};

export default Footer;
