import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  Eraser,
  Heading2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '請輸入詳細內容、待辦要點或備註事項...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value from props to contentEditable without resetting cursor during normal typing
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const handleHighlight = (color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('hiliteColor', false, color);
      handleInput();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700">
        <button
          type="button"
          id="btn-format-bold"
          onClick={() => executeCommand('bold')}
          title="粗體 (Ctrl+B)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-italic"
          onClick={() => executeCommand('italic')}
          title="斜體 (Ctrl+I)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-underline"
          onClick={() => executeCommand('underline')}
          title="底線 (Ctrl+U)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-strikethrough"
          onClick={() => executeCommand('strikeThrough')}
          title="刪除線"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          id="btn-format-h2"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          title="標題"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors flex items-center gap-0.5 text-xs font-semibold"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-list-ul"
          onClick={() => executeCommand('insertUnorderedList')}
          title="項目符號清單"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-list-ol"
          onClick={() => executeCommand('insertOrderedList')}
          title="編號清單"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="btn-format-quote"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          title="引用區塊"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Highlight Colors */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="btn-highlight-yellow"
            onClick={() => handleHighlight('#FEF08A')}
            title="黃色螢光筆"
            className="w-5 h-5 rounded-full bg-yellow-200 border border-yellow-400 hover:scale-110 transition-transform"
          />
          <button
            type="button"
            id="btn-highlight-green"
            onClick={() => handleHighlight('#BBF7D0')}
            title="綠色螢光筆"
            className="w-5 h-5 rounded-full bg-green-200 border border-green-400 hover:scale-110 transition-transform"
          />
          <button
            type="button"
            id="btn-highlight-pink"
            onClick={() => handleHighlight('#FBCFE8')}
            title="粉紅螢光筆"
            className="w-5 h-5 rounded-full bg-pink-200 border border-pink-400 hover:scale-110 transition-transform"
          />
          <button
            type="button"
            id="btn-highlight-blue"
            onClick={() => handleHighlight('#BAE6FD')}
            title="天藍螢光筆"
            className="w-5 h-5 rounded-full bg-sky-200 border border-sky-400 hover:scale-110 transition-transform"
          />
        </div>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          id="btn-format-clear"
          onClick={() => executeCommand('removeFormat')}
          title="清除格式"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 active:bg-slate-300 transition-colors ml-auto"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        id="rich-text-content-editable"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[130px] max-h-[260px] overflow-y-auto p-3 focus:outline-none text-slate-800 leading-relaxed text-sm prose prose-slate max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:font-normal empty:before:pointer-events-none"
        data-placeholder={placeholder}
      />
    </div>
  );
};
