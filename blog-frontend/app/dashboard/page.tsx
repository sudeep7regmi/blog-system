'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editBlog, setEditBlog] = useState<any>(null);
  const router = useRouter();

  // ---------------- FETCH BLOGS ----------------
  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.log('Blog fetch error:', err);
    }
  };

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await fetch('http://localhost:4000/api/auth/me', {
          credentials: 'include',
        });
  
        // 1. Handle unauthorized FIRST
        if (userRes.status === 401) {
          router.push('/');
          return;
        }
  
        // 2. Safely parse response
        const text = await userRes.text();
  
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.log("Invalid JSON from /me:",err, text);
          router.push('/');
          return;
        }
  
        // 3. Validate user object
        if (!data?.user?.id) {
          router.push('/');
          return;
        }
  
        // 4. Set user
        setCurrentUserId(data.user.id);
  
        // 5. Load blogs after auth success
        fetchBlogs();
  
      } catch (err) {
        console.log("Auth failed, retrying...",err);
        setTimeout(checkAuth, 1000);
      }
    };
  
    checkAuth();
  }, [router]);

  // ---------------- CREATE BLOG ----------------
  const handleCreate = async () => {
    if (!form.title || !form.content) {
      alert('Fill all fields');
      return;
    }

    await fetch('http://localhost:4000/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    setForm({ title: '', content: '' });
    fetchBlogs();
  };

  // ---------------- UPDATE OR CREATE ----------------
  const handleSubmit = async () => {
    if (editBlog) {
      await fetch(
        `http://localhost:4000/api/blogs/${editBlog.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      setEditBlog(null);
    } else {
      await handleCreate();
    }

    setForm({ title: '', content: '' });
    fetchBlogs();
  };

  // ---------------- EDIT ----------------
  const handleEdit = (blog: any) => {
    setEditBlog(blog);
    setForm({
      title: blog.title,
      content: blog.content,
    });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id: number) => {
    await fetch(
      `http://localhost:4000/api/blogs/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    fetchBlogs();
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await fetch(
      'http://localhost:4000/api/auth/logout',
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    router.push('/');
  };
  return (
    <div className="dashboard-layout">
  
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1>📘 Blog Panel</h1>
  
        <button className="btn btn-primary">🏠 Dashboard</button>
        <button className="btn btn-primary">➕ Create Blog</button>
  
        <div className="logout-container">
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
  
      {/* MAIN CONTENT */}
      <main className="main-content">
  
        {/* FORM */}
        <div className="form-container">
          <h2>{editBlog ? 'Edit Blog' : 'Create Blog'}</h2>
  
          <input
            value={form.title}
            placeholder="Title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
  
          <textarea
            value={form.content}
            placeholder="Content"
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />
  
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editBlog ? 'Update Blog' : 'Post Blog'}
          </button>
        </div>
  
        {/* BLOG GRID */}
        <div className="blog-grid">
          {blogs.map((blog: any) => (
            <div key={blog.id} className="blog-card">
  
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
  
              {Number(blog.userId) === Number(currentUserId) && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </button>
  
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
  
            </div>
          ))}
        </div>
          
      </main>
    </div>
  );
}