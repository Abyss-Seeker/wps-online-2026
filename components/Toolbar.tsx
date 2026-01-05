import React, { useRef, useState } from 'react';
import { 
  Clipboard, Scissors, Paintbrush, 
  Bold, Italic, Underline, Strikethrough, Highlighter, Type,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ChevronDown, 
  Search, Minus, Square, X,
  Save, Undo, Redo, Bell, Settings,
  RotateCcw, FileSearch, MessageSquareText, LayoutGrid
} from 'lucide-react';
import { MENUS, STYLES } from '../constants';

interface ToolbarProps {
  onFileUpload: (file: File) => void;
  onRestore: () => void;
  onConfigDefault: () => void;
  onConfigShortcut: () => void;
  onConfigRowsPerPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onFileUpload, 
  onRestore, 
  onConfigDefault, 
  onConfigShortcut,
  onConfigRowsPerPage,
  onPrevPage,
  onNextPage,
  autoScroll,
  onToggleAutoScroll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const handleSecretClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col bg-[#1e1e1e] border-b border-[#333]">
      {/* Secret Input */}
      <input 
        type="file" 
        accept=".txt" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* Window Controls & Title Bar */}
      <div className="flex justify-between items-center px-2 py-1 h-8 text-xs select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
             {/* Quick Access Toolbar */}
             <Save size={14} className="hover:text-white cursor-pointer" title="保存 (Ctrl+S)" />
             <div className="w-[1px] h-3 bg-gray-600 mx-1"></div>
             {/* The RESTORE Button */}
             <RotateCcw 
                size={14} 
                className="hover:text-white cursor-pointer text-yellow-500" 
                title="一键恢复 (快捷键可配置)"
                onClick={onRestore}
             />
             <div className="w-[1px] h-3 bg-gray-600 mx-1"></div>
             <Undo size={14} className="hover:text-white cursor-pointer" />
             <Redo size={14} className="hover:text-white cursor-pointer" />
          </div>
          <span className="text-gray-300 ml-4">定位导航意见汇总表.doc - 兼容性模式</span>
        </div>
        
        <div className="flex items-center bg-[#2d2d2d] border border-[#444] rounded px-2 py-0.5 w-64 mx-auto">
          <Search size={14} className="text-gray-500 mr-2" />
          <input type="text" placeholder="搜索" className="bg-transparent border-none outline-none text-gray-300 w-full placeholder-gray-500" />
        </div>

        <div className="flex items-center gap-3 relative">
            <span className="text-[#f59e0b] cursor-pointer hover:text-white"><Bell size={16} /></span>
            
            {/* Settings Button */}
            <div 
              className="cursor-pointer text-gray-400 hover:text-white" 
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              title="配置"
            >
              <Settings size={16} />
            </div>

            {/* Hidden Config Menu */}
            {showConfigMenu && (
              <div className="absolute top-8 right-10 bg-[#2d2d2d] border border-[#444] rounded shadow-xl p-1 w-48 z-50 flex flex-col gap-1 text-gray-300">
                <button 
                  className="text-left px-2 py-1.5 hover:bg-[#3d3d3d] rounded text-[11px] w-full"
                  onClick={() => { setShowConfigMenu(false); onConfigDefault(); }}
                >
                  保存当前界面为默认
                </button>
                <button 
                  className="text-left px-2 py-1.5 hover:bg-[#3d3d3d] rounded text-[11px] w-full"
                  onClick={() => { setShowConfigMenu(false); onConfigShortcut(); }}
                >
                  设置一键恢复快捷键
                </button>
                <div className="h-[1px] bg-[#444] my-1"></div>
                <button 
                  className="text-left px-2 py-1.5 hover:bg-[#3d3d3d] rounded text-[11px] w-full"
                  onClick={() => { setShowConfigMenu(false); onConfigRowsPerPage(); }}
                >
                  设置每页行数 (渲染优化)
                </button>
                <button 
                  className="text-left px-2 py-1.5 hover:bg-[#3d3d3d] rounded text-[11px] w-full flex justify-between items-center"
                  onClick={() => { onToggleAutoScroll(); }}
                >
                  <span>翻页自动滚动</span>
                  <span className={autoScroll ? "text-green-400" : "text-gray-500"}>
                    {autoScroll ? "开启" : "关闭"}
                  </span>
                </button>
              </div>
            )}
            
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden">
                <img src="https://picsum.photos/30/30" alt="Avatar" className="w-full h-full object-cover opacity-80" />
            </div>

            <div className="flex items-center gap-4 ml-4 text-gray-400">
                <Minus size={16} className="hover:text-white cursor-pointer" />
                <Square size={14} className="hover:text-white cursor-pointer" />
                <X size={16} className="hover:text-red-500 cursor-pointer" />
            </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center px-2 text-[13px] text-gray-300 border-b border-[#333]">
        {MENUS.map((menu, index) => (
          <div 
            key={menu} 
            className={`px-3 py-1 cursor-pointer hover:bg-[#333] border-b-2 ${menu === "开始" ? "border-white text-white font-medium" : "border-transparent"}`}
          >
            {menu}
          </div>
        ))}
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 px-2 py-1 text-xs">
           <button className="flex items-center gap-1 border border-gray-600 rounded px-2 py-0.5 hover:bg-[#333]">
              <MessageSquareText size={14} /> 批注
           </button>
           <button className="flex items-center gap-1 border border-gray-600 rounded px-2 py-0.5 hover:bg-[#333]">
              编辑 <ChevronDown size={12} />
           </button>
           <button className="flex items-center gap-1 bg-blue-600 text-white rounded px-3 py-0.5 hover:bg-blue-500">
              <div className="rotate-180"><Undo size={14} /></div> 共享
           </button>
        </div>
      </div>

      {/* Main Toolbar Ribbon */}
      <div className="flex items-center px-2 py-2 gap-2 h-24 bg-[#1e1e1e] overflow-x-auto text-xs text-gray-400 whitespace-nowrap">
        
        {/* Clipboard Section - SECRET TRIGGER */}
        <div className="flex items-start gap-1 px-1 border-r border-[#333] pr-2 h-full">
          <div 
            className="flex flex-col items-center justify-center p-2 hover:bg-[#333] rounded cursor-pointer group"
            onClick={handleSecretClick}
            title="Paste content (Import File)"
          >
            <Clipboard size={28} className="text-[#facc15] mb-1 group-active:scale-95 transition-transform" />
            <span>粘贴</span>
          </div>
          <div className="flex flex-col gap-1 justify-center h-full">
            <div className="flex items-center gap-1 hover:bg-[#333] px-1 rounded cursor-pointer"><Scissors size={14} /> <span>剪切</span></div>
            <div className="flex items-center gap-1 hover:bg-[#333] px-1 rounded cursor-pointer"><Clipboard size={14} /> <span>复制</span></div>
            <div className="flex items-center gap-1 hover:bg-[#333] px-1 rounded cursor-pointer"><Paintbrush size={14} /> <span>格式刷</span></div>
          </div>
          <div className="self-end pb-1 text-[10px] text-gray-500 w-full text-center absolute bottom-0 left-0">剪贴板</div>
        </div>

        {/* Font Section */}
        <div className="flex flex-col gap-1 px-2 border-r border-[#333] h-full justify-center">
            <div className="flex gap-2 mb-1">
                <div className="flex items-center bg-[#2d2d2d] px-1 rounded border border-[#444] w-28 justify-between cursor-pointer">
                    <span className="text-white">宋体</span>
                    <ChevronDown size={12} />
                </div>
                <div className="flex items-center bg-[#2d2d2d] px-1 rounded border border-[#444] w-12 justify-between cursor-pointer">
                    <span className="text-white">五号</span>
                    <ChevronDown size={12} />
                </div>
                <div className="flex items-center gap-1">
                     <div 
                        className="px-1 hover:bg-[#333] rounded cursor-pointer font-serif font-bold text-lg active:scale-90 select-none"
                        onClick={onPrevPage}
                        title="上一页 (Prev Page)"
                     >
                        A<span className="text-[10px] align-top">^</span>
                     </div>
                     <div 
                        className="px-1 hover:bg-[#333] rounded cursor-pointer font-serif text-sm active:scale-90 select-none"
                        onClick={onNextPage}
                        title="下一页 (Next Page)"
                     >
                        A<span className="text-[10px] align-top">v</span>
                     </div>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <Bold size={16} className="cursor-pointer hover:text-white text-gray-300" />
                <Italic size={16} className="cursor-pointer hover:text-white" />
                <Underline size={16} className="cursor-pointer hover:text-white" />
                <Strikethrough size={16} className="cursor-pointer hover:text-white" />
                <div className="w-[1px] h-4 bg-[#444] mx-1"></div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#333] px-1 rounded">
                   <Type size={16} className="text-blue-400 fill-current border-b-2 border-blue-400" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#333] px-1 rounded">
                   <Highlighter size={16} className="text-yellow-400 border-b-2 border-yellow-400" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#333] px-1 rounded">
                   <span className="font-bold text-red-500 border-b-2 border-red-500 px-1">A</span>
                </div>
            </div>
            <div className="text-center text-[10px] text-gray-500 mt-auto">字体</div>
        </div>

        {/* Paragraph Section */}
        <div className="flex flex-col gap-1 px-2 border-r border-[#333] h-full justify-center">
             <div className="flex gap-2 items-center">
                <List size={16} className="cursor-pointer hover:text-white" />
                <ListOrdered size={16} className="cursor-pointer hover:text-white" />
                <LayoutGrid size={16} className="cursor-pointer hover:text-white" />
                <div className="w-[1px] h-4 bg-[#444] mx-1"></div>
                <AlignLeft size={16} className="cursor-pointer hover:text-white" />
                <AlignCenter size={16} className="cursor-pointer hover:text-white" />
                <AlignRight size={16} className="cursor-pointer hover:text-white" />
                <AlignJustify size={16} className="cursor-pointer hover:text-white" />
             </div>
             <div className="flex gap-2 items-center mt-1">
                 <div className="flex items-center justify-between w-full px-1 hover:bg-[#333] rounded cursor-pointer">
                    <span>≡</span> <ChevronDown size={10} />
                 </div>
                 <div className="bg-[#333] p-0.5 rounded cursor-pointer">
                    <span className="text-[10px]">Aa</span>
                 </div>
             </div>
             <div className="text-center text-[10px] text-gray-500 mt-auto">段落</div>
        </div>

        {/* Styles Section */}
        <div className="flex items-start gap-1 px-2 border-r border-[#333] h-full overflow-hidden">
             {STYLES.map((style) => (
                 <div key={style.name} className="flex flex-col items-center justify-center p-1 hover:bg-[#333] rounded cursor-pointer w-16 h-[50px] border border-transparent hover:border-[#555]">
                    <div className="bg-[#2d2d2d] w-full h-8 flex items-center justify-center text-white mb-1 overflow-hidden px-1">
                        <span className="truncate">{style.preview}</span>
                    </div>
                    <span className="text-[10px]">{style.name}</span>
                 </div>
             ))}
             <div className="flex flex-col justify-center h-[50px] ml-1">
                 <ChevronDown size={12} className="cursor-pointer hover:text-white" />
                 <ChevronDown size={12} className="cursor-pointer hover:text-white mt-2" />
             </div>
             <div className="text-center text-[10px] text-gray-500 mt-auto w-full absolute bottom-1">样式</div>
        </div>

        {/* Editing Section */}
         <div className="flex flex-col gap-2 px-2 h-full justify-center text-gray-300">
             <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                 <Search size={16} /> <span>查找</span>
             </div>
             <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                 <span className="font-bold text-sm">ab</span> <span>替换</span>
             </div>
             <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                 <FileSearch size={16} /> <span>选择</span>
             </div>
             <div className="text-center text-[10px] text-gray-500 mt-auto">编辑</div>
         </div>
      </div>
    </div>
  );
};

export default Toolbar;
