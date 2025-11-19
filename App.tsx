import React, { useState, useCallback, useRef } from 'react';
import { RoamingBackground } from './components/RoamingBackground';
import { Typewriter } from './components/Typewriter';
import { generateRant } from './services/geminiService';

// Declare html2canvas on window
declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [scene, setScene] = useState('');
  const [action, setAction] = useState('');
  const [rant, setRant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Ref for the element we want to screenshot
  const captureRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!scene.trim() || !action.trim()) return;

    setLoading(true);
    setRant(null);
    setShowShare(false);
    setIsShaking(true);

    try {
      const [generatedText] = await Promise.all([
        generateRant({ scene, action }),
        new Promise(resolve => setTimeout(resolve, 800)) 
      ]);
      
      setRant(generatedText);
    } catch (error) {
      setRant("错误：系统过载。怒气值不足。请重试！");
    } finally {
      setLoading(false);
      setIsShaking(false);
    }
  }, [scene, action]);

  const handleShare = async () => {
    if (!captureRef.current || !window.html2canvas) return;

    try {
      const canvas = await window.html2canvas(captureRef.current, {
        backgroundColor: '#FF4D00', // Match body bg
        scale: 2, // Higher quality
        logging: false,
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        
        try {
          // Try writing to clipboard (modern browsers)
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert("图片已复制！去粘贴挂他！\n(Image copied to clipboard!)");
        } catch (err) {
          // Fallback: Create a download link or open in new tab
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `我不接受_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert("图片已生成并下载！\n(Image downloaded!)");
        }
      });
    } catch (err) {
      console.error("Share failed", err);
      alert("分享失败，请手动截图！");
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-start pt-10 pb-20 px-4 sm:px-6 overflow-hidden ${isShaking ? 'animate-screen-shake' : ''}`}>
      
      {/* Background Noise */}
      <RoamingBackground intensity={loading || isShaking ? 'high' : 'normal'} />

      {/* Header */}
      <header className="z-10 mb-12 text-center">
        <div className="text-9xl mb-2 animate-bounce hover:animate-spin cursor-pointer select-none transition-transform">
          😤
        </div>
        <h1 className="font-display text-5xl md:text-7xl text-black uppercase tracking-tighter transform -rotate-2 drop-shadow-lg border-b-8 border-black pb-2 inline-block bg-white px-4">
          我不接受！！
        </h1>
        <p className="mt-4 font-bold text-lg md:text-xl text-black bg-white inline-block px-2 transform rotate-1 border-2 border-black">
          无力反抗的赛博怒吼
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl z-10 flex flex-col gap-8">
        
        {/* Inputs */}
        <div className="flex flex-col gap-6">
          <div className="relative group">
            <label className="block font-black text-2xl mb-2 text-black transform -rotate-1 group-focus-within:text-white transition-colors">
              在哪发生的？(场景)
            </label>
            <input
              type="text"
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              placeholder="例如：面试、谈恋爱、抽卡、吃法餐..."
              className="w-full bg-white text-black font-bold text-xl md:text-2xl p-4 border-4 border-black neo-shadow focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <label className="block font-black text-2xl mb-2 text-black transform rotate-1 group-focus-within:text-white transition-colors">
              他干了什么？(行为)
            </label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="例如：直接发Offer、上来就表白、单抽..."
              className="w-full bg-white text-black font-bold text-xl md:text-2xl p-4 border-4 border-black neo-shadow focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !scene || !action}
          className={`
            w-full py-6 px-8 text-3xl md:text-4xl font-display text-white
            border-4 border-black neo-shadow bg-[#FF0000]
            transition-all duration-75
            ${loading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading ? "正在积攒怒气..." : "我不听！我不听！"}
        </button>

        {/* Result Area */}
        {rant && (
          <div className="mt-8 relative animate-in fade-in zoom-in duration-300">
            
            {/* Capture Area - This is what gets snapshotted */}
            <div ref={captureRef} className="p-4 bg-[#FF4D00]"> 
              {/* Speech Bubble Tail (Visual only) */}
              <div className="absolute -top-6 left-10 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-black z-0"></div>
              <div className="absolute -top-[20px] left-[44px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] border-b-white z-10"></div>

              <div className="bg-white border-4 border-black p-6 md:p-10 neo-shadow shadow-black min-h-[200px] flex flex-col relative z-20">
                 
                 <div className="text-2xl md:text-4xl font-black text-black leading-tight tracking-tight">
                   {showShare ? (
                     /* Static text for capture/after typewriting */
                     rant
                   ) : (
                     <Typewriter 
                        text={rant} 
                        speed={10} 
                        onComplete={() => setShowShare(true)}
                     />
                   )}
                 </div>
                 
                 {/* Decorators */}
                 <div className="absolute -right-4 -bottom-4 text-6xl transform rotate-12 select-none">⁉️</div>
                 <div className="mt-8 pt-4 border-t-2 border-gray-200 text-right">
                    <span className="inline-block bg-black text-white px-2 py-1 font-display transform -rotate-2 text-sm">
                        #我不接受 #破防
                    </span>
                 </div>
              </div>
            </div>

            {/* Footer Actions */}
            {showShare && (
              <div className="mt-6 flex justify-center animate-in slide-in-from-bottom fade-in duration-500">
                <button
                  onClick={handleShare}
                  className="bg-black text-white font-display text-2xl py-3 px-8 border-4 border-white hover:bg-white hover:text-black hover:border-black transition-colors neo-shadow shadow-white flex items-center gap-2"
                >
                  <span>📸</span> 复制图片 (Copy Image)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 text-center z-10 font-bold">
        <p className="text-black text-sm bg-white inline-block px-2 border-2 border-black transform -rotate-1">
          Powered by Gemini 2.5 Flash • 拒绝平庸，保持愤怒
        </p>
      </footer>
    </div>
  );
};

export default App;
