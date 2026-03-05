export default function VoicePage() {
    return (
        <div className="flex flex-col h-full items-center justify-center space-y-4 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-3xl bg-vivid-teal/10 border border-vivid-teal/20 flex items-center justify-center text-3xl">🔊</div>
            <h2 className="text-2xl font-bold font-heading">Stage 6: Voice Generation</h2>
            <p className="text-muted-silver max-w-md">Tạo giọng đọc (TTS) cho nhân vật bằng Gemini Multimodal / Lyria.</p>
        </div>
    );
}
