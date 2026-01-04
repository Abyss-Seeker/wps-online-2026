import React, { useState, useEffect, useRef, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import DocumentViewer from './components/DocumentViewer';
import StatusBar from './components/StatusBar';
import { TableRow } from './types';
import { parseTextToRows, generateInitialData } from './utils';

const STORAGE_KEY_DATA = 'wps_clone_default_data';
const STORAGE_KEY_SHORTCUT = 'wps_clone_shortcut';

const App: React.FC = () => {
  // 1. Initialize data. 
  // We use a ref for the default state to ensure "Violent" instant access (zero disk/parsing latency on restore).
  const defaultDataRef = useRef<TableRow[]>([]);

  // Load initial state
  const initializeState = (): TableRow[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        defaultDataRef.current = parsed;
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved default", e);
    }
    const initial = generateInitialData();
    defaultDataRef.current = initial;
    return initial;
  };

  const [data, setData] = useState<TableRow[]>(initializeState);
  const [shortcut, setShortcut] = useState<string>(() => localStorage.getItem(STORAGE_KEY_SHORTCUT) || 'F9');
  
  // Modal State
  const [showShortcutDialog, setShowShortcutDialog] = useState(false);
  const [tempShortcut, setTempShortcut] = useState('');

  // --- Actions ---

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        // Parse uploaded text and mix with dummy data in checkerboard pattern
        const rows = parseTextToRows(text);
        setData(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = useCallback(() => {
    // VIOLENT RESTORE: Synchronous state update from memory. Zero latency.
    setData([...defaultDataRef.current]); 
  }, []);

  const handleSaveAsDefault = () => {
    if (window.confirm("是否将当前文档视图保存为“默认工作状态”？\n(按恢复键时将瞬间回到此状态)")) {
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
        defaultDataRef.current = [...data]; // Update the memory ref immediately
        alert("设置成功！当前状态已保存为默认恢复状态。");
      } catch (e) {
        alert("保存失败，可能是数据量过大。");
      }
    }
  };

  // Open the custom modal instead of prompt
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

  const handleUpdateRow = (id: number, field: keyof TableRow, value: string) => {
    setData(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // --- Keyboard Listener ---

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal is open
      if (showShortcutDialog) return;

      // Check for match. Support single letters (assumed with Alt) or Function keys
      const targetKey = shortcut.toLowerCase();
      const pressedKey = e.key.toLowerCase();

      let match = false;
      if (targetKey.length === 1) {
         // Single letter -> Require Alt modifier to avoid typing accidents
         if (e.altKey && pressedKey === targetKey) match = true;
      } else {
         // Function keys or specific keys (Enter, Escape, F1...) -> No modifier needed
         if (pressedKey === targetKey) match = true;
      }

      if (match) {
        e.preventDefault();
        handleRestore();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, handleRestore, showShortcutDialog]);

  const wordCount = data.reduce((acc, row) => acc + row.opinionContent.length + row.modificationSuggestion.length, 0);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative">
      <Toolbar 
        onFileUpload={handleFileUpload} 
        onRestore={handleRestore}
        onConfigDefault={handleSaveAsDefault}
        onConfigShortcut={handleOpenShortcutDialog}
      />
      
      <DocumentViewer data={data} onUpdateRow={handleUpdateRow} />
      
      <StatusBar pageCount={Math.ceil(data.length / 5)} wordCount={wordCount} />

      {/* Custom Shortcut Settings Modal */}
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
    </div>
  );
};

export default App;
