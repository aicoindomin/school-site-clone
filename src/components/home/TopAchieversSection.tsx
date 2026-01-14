import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText, useTranslatedTexts } from "@/components/TranslatedText";
import prep1Img from "@/assets/toppers/prep1.png";

interface Achiever {
  id: string;
  student_name: string;
  class_label: string;
  position: string;
  image_url: string | null;
}

const AchieverCard = ({ achiever }: { achiever: Achiever }) => {
  return (
    <div className="achiever-card group">
      <img 
        src={achiever.image_url || prep1Img} 
        alt={achiever.student_name}
        className="student-img"
      />
      
      <div className="info-layer">
        <div className="name">{achiever.student_name}</div>
        <div className="class-label">{achiever.class_label}</div>
        <div className="badge">{achiever.position}</div>
      </div>
      
      <div className="neon-border" />
    </div>
  );
};

export const TopAchieversSection = () => {
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [loading, setLoading] = useState(true);
  const translatedTexts = useTranslatedTexts([
    "Our Top Achievers",
    "Celebrating excellence - Meet our brilliant students who secured 1st position in their respective classes"
  ]);

  useEffect(() => {
    const fetchAchievers = async () => {
      const { data, error } = await supabase
        .from("top_achievers")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (!error && data) {
        setAchievers(data);
      }
      setLoading(false);
    };

    fetchAchievers();
  }, []);

  if (loading) {
    return (
      <section className="top-achievers-section">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (achievers.length === 0) {
    return null;
  }

  return (
    <section className="top-achievers-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🏆 {translatedTexts[0]}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {translatedTexts[1]}
          </p>
        </div>
        
        <div className="achievers-grid">
          {achievers.map((achiever) => (
            <AchieverCard key={achiever.id} achiever={achiever} />
          ))}
        </div>
      </div>
      
      <style>{`
        .top-achievers-section {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 80px 0;
          perspective: 1000px;
        }
        
        .achievers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          justify-items: center;
        }
        
        @media (min-width: 1024px) {
          .achievers-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
          }
        }
        
        .achiever-card {
          position: relative;
          width: 180px;
          height: 260px;
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          border: 2px solid rgba(0, 242, 255, 0.2);
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.5),
            0 0 20px rgba(0, 242, 255, 0.1);
        }
        
        .achiever-card:hover {
          transform: rotateX(10deg) rotateY(-5deg) translateY(-15px) scale(1.05);
          border-color: #00f2ff;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(0, 242, 255, 0.4),
            0 0 80px rgba(0, 242, 255, 0.2),
            inset 0 0 20px rgba(0, 242, 255, 0.1);
        }
        
        .student-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
          filter: grayscale(20%) brightness(0.9);
        }
        
        .achiever-card:hover .student-img {
          transform: scale(1.15) translateY(-10px);
          filter: grayscale(0%) brightness(1);
        }
        
        .info-layer {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0.6) 0%, 
            rgba(15, 23, 42, 0.9) 50%,
            rgba(15, 23, 42, 0.95) 100%
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          transition: top 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          text-align: center;
          padding: 20px;
        }
        
        .achiever-card:hover .info-layer {
          top: 0;
        }
        
        .name {
          font-weight: 800;
          font-size: 1.1rem;
          color: #00f2ff;
          text-transform: uppercase;
          margin-bottom: 8px;
          text-shadow: 
            0 0 10px rgba(0, 242, 255, 0.8),
            0 0 20px rgba(0, 242, 255, 0.5),
            0 0 30px rgba(0, 242, 255, 0.3);
          letter-spacing: 1px;
        }
        
        .class-label {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 15px;
          font-weight: 500;
          letter-spacing: 2px;
        }
        
        .badge {
          background: linear-gradient(135deg, #f0ab31 0%, #ffd700 50%, #f0ab31 100%);
          color: #000;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.65rem;
          box-shadow: 
            0 0 15px rgba(240, 171, 49, 0.6),
            0 0 30px rgba(240, 171, 49, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: badgePulse 2s ease-in-out infinite;
        }
        
        @keyframes badgePulse {
          0%, 100% {
            box-shadow: 
              0 0 15px rgba(240, 171, 49, 0.6),
              0 0 30px rgba(240, 171, 49, 0.3);
          }
          50% {
            box-shadow: 
              0 0 25px rgba(240, 171, 49, 0.8),
              0 0 50px rgba(240, 171, 49, 0.5);
          }
        }
        
        .neon-border {
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(0, 242, 255, 0.5) 50%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          animation: borderRotate 3s linear infinite;
        }
        
        .achiever-card:hover .neon-border {
          opacity: 1;
        }
        
        @keyframes borderRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};
