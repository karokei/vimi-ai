'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    created_at: string;
}

export default function NovelPromotionDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/novel-promotion/projects');
            const data = await res.json();
            if (Array.isArray(data)) setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/novel-promotion/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, original_text: text }),
            });
            if (res.ok) {
                setName('');
                setText('');
                fetchProjects();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Novel Promotion Workspace</h1>

            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold">Tạo dự án mới</h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <input
                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-3 text-white"
                        placeholder="Tên tiểu thuyết"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <textarea
                        className="w-full bg-neutral-800 border-neutral-700 rounded-lg p-3 text-white h-32"
                        placeholder="Nội dung tiểu thuyết (chương 1 hoặc tóm tắt)..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Bắt đầu dự án
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Đang tải...</p>
                ) : projects.length === 0 ? (
                    <p className="text-neutral-500">Chưa có dự án nào.</p>
                ) : (
                    projects.map((proj) => (
                        <Link key={proj.id} href={`/novel-promotion/${proj.id}`}>
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group">
                                <h3 className="font-bold text-lg group-hover:text-blue-400">{proj.name}</h3>
                                <p className="text-xs text-neutral-500 mt-2">
                                    {new Date(proj.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
