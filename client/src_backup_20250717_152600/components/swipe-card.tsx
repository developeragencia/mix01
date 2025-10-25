import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getDistanceText } from "@/lib/utils";
import type { Profile } from "@shared/schema";

interface SwipeCardProps {
  profile: Profile;
  index: number;
  onSwipe: (profileId: number, isLike: boolean, isSuperLike?: boolean) => void;
}

export default function SwipeCard({ profile, index, onSwipe }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const zIndex = 10 - index;
  const scale = 1 - index * 0.05;
  const yOffset = index * 4;

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    const absX = Math.abs(dragOffset.x);
    
    if (absX > threshold) {
      const isLike = dragOffset.x > 0;
      onSwipe(profile.userId, isLike);
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    const absX = Math.abs(dragOffset.x);
    
    if (absX > threshold) {
      const isLike = dragOffset.x > 0;
      onSwipe(profile.userId, isLike);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.3, 1 - Math.abs(dragOffset.x) / 200);

  const getOverlayColor = () => {
    if (Math.abs(dragOffset.x) < 50) return "transparent";
    return dragOffset.x > 0 
      ? "rgba(16, 185, 129, 0.3)" 
      : "rgba(239, 68, 68, 0.3)";
  };

  const getSwipeText = () => {
    if (Math.abs(dragOffset.x) < 50) return null;
    return dragOffset.x > 0 ? "LIKE" : "NOPE";
  };

  const getSwipeTextColor = () => {
    return dragOffset.x > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card
      ref={cardRef}
      className="absolute inset-0 swipe-card card-shadow bg-white rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        zIndex,
        transform: `
          translateX(${dragOffset.x}px) 
          translateY(${dragOffset.y + yOffset}px) 
          rotate(${rotation}deg) 
          scale(${scale})
        `,
        opacity: isDragging ? opacity : 1,
        transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: getOverlayColor() }}
      >
        {getSwipeText() && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getSwipeTextColor()} border-4 border-current px-4 py-2 rotate-12 transform`}>
              {getSwipeText()}
            </span>
          </div>
        )}
      </div>
      
      {profile.photos[0] ? (
        <img 
          src={profile.photos[0]} 
          alt={profile.name}
          className="w-full h-3/4 object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="w-full h-3/4 gradient-bg flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {profile.name[0]}
          </span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {profile.name}, {profile.age}
            </h3>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-[var(--mix-pink)]" />
              {getDistanceText()}
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[var(--mix-blue)] rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}