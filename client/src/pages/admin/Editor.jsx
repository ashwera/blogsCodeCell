import React, { useState } from 'react';

export default function Editor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  return (
    <div className="relative h-full flex flex-col">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 bg-[#F5EDE0] border-b-2 border-black px-8 py-4 flex justify-between items-center">
        <div className="text-sm uppercase tracking-widest font-mono font-bold flex items-center gap-4">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
          Drafting
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border-2 border-black text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-[#F5EDE0] transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-[#C1121F] text-white border-2 border-[#C1121F] text-xs uppercase tracking-widest font-bold hover:bg-black hover:border-black transition-colors">
            Publish
          </button>
        </div>
      </div>

      <div className="p-8 md:p-16 xl:p-24 max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Title Input */}
        <input
          type="text"
          placeholder="ARTICLE TITLE..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-5xl md:text-7xl font-black uppercase tracking-tighter placeholder-black/20 mb-12"
          style={{ fontFamily: 'var(--font-heading)' }}
        />

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-y-2 border-black py-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-mono font-bold">Tags (Comma Separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Design, Editorial, Web"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-transparent border-b border-black/20 outline-none py-2 font-mono text-sm focus:border-black transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-mono font-bold">Cover Image URL</label>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                placeholder="https://..."
                className="bg-transparent border-b border-black/20 outline-none py-2 font-mono text-sm focus:border-black transition-colors flex-1"
              />
              <button className="text-xs uppercase font-bold tracking-widest border border-black px-3 py-1 hover:bg-black hover:text-[#F5EDE0]">
                Upload
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center border-l-2 border-black/20 pl-8">
            <label className="text-xs uppercase tracking-widest font-mono font-bold flex items-center justify-between cursor-pointer">
              <span>Publish Status</span>
              <div 
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${isPublished ? 'bg-[#C1121F]' : 'bg-black/20'}`}
                onClick={() => setIsPublished(!isPublished)}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>
            <span className="text-xs font-mono text-black/50">
              {isPublished ? 'Ready to go live.' : 'Currently a draft.'}
            </span>
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 flex flex-col relative group">
          <label className="sr-only">Article Content</label>
          <textarea
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[50vh] min-h-[400px] bg-transparent border-none outline-none text-xl leading-relaxed resize-none placeholder-black/30 font-serif"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
