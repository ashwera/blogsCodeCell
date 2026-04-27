import React from 'react';
import { Link } from 'react-router-dom';

const dummyBlogs = [
  { id: 1, title: 'The Future of Minimalist Design in 2026', status: 'Published', date: 'Oct 12, 2026', color: 'bg-black text-[#F5EDE0]' },
  { id: 2, title: 'Why Typography Matters More Than Ever', status: 'Draft', date: 'Oct 10, 2026', color: 'bg-[#C1121F] text-white' },
  { id: 3, title: 'Editorial Grids for the Web', status: 'Published', date: 'Oct 05, 2026', color: 'bg-transparent border-t-2 border-black text-black' },
  { id: 4, title: 'White Space: The Invisible Element', status: 'Published', date: 'Sep 28, 2026', color: 'bg-transparent border-t-2 border-black text-black' },
  { id: 5, title: 'Brutalism vs. Minimalism', status: 'Draft', date: 'Sep 22, 2026', color: 'bg-[#C1121F] text-white' },
];

export default function BlogList() {
  return (
    <div className="p-12 xl:p-24 max-w-7xl mx-auto">
      <header className="mb-16 flex justify-between items-end border-b-4 border-black pb-8">
        <h1 
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Index
        </h1>
        <span className="text-sm uppercase tracking-widest font-mono mb-2">
          {dummyBlogs.length} Entries
        </span>
      </header>

      <div className="flex flex-col gap-8 md:gap-12">
        {dummyBlogs.map((blog, index) => (
          <article 
            key={blog.id} 
            className={`p-8 md:p-12 transition-transform hover:-translate-y-1 duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 ${blog.color}`}
          >
            <div className="flex-1">
              <div className="flex gap-4 items-center mb-4">
                <span className="text-xs uppercase tracking-widest font-mono font-bold">
                  {blog.date}
                </span>
                <span className="text-xs uppercase tracking-widest font-mono px-2 py-1 border border-current rounded-full">
                  {blog.status}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {blog.title}
              </h2>
            </div>
            
            <Link 
              to="/admin/editor" 
              className="inline-flex items-center justify-center shrink-0 w-16 h-16 rounded-full border border-current hover:scale-110 transition-transform duration-300"
            >
              <span className="sr-only">Edit</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
