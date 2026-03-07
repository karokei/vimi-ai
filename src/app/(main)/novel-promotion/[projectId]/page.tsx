'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function WorkspacePage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<any>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'script' | 'storyboard' | 'video' | 'voice'>('overview');

    useEffect(() => {
        if (!projectId) return;
        fetchOverview();
        fetchCharacters();
        fetchEpisodes();
    }, [projectId]);

    const fetchOverview = async () => {
        const res = await fetch(`/api/novel-promotion/projects?id=${projectId}`);
        const data = await res.json();
        setProject(data);
    };

    const fetchCharacters = async () => {
        const res = await fetch(`/api/novel-promotion/assets?projectId=${projectId}&type=characters`);
        const data = await res.json();
        if (Array.isArray(data)) setCharacters(data);
    };

    const fetchEpisodes = async () => {
        const res = await fetch(`/api/novel-promotion/assets?projectId=${projectId}&type=episodes`);
        const data = await res.json();
        if (Array.isArray(data)) setEpisodes(data);
    };

    const triggerStoryToScript = async () => {
        await fetch('/api/novel-promotion/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'story-to-script', projectId, content: project.original_text, locale: 'vi' })
        });
        alert('Đã gửi yêu cầu phân tích truyện. Vui lòng đợi trong giây lát!');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                <h1 className="text-3xl font-bold">{project?.name || 'Loading...'}</h1>
                <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                    {['overview', 'characters', 'script', 'storyboard', 'video', 'voice'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'text-blue-400 font-bold border-b-2 border-blue-400'
                                    : 'text-neutral-400 hover:text-neutral-200 transition-colors'
                                }`}
                        >
                            {tab === 'overview' ? 'Tổng quan' :
                                tab === 'characters' ? 'Nhân vật' :
                                    tab === 'script' ? 'Kịch bản' :
                                        tab === 'storyboard' ? 'Phân cảnh' :
                                            tab === 'video' ? 'Video' : 'Lồng tiếng'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                        <h2 className="text-xl font-bold">Thao tác AI</h2>
                        <div className="flex gap-4">
                            <button onClick={triggerStoryToScript} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-all shadow-md">
                                🧠 Phân tích Truyện (Story to Script)
                            </button>
                        </div>
                        <p className="text-sm text-neutral-400 max-w-2xl">Bấm vào nút trên để AI đọc nội dung truyện gốc, tự động chia tập và trích xuất danh sách nhân vật. Quá trình này sẽ chạy ngầm.</p>
                    </div>
                </div>
            )}

            {activeTab === 'characters' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {characters.map(char => (
                        <div key={char.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col items-center p-4">
                            <div className="w-24 h-24 bg-neutral-800 rounded-full mb-4 flex items-center justify-center text-3xl">
                                👤
                            </div>
                            <h3 className="font-bold text-lg">{char.name}</h3>
                            <p className="text-xs text-neutral-400 text-center mt-2 line-clamp-3">{char.introduction}</p>
                            <button className="mt-4 w-full bg-neutral-800 hover:bg-neutral-700 py-2 rounded text-sm text-blue-400">Xem chi tiết</button>
                        </div>
                    ))}
                    {characters.length === 0 && <p className="text-neutral-500 col-span-full text-center py-12">Chưa có nhân vật nào được phân tích.</p>}
                </div>
            )}

            {activeTab === 'script' && (
                <div className="space-y-6">
                    {episodes.map(ep => (
                        <div key={ep.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-blue-900/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-blue-400">Tập {ep.number}: {ep.title}</h3>
                            </div>
                            <p className="text-sm text-neutral-300 italic mb-4">{ep.summary}</p>
                            <div className="bg-neutral-950 p-4 rounded-lg font-mono text-sm leading-relaxed text-neutral-400 whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {ep.content}
                            </div>
                            <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-end">
                                <button className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                    🎬  Tạo Storyboard
                                </button>
                            </div>
                        </div>
                    ))}
                    {episodes.length === 0 && <p className="text-neutral-500 p-8 text-center bg-neutral-900/50 rounded-xl border border-neutral-800/50 border-dashed">Chưa có tập nào. Hãy bấm "Phân tích truyện" ở thẻ Tổng quan.</p>}
                </div>
            )}

            {activeTab === 'storyboard' && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-12 text-center rounded-xl border-dashed">
                    <p className="text-neutral-400">Vui lòng tạo Script và ấn Tạo Storyboard từ Script để xem các phân cảnh ở đây.</p>
                </div>
            )}

            {activeTab === 'video' && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-12 text-center rounded-xl border-dashed">
                    <h2 className="text-xl font-bold mb-4 text-white">🎬 Video Generation (Beta)</h2>
                    <p className="text-neutral-400 max-w-md mx-auto">Tính năng sinh Video từ các phân cảnh Storyboard. Hệ thống sẽ kết nối với Luma/Kling API để tạo chuyển động cho ảnh của bạn.</p>
                    <button className="mt-6 bg-neutral-800 text-neutral-400 px-6 py-2 rounded-lg cursor-not-allowed">Chưa có dữ liệu Video</button>
                </div>
            )}

            {activeTab === 'voice' && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-12 text-center rounded-xl border-dashed">
                    <h2 className="text-xl font-bold mb-4 text-white">🎙️ AI Dubbing & Voice</h2>
                    <p className="text-neutral-400 max-w-md mx-auto">Tính năng lồng tiếng (TTS) cho các nhân vật dựa trên kịch bản hội thoại đã bóc tách. Hỗ trợ đa giọng đọc tiếng Việt.</p>
                    <button className="mt-6 bg-neutral-800 text-neutral-400 px-6 py-2 rounded-lg cursor-not-allowed">Chưa có tệp âm thanh</button>
                </div>
            )}
        </div>
    );
}

