import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Sparkles, Search, Download, 
  Upload, Tag, Edit3, Eye, Loader2, CheckCircle 
} from 'lucide-react';
import { api } from '../../services/api';
import { Note } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // New Note Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Operating Systems');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('OS, Midterm');

  // Document Upload Simulator
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadContent, setUploadContent] = useState('');

  useEffect(() => {
    api.getNotes().then((fetched) => {
      setNotes(fetched);
      if (fetched.length > 0) setSelectedNote(fetched[0]);
    });
  }, []);

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = selectedSubject === 'All' || n.subject === selectedSubject;
    return matchesSearch && matchesSub;
  });

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    const updated = await api.updateNote(selectedNote.id, {
      title: selectedNote.title,
      content: selectedNote.content,
      tags: selectedNote.tags
    });
    if (updated) {
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
      setSelectedNote(updated);
      setIsEditorMode(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await api.deleteNote(id);
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    setSelectedNote(remaining.length > 0 ? remaining[0] : null);
  };

  const handleSummarize = async () => {
    if (!selectedNote || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const summary = await api.summarizeNote(selectedNote.id);
      setSelectedNote({ ...selectedNote, summary });
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, summary } : n));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedNote || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const questions = await api.generateNoteQuestions(selectedNote.id);
      alert(`🎯 AI Questions Generated from Notes:\n\n${questions.slice(0, 400)}...\n\n(Full questions stored in note)`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const created = await api.createNote({
      title: newTitle,
      subject: newSubject,
      content: newContent || '# ' + newTitle + '\n\nStart typing notes here...',
      tags: tagsArr
    });

    setNotes(prev => [created, ...prev]);
    setSelectedNote(created);
    setIsNewModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setUploadContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImportDocument = async () => {
    if (!uploadedFileName) return;
    const created = await api.createNote({
      title: uploadedFileName.replace(/\.[^/.]+$/, ''),
      subject: 'Imported Documents',
      content: uploadContent || `# Imported from ${uploadedFileName}\n\nDocument contents imported successfully.`,
      tags: ['Imported', 'Document']
    });

    setNotes(prev => [created, ...prev]);
    setSelectedNote(created);
    setIsUploadModalOpen(false);
    setUploadedFileName('');
    setUploadContent('');
  };

  const exportNote = () => {
    if (!selectedNote) return;
    const element = document.createElement("a");
    const file = new Blob([selectedNote.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedNote.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Notes & Documents</h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Markdown document manager, document ingestion, and AI study summarization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#151923] hover:bg-[#1C2230] text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold transition-all"
          >
            <Upload size={14} className="text-indigo-400" />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus size={14} />
            <span>Create Note</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Note List (4 cols) & Editor/Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notes List */}
        <div className="lg:col-span-4 bg-[#151923] border border-[#232936] rounded-xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Search & Subject Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes content..."
                className="w-full bg-[#0B0D12] border border-[#232936] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Operating Systems', 'Data Structures & Algorithms', 'Database Systems'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedSubject === sub 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-[#0B0D12] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {sub.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes items */}
          <div className="space-y-2">
            {filteredNotes.map(n => {
              const isSelected = selectedNote?.id === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNote(n)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-[#F8FAFC]'
                      : 'bg-[#0B0D12] border-[#232936] hover:border-slate-700 text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#F8FAFC] line-clamp-1">{n.title}</h4>
                    <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">
                      {n.updatedAt ? n.updatedAt.split('T')[0] : 'Recent'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                    {n.summary || n.content.replace(/#|\*|`/g, '').slice(0, 100)}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {n.tags.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#151923] text-indigo-300 border border-[#232936]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Viewer & AI Actions */}
        <div className="lg:col-span-8 space-y-6">
          {selectedNote ? (
            <div className="bg-[#151923] border border-[#232936] rounded-xl p-6 space-y-6">
              {/* Note Header & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232936]">
                <div>
                  <Badge variant="purple">{selectedNote.subject}</Badge>
                  <h2 className="text-xl font-bold text-[#F8FAFC] mt-1">{selectedNote.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditorMode(!isEditorMode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0D12] hover:bg-[#1C2230] text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold"
                  >
                    {isEditorMode ? <Eye size={13} /> : <Edit3 size={13} />}
                    <span>{isEditorMode ? 'Preview' : 'Edit Note'}</span>
                  </button>

                  <button
                    onClick={exportNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0D12] hover:bg-[#1C2230] text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold"
                    title="Export Markdown"
                  >
                    <Download size={13} />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-[#232936]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* AI Quick Actions Bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-[#0B0D12] border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Sparkles size={15} />
                  <span>AI Study Operations</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSummarize}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30"
                  >
                    {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>AI Summarize</span>
                  </button>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C2230] hover:bg-[#232936] disabled:opacity-50 text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold"
                  >
                    <span>Generate 3 Exam Questions</span>
                  </button>
                </div>
              </div>

              {/* AI Summary Box */}
              {selectedNote.summary && (
                <div className="p-4 rounded-xl bg-[#0B0D12] border border-indigo-500/30 space-y-2">
                  <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>AI Executive Summary & Takeaways</span>
                  </div>
                  <div className="text-xs text-[#F8FAFC] leading-relaxed whitespace-pre-line font-sans">
                    {selectedNote.summary}
                  </div>
                </div>
              )}

              {/* Editor or Markdown View */}
              {isEditorMode ? (
                <div className="space-y-4">
                  <textarea
                    rows={16}
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-[#232936] rounded-xl p-4 font-mono text-xs text-[#F8FAFC] leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditorMode(false)}
                      className="px-4 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#0B0D12] border border-[#232936] min-h-[300px]">
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F8FAFC] leading-relaxed whitespace-pre-line font-sans">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-[#94A3B8] bg-[#151923] border border-[#232936] rounded-xl">
              Select or create a study note to view content.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Note */}
      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="Create New Study Note">
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#94A3B8]">Note Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g., Virtual Memory Page Replacement Algorithms"
              className="mt-1 w-full bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#94A3B8]">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="mt-1 w-full bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="Data Structures & Algorithms">Data Structures</option>
                <option value="Database Management Systems">Database Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="AI & Machine Learning">AI & ML</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#94A3B8]">Tags (comma separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Paging, LRU, Memory"
                className="mt-1 w-full bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#94A3B8]">Initial Content (Markdown supported)</label>
            <textarea
              rows={6}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="# Introduction..."
              className="mt-1 w-full bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              Create Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Document Upload Simulator */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document / Syllabus File">
        <div className="space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Select a text or markdown file from your computer, or paste lecture transcript notes below.
          </p>

          <div className="p-6 border-2 border-dashed border-[#232936] hover:border-indigo-500/50 rounded-xl text-center space-y-2 cursor-pointer transition-colors bg-[#0B0D12]">
            <Upload size={24} className="mx-auto text-indigo-400" />
            <div className="text-xs font-semibold text-[#F8FAFC]">Click to select file (.txt, .md, .pdf)</div>
            <div className="text-[11px] text-[#94A3B8]">Supports UTF-8 document formats</div>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="opacity-0 absolute inset-0 cursor-pointer"
            />
          </div>

          {uploadedFileName && (
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
              <span className="font-semibold">{uploadedFileName}</span>
              <CheckCircle size={15} className="text-emerald-400" />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#94A3B8]">Document Preview / Extracted Text</label>
            <textarea
              rows={5}
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              placeholder="Extracted file text will appear here..."
              className="mt-1 w-full bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!uploadedFileName && !uploadContent}
              onClick={handleImportDocument}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              Import as Study Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
