import React from 'react';

interface MedalCardProps {
  medal: {
    id: string;
    name: string;
    date: string;
    distance: string;
    time: string;
  };
  onClick: (medal: any) => void;
}

const MedalCard: React.FC<MedalCardProps> = ({ medal, onClick }) => {
  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-2xl p-6 
                 transition-all duration-300 ease-in-out cursor-pointer
                 hover:bg-white/8 hover:border-white/20 hover:scale-105 hover:-translate-y-1
                 w-full max-w-[320px] flex flex-col items-center gap-4 justify-center text-center
                 min-h-[400px]"
      onClick={() => onClick(medal)}
    >
      <img 
        src="/goldmedal.png" 
        alt={`Medal - ${medal.name}`}
        className="w-48 h-72 object-cover border-none flex-shrink-0" 
      />
      <div className="p-2 rounded-lg text-center w-full flex-1 flex items-center justify-center min-h-[60px]">
        <h4 className="m-0 text-white text-lg font-semibold leading-tight">
          {medal.name}
        </h4>
      </div>
    </div>
  );
};

export default MedalCard;
