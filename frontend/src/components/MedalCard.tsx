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
                 w-full max-w-xs flex flex-col items-center gap-4 justify-center text-center"
      onClick={() => onClick(medal)}
    >
      <img 
        src="/goldmedal.png" 
        alt={`Medal - ${medal.name}`}
        className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-52 lg:h-78 object-cover border-none" 
      />
      <div className="p-2 rounded-lg text-center min-w-30 w-full">
        <h4 className="m-0 text-white text-base sm:text-lg md:text-xl font-semibold">
          {medal.name}
        </h4>
      </div>
    </div>
  );
};

export default MedalCard;
