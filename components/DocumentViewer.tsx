import React from 'react';
import { TableRow } from '../types';

interface DocumentViewerProps {
  data: TableRow[];
  onUpdateRow: (id: number, field: keyof TableRow, value: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ data, onUpdateRow }) => {
  
  // Helper to handle blur event and update parent state
  const handleBlur = (id: number, field: keyof TableRow, e: React.FocusEvent<HTMLTableCellElement>) => {
    const newValue = e.currentTarget.innerText;
    onUpdateRow(id, field, newValue);
  };

  return (
    <div className="flex-1 bg-[#1a1a1a] overflow-auto p-8 flex justify-center relative">
      {/* Ruler placeholder - Top */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-[#1e1e1e] border-b border-[#333] flex text-[10px] text-gray-600 items-end justify-center">
         <div className="w-[800px] flex justify-between px-2">
            {[...Array(40)].map((_, i) => <div key={i} className={`h-1 w-[1px] bg-gray-600 ${i % 5 === 0 ? 'h-2 bg-gray-500' : ''}`}></div>)}
         </div>
      </div>

      {/* Ruler placeholder - Left */}
      <div className="absolute top-6 bottom-0 left-0 w-6 bg-[#1e1e1e] border-r border-[#333] flex flex-col text-[10px] text-gray-600 items-end py-2">
            {[...Array(60)].map((_, i) => <div key={i} className={`w-1 h-[1px] bg-gray-600 my-2 ${i % 5 === 0 ? 'w-2 bg-gray-500' : ''}`}></div>)}
      </div>

      {/* The Paper */}
      <div className="bg-[#1c1c1c] w-[850px] min-h-[1100px] shadow-2xl p-[70px] mt-4 mb-8 text-gray-300 font-serif border border-[#333]">
        
        {/* Document Header */}
        <div className="text-center mb-8 relative">
            <h1 className="text-3xl font-bold tracking-widest text-gray-200 mb-6 font-sans">意见汇总表</h1>
            <div className="flex justify-between text-sm font-sans text-gray-400 items-end">
                <div className="text-left space-y-1">
                    <div>标准项目名称：人形机器人技术要求 第6部分：定位导航</div>
                    <div className="flex items-center gap-2">
                        <span className="border border-gray-500 w-4 h-4 flex items-center justify-center text-[10px]">+</span>
                        <span>负责起草单位：</span>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <div>共 1 页 第 1 页</div>
                    <div className="flex gap-4">
                        <span>承办人：</span>
                        <span>年 月 日填写</span>
                    </div>
                </div>
            </div>
            {/* Corner Icon */}
             <div className="absolute top-10 right-0 p-1 border border-blue-400 bg-white/10">
                <div className="w-4 h-4 text-blue-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
            </div>
        </div>

        {/* The Table */}
        <table className="w-full border-collapse border border-gray-500 text-sm table-fixed">
            <thead>
                <tr className="bg-[#2a2a2a] text-center font-bold text-gray-200">
                    <th className="border border-gray-500 p-2 w-12">序号</th>
                    <th className="border border-gray-500 p-2 w-20">标准章条编号</th>
                    <th className="border border-gray-500 p-2 w-[30%]">意见内容</th>
                    <th className="border border-gray-500 p-2 w-[30%]">修改建议</th>
                    <th className="border border-gray-500 p-2 w-20">提出单位</th>
                    <th className="border border-gray-500 p-2 w-20">处理意见</th>
                    <th className="border border-gray-500 p-2 w-16">备注</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-[#252525]">
                        <td className="border border-gray-500 p-2 text-center text-gray-400">{row.id}</td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'clauseNumber', e)}
                          className="border border-gray-500 p-2 text-center text-gray-400 focus:bg-[#333] focus:text-white outline-none cursor-text"
                        >
                          {row.clauseNumber}
                        </td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'opinionContent', e)}
                          className="border border-gray-500 p-2 text-gray-300 leading-relaxed whitespace-pre-wrap text-justify focus:bg-[#333] focus:text-white outline-none cursor-text"
                        >
                            {row.opinionContent}
                        </td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'modificationSuggestion', e)}
                          className="border border-gray-500 p-2 text-gray-300 leading-relaxed whitespace-pre-wrap text-justify focus:bg-[#333] focus:text-white outline-none cursor-text"
                        >
                            {row.modificationSuggestion}
                        </td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'proposingUnit', e)}
                          className="border border-gray-500 p-2 text-center text-gray-400 focus:bg-[#333] focus:text-white outline-none cursor-text align-middle"
                        >
                           {row.proposingUnit}
                        </td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'handlingOpinion', e)}
                          className="border border-gray-500 p-2 text-center text-gray-400 focus:bg-[#333] focus:text-white outline-none cursor-text align-middle"
                        >
                             {row.handlingOpinion}
                        </td>
                        <td 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur(row.id, 'remarks', e)}
                          className="border border-gray-500 p-2 text-center text-gray-400 focus:bg-[#333] focus:text-white outline-none cursor-text align-middle"
                        >
                             {row.remarks}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {/* Footer info in paper */}
        <div className="mt-4 text-xs text-gray-500">
             注：技术审查会时需填写“处理意见”。
        </div>

      </div>
      
      {/* Scrollbar overlay graphic from screenshot */}
      <div className="absolute right-1 top-1/2 h-20 w-1.5 bg-gray-600 rounded-full opacity-50"></div>
    </div>
  );
};

export default DocumentViewer;
