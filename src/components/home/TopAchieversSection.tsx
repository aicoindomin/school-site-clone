import prep1Img from "@/assets/toppers/prep1.png";
import class1Img from "@/assets/toppers/class1.png";
import class2Img from "@/assets/toppers/class2.png";
import class3Img from "@/assets/toppers/class3.png";
import class4Img from "@/assets/toppers/class4.png";
import class5Img from "@/assets/toppers/class5.png";

interface Achiever {
  name: string;
  classLabel: string;
  position: string;
  image: string;
}

const achievers: Achiever[] = [
  { name: "Ahadullah", classLabel: "PREP 1", position: "1ST POSITION", image: prep1Img },
  { name: "Student Name", classLabel: "KG 1", position: "1ST POSITION", image: class1Img },
  { name: "Student Name", classLabel: "KG 2", position: "1ST POSITION", image: class2Img },
  { name: "Fatima Khan", classLabel: "CLASS 1", position: "1ST POSITION", image: class1Img },
  { name: "Priya Sharma", classLabel: "CLASS 2", position: "1ST POSITION", image: class2Img },
  { name: "Aryan Das", classLabel: "CLASS 3", position: "1ST POSITION", image: class3Img },
  { name: "Rahul Ahmed", classLabel: "CLASS 4", position: "1ST POSITION", image: class4Img },
  { name: "Sneha Roy", classLabel: "CLASS 5", position: "1ST POSITION", image: class5Img },
];

const AchieverCard = ({ achiever }: { achiever: Achiever }) => {
  return (
    <div className="achiever-card group">
      {/* Student Image */}
      <img 
        src={achiever.image} 
        alt={achiever.name}
        className="student-img"
      />
      
      {/* Glassmorphism Info Layer */}
      <div className="info-layer">
        <div className="name">{achiever.name}</div>
        <div className="class-label">{achiever.classLabel}</div>
        <div className="badge">{achiever.position}</div>
      </div>
      
      {/* Neon border glow effect */}
      <div className="neon-border" />
    </div>
  );
};

export const TopAchieversSection = () => {
  return (
    <section className="top-achievers-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🏆 Our Top Achievers
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Celebrating excellence - Meet our brilliant students who secured 1st position in their respective classes
          </p>
        </div>
        
        {/* Achievers Grid */}
        <div className="achievers-grid">
          {achievers.map((achiever, index) => (
            <AchieverCard key={index} achiever={achiever} />
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
          filter: grayscale(0%) brightness(1) blur(2px);
          clip-path: polygon(
            0% 0%, 
            30% 0%, 
            30% 30%, 
            0% 30%,
            0% 40%,
            30% 40%,
            30% 70%,
            0% 70%,
            0% 100%,
            30% 100%,
            30% 70%,
            60% 70%,
            60% 100%,
            100% 100%,
            100% 70%,
            60% 70%,
            60% 40%,
            100% 40%,
            100% 30%,
            60% 30%,
            60% 0%,
            100% 0%,
            100% 30%,
            60% 30%,
            60% 40%,
            30% 40%,
            30% 30%,
            60% 30%,
            60% 0%,
            30% 0%
          );
          animation: shatterEffect 0.6s ease-out forwards;
        }
        
        @keyframes shatterEffect {
          0% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
          50% {
            clip-path: polygon(
              5% 5%, 
              45% 0%, 
              50% 45%, 
              95% 5%,
              100% 50%,
              55% 55%,
              95% 95%,
              50% 100%,
              45% 55%,
              5% 95%,
              0% 50%,
              45% 45%
            );
          }
          100% {
            clip-path: polygon(
              10% 0%, 
              35% 5%, 
              40% 35%, 
              5% 40%,
              0% 60%,
              35% 65%,
              30% 95%,
              60% 100%,
              65% 65%,
              95% 70%,
              100% 35%,
              65% 30%
            );
            opacity: 0.3;
          }
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
