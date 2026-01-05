import React, { useState, useEffect, useRef, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import DocumentViewer from './components/DocumentViewer';
import StatusBar from './components/StatusBar';
import { TableRow, DocumentMeta } from './types';
import { parseTextToRows, generateInitialData, generateInitialMeta } from './utils';

const STORAGE_KEY_DATA = 'wps_clone_default_data';
const STORAGE_KEY_META = 'wps_clone_default_meta';
const STORAGE_KEY_SHORTCUT = 'wps_clone_shortcut';
const STORAGE_KEY_ROWS = 'wps_clone_rows_per_page';
const STORAGE_KEY_AUTO_SCROLL = 'wps_clone_auto_scroll';

const App: React.FC = () => {
  const defaultDataRef = useRef<TableRow[]>([]);
  const defaultMetaRef = useRef<DocumentMeta>(generateInitialMeta());

  // --- Initialization ---
  
  const initializeState = () => {
    let initialData: TableRow[];
    let initialMeta: DocumentMeta;

    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      const savedMeta = localStorage.getItem(STORAGE_KEY_META);
      
      initialData = savedData ? JSON.parse(savedData) : generateInitialData();
      initialMeta = savedMeta ? JSON.parse(savedMeta) : generateInitialMeta();
    } catch (e) {
      initialData = generateInitialData();
      initialMeta = generateInitialMeta();
    }

    defaultDataRef.current = initialData;
    defaultMetaRef.current = initialMeta;

    return { data: initialData, meta: initialMeta };
  };

  const [data, setData] = useState<TableRow[]>(() => initializeState().data);
  const [meta, setMeta] = useState<DocumentMeta>(() => initializeState().meta);
  
  const [shortcut, setShortcut] = useState<string>(() => localStorage.getItem(STORAGE_KEY_SHORTCUT) || 'F9');
  
  // Configurable Rows Per Page (Default 200)
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROWS);
    const parsed = saved ? parseInt(saved, 10) : 200;
    return isNaN(parsed) || parsed < 1 ? 200 : parsed;
  });

  // Auto Scroll Setting (Default true)
  const [autoScroll, setAutoScroll] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTO_SCROLL);
    return saved === null ? true : saved === 'true';
  });

  // Pagination State (Virtualization)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

  // Modals State
  const [showShortcutDialog, setShowShortcutDialog] = useState(false);
  const [tempShortcut, setTempShortcut] = useState('');
  
  const [showRowsDialog, setShowRowsDialog] = useState(false);
  const [tempRows, setTempRows] = useState('');

  const [showJumpDialog, setShowJumpDialog] = useState(false);
  const [tempPageNum, setTempPageNum] = useState('');

  // --- Actions ---

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const rows = parseTextToRows(text);
        setData(rows);
        setCurrentPage(1); // Reset to page 1 on new load
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = useCallback(() => {
    // VIOLENT RESTORE: Synchronous state update from memory.
    setData([...defaultDataRef.current]); 
    setMeta({...defaultMetaRef.current});
    setCurrentPage(1); // Reset to page 1
  }, []);

  const handleSaveAsDefault = () => {
    if (window.confirm("是否将当前文档视图（包括标题、正文、样式）保存为“默认工作状态”？\n(按恢复键时将瞬间回到此状态)")) {
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify(meta));
        
        defaultDataRef.current = [...data];
        defaultMetaRef.current = {...meta};
        
        alert("设置成功！当前状态已保存为默认恢复状态。");
      } catch (e) {
        alert("保存失败，可能是数据量过大。");
      }
    }
  };

  const handleToggleAutoScroll = () => {
    const newValue = !autoScroll;
    setAutoScroll(newValue);
    localStorage.setItem(STORAGE_KEY_AUTO_SCROLL, String(newValue));
  };

  // --- Shortcut Dialog Handlers ---
  const handleOpenShortcutDialog = () => {
    setTempShortcut(shortcut);
    setShowShortcutDialog(true);
  };

  const handleSaveShortcut = () => {
    if (tempShortcut) {
      const normalizedKey = tempShortcut.trim().length === 1 ? tempShortcut.toLowerCase() : tempShortcut;
      setShortcut(normalizedKey);
      localStorage.setItem(STORAGE_KEY_SHORTCUT, normalizedKey);
      setShowShortcutDialog(false);
    }
  };

  // --- Rows Per Page Dialog Handlers ---
  const handleOpenRowsDialog = () => {
    setTempRows(rowsPerPage.toString());
    setShowRowsDialog(true);
  };

  const handleSaveRows = () => {
    const parsed = parseInt(tempRows, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setRowsPerPage(parsed);
      localStorage.setItem(STORAGE_KEY_ROWS, parsed.toString());
      setCurrentPage(1); // Reset to page 1 to avoid out of bounds
      setShowRowsDialog(false);
    } else {
      alert("请输入有效的数字 (大于 0)");
    }
  };

  // --- Jump To Page Dialog Handlers ---
  const handleOpenJumpDialog = () => {
    setTempPageNum('');
    setShowJumpDialog(true);
  };

  const handleJumpToPage = () => {
    const page = parseInt(tempPageNum, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setShowJumpDialog(false);
    } else {
      alert(`请输入有效的页码 (1 - ${totalPages})`);
    }
  };

  // --- Data Updating ---

  const handleUpdateRow = (id: number, field: keyof TableRow, value: string) => {
    setData(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleUpdateMeta = (field: keyof DocumentMeta, value: string) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  // --- Pagination Control ---

  const handlePrevPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };

  // --- Keyboard Listener ---

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showShortcutDialog || showRowsDialog || showJumpDialog) return;

      const targetKey = shortcut.toLowerCase();
      const pressedKey = e.key.toLowerCase();

      let match = false;
      if (targetKey.length === 1) {
         if (e.altKey && pressedKey === targetKey) match = true;
      } else {
         if (pressedKey === targetKey) match = true;
      }

      if (match) {
        e.preventDefault();
        handleRestore();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, handleRestore, showShortcutDialog, showRowsDialog, showJumpDialog]);

  // Calculate stats
  const wordCount = data.reduce((acc, row) => acc + row.opinionContent.length + row.modificationSuggestion.length, 0);

  // Slice data for virtualization
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative">
      <Toolbar 
        onFileUpload={handleFileUpload} 
        onRestore={handleRestore}
        onConfigDefault={handleSaveAsDefault}
        onConfigShortcut={handleOpenShortcutDialog}
        onConfigRowsPerPage={handleOpenRowsDialog}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        autoScroll={autoScroll}
        onToggleAutoScroll={handleToggleAutoScroll}
        onJumpToPage={handleOpenJumpDialog}
      />
      
      <DocumentViewer 
        data={currentData} 
        meta={meta}
        currentPage={currentPage}
        totalPages={totalPages}
        onUpdateRow={handleUpdateRow}
        onUpdateMeta={handleUpdateMeta}
        autoScroll={autoScroll}
      />
      
      <StatusBar pageCount={totalPages} wordCount={wordCount} currentPage={currentPage} />

      {/* Shortcut Settings Modal */}
      {showShortcutDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
           <div className="bg-[#2d2d2d] border border-[#444] p-6 rounded-lg shadow-2xl w-[400px] text-gray-300">
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                设置一键恢复快捷键
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-2">请输入按键 (支持 F1-F12 或 单个字母):</label>
                <input 
                  autoFocus
                  type="text"
                  className="w-full bg-[#1e1e1e] border border-[#444] p-2 rounded text-white focus:outline-none focus:border-blue-500 font-mono text-center text-lg"
                  value={tempShortcut}
                  onChange={(e) => setTempShortcut(e.target.value)}
                  placeholder="例如: q 或 F9"
                />
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  <span className="text-yellow-500 font-bold">规则说明：</span><br/>
                  1. 如果输入单个字母 (如 'q')，实际快捷键为 <span className="text-gray-300 font-bold">Alt + Q</span>。<br/>
                  2. 如果输入功能键 (如 'F9', 'Escape')，则直接生效。
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#444] pt-4">
                 <button 
                  onClick={() => setShowShortcutDialog(false)} 
                  className="px-4 py-1.5 border border-[#444] rounded hover:bg-[#3d3d3d] text-sm transition-colors"
                 >
                   取消
                 </button>
                 <button 
                  onClick={handleSaveShortcut} 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm font-medium transition-colors"
                 >
                   保存设置
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Rows Per Page Settings Modal */}
      {showRowsDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
           <div className="bg-[#2d2d2d] border border-[#444] p-6 rounded-lg shadow-2xl w-[350px] text-gray-300">
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                设置每页行数
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-2">请输入每页显示的表格行数:</label>
                <input 
                  autoFocus
                  type="number"
                  min="1"
                  className="w-full bg-[#1e1e1e] border border-[#444] p-2 rounded text-white focus:outline-none focus:border-blue-500 font-mono text-center text-lg"
                  value={tempRows}
                  onChange={(e) => setTempRows(e.target.value)}
                  placeholder="默认: 200"
                />
                <p className="text-[11px] text-gray-500 mt-2">
                  默认值为 200 行。行数越多，页面越长。
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#444] pt-4">
                 <button 
                  onClick={() => setShowRowsDialog(false)} 
                  className="px-4 py-1.5 border border-[#444] rounded hover:bg-[#3d3d3d] text-sm transition-colors"
                 >
                   取消
                 </button>
                 <button 
                  onClick={handleSaveRows} 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm font-medium transition-colors"
                 >
                   保存设置
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Jump To Page Modal */}
      {showJumpDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
           <div className="bg-[#2d2d2d] border border-[#444] p-6 rounded-lg shadow-2xl w-[350px] text-gray-300">
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                跳转到指定页
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-2">请输入页码 (1 - {totalPages}):</label>
                <input 
                  autoFocus
                  type="number"
                  min="1"
                  max={totalPages}
                  className="w-full bg-[#1e1e1e] border border-[#444] p-2 rounded text-white focus:outline-none focus:border-blue-500 font-mono text-center text-lg"
                  value={tempPageNum}
                  onChange={(e) => setTempPageNum(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
                  placeholder={`当前: ${currentPage}`}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#444] pt-4">
                 <button 
                  onClick={() => setShowJumpDialog(false)} 
                  className="px-4 py-1.5 border border-[#444] rounded hover:bg-[#3d3d3d] text-sm transition-colors"
                 >
                   取消
                 </button>
                 <button 
                  onClick={handleJumpToPage} 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm font-medium transition-colors"
                 >
                   跳转
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
