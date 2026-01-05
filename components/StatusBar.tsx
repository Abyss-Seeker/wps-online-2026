import React from 'react';
import { Layout, Maximize, Minus, Plus, Sliders } from 'lucide-react';

interface StatusBarProps {
  pageCount: number;
  wordCount: number;
  currentPage: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ pageCount, wordCount, currentPage }) => {
  return (
    <div className="h-7 bg-[#1e1e1e] border-t border-[#333] flex items-center justify-between px-2 text-[11px] text-gray-400 select-none">
      <div className="flex items-center gap-4">
        <span className="hover:bg-[#333] px-1 cursor-pointer">第 {currentPage} 页，共 {pageCount} 页</span>
        <span className="hover:bg-[#333] px-1 cursor-pointer">{wordCount} 个字</span>
        <span className="hover:bg-[#333] px-1 cursor-pointer flex items-center gap-1"><Layout size={12} /> 简体中文(中国大陆)</span>
        <span className="hover:bg-[#333] px-1 cursor-pointer flex items-center gap-1">辅助功能: 不可用</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hover:bg-[#333] px-1 cursor-pointer flex items-center gap-1"><Maximize size={12} /> 专注</span>
        <div className="flex items-center gap-2">
            <Layout size={14} className="cursor-pointer hover:text-white" />
            <div className="p-0.5 bg-[#444] rounded text-white cursor-pointer"><Layout size={14} /></div>
            <Sliders size={14} className="cursor-pointer hover:text-white" />
        </div>
        <div className="flex items-center gap-2 w-48">
             <Minus size={12} className="cursor-pointer hover:text-white" />
             <div className="h-1 bg-gray-600 rounded-full flex-1 relative group cursor-pointer">
                 <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-2 h-2 bg-white rounded-full group-hover:scale-125 transition-transform"></div>
             </div>
             <Plus size={12} className="cursor-pointer hover:text-white" />
             <span className="w-8 text-right">110%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
