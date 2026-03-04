import React from 'react';

export default function FloatingSpares({ count = 8 }) {
  const spareIcons = ['🔧', '⚙️', '🔩', '🛠️', '🏍️', '⚡', '🔋', '💡'];
  
  const generateFloatingElements = () => {
    return Array.from({ length: count }, (_, i) => {
      const icon = spareIcons[i % spareIcons.length];
      const delay = Math.random() * 5;
      const duration = 8 + Math.random() * 4;
      const size = 2 + Math.random() * 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      return {
        id: i,
        icon,
        delay,
        duration,
        size,
        x,
        y
      };
    });
  };

  const elements = generateFloatingElements();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes float3d {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          25% { 
            transform: translateY(-20px) rotateX(15deg) rotateY(90deg) rotateZ(5deg); 
          }
          50% { 
            transform: translateY(-10px) rotateX(-10deg) rotateY(180deg) rotateZ(-10deg); 
          }
          75% { 
            transform: translateY(-15px) rotateX(10deg) rotateY(270deg) rotateZ(5deg); 
          }
        }
        
        @keyframes drift {
          0%, 100% { 
            transform: translateX(0px); 
          }
          50% { 
            transform: translateX(30px); 
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            filter: drop-shadow(0 0 10px rgba(0, 86, 210, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4));
          }
        }
        
        .floating-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
      
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute floating-3d"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}rem`,
            animationDelay: `${element.delay}s`,
            animation: `
              float3d ${element.duration}s ease-in-out infinite,
              drift ${element.duration * 1.5}s ease-in-out infinite,
              glow ${element.duration * 0.8}s ease-in-out infinite
            `,
            zIndex: Math.floor(Math.random() * 10)
          }}
        >
          <div
            className="transform-gpu transition-all duration-300 hover:scale-125"
            style={{
              textShadow: '0 0 20px rgba(0, 86, 210, 0.5)',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }}
          >
            {element.icon}
          </div>
        </div>
      ))}
      
      {/* Additional CSS-based 3D geometric shapes */}
      <div className="absolute top-1/4 left-1/4 floating-3d opacity-30">
        <div
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
          style={{
            animation: 'float3d 10s ease-in-out infinite',
            animationDelay: '1s',
            transform: 'rotateX(45deg) rotateY(45deg)',
            boxShadow: '0 0 30px rgba(0, 86, 210, 0.4)'
          }}
        />
      </div>
      
      <div className="absolute bottom-1/4 right-1/4 floating-3d opacity-40">
        <div
          className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
          style={{
            animation: 'float3d 8s ease-in-out infinite',
            animationDelay: '3s',
            transform: 'rotateX(30deg) rotateZ(60deg)',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
          }}
        />
      </div>
      
      <div className="absolute top-1/2 right-1/3 floating-3d opacity-25">
        <div
          className="w-20 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
          style={{
            animation: 'float3d 12s ease-in-out infinite',
            animationDelay: '2s',
            transform: 'rotateY(60deg) rotateZ(15deg)',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)'
          }}
        />
      </div>
    </div>
  );
}