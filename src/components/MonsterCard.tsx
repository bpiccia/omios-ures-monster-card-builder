import React from 'react';
import { Monster, Dictionary } from '../types';
import { CardBackground } from './CardBackground';
import { CardContent } from './CardContent';

interface MonsterCardProps {
  readonly monster: Monster;
  readonly dict: Dictionary;
  readonly onHeightChange?: (height: number) => void;
}

export function MonsterCard({ monster, dict, onHeightChange }: MonsterCardProps) {
  const topImageHeight = 194.92;
  const middleImageHeight = 37.55;
  const bottomImageHeight = 103.77;
  
  const hasAbilities = monster.hasAbilities && monster.abilities.length > 0;
  const hasSpecialAttacks = monster.hasSpecialAttacks && monster.specialAttacks.length > 0;
  const hasSpells = monster.hasSpells && monster.spells.length > 0;

  // Padding calculations - text should start inside top image and end inside bottom image
  const topPadding = 35;
  const bottomPadding = 20;

  // Text container ref to measure actual content height
  const textRef = React.useRef<HTMLDivElement>(null);
  const [textHeight, setTextHeight] = React.useState<number>(0);
  const [totalHeight, setTotalHeight] = React.useState<number>(topImageHeight + middleImageHeight + bottomImageHeight);
  const [numberOfMiddleImages, setNumberOfMiddleImages] = React.useState<number>(1);
  
  React.useEffect(() => {
    if (textRef.current) {
      // Use a small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        const measuredHeight = textRef.current!.scrollHeight;
        setTextHeight(measuredHeight);
        
        // Calculate minimum height needed (top + bottom + padding)
        const minHeightNeeded = topImageHeight + bottomImageHeight + topPadding + bottomPadding;
        // Calculate total content height needed
        const totalContentHeight = measuredHeight + topPadding + bottomPadding;
        
        // Calculate how many middle images we actually need
        const middleSpaceNeeded = Math.max(0, totalContentHeight - minHeightNeeded);
        const requiredMiddleImages = Math.max(1, Math.ceil(middleSpaceNeeded / middleImageHeight));
        
        // Only update if the number of middle images needs to change
        if (requiredMiddleImages !== numberOfMiddleImages) {
          setNumberOfMiddleImages(requiredMiddleImages);
          const newTotalHeight = topImageHeight + (requiredMiddleImages * middleImageHeight) + bottomImageHeight;
          setTotalHeight(newTotalHeight);
        }
        
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [monster, dict, hasAbilities, hasSpecialAttacks, hasSpells, topImageHeight, bottomImageHeight, middleImageHeight, numberOfMiddleImages]);
  
  // Report height changes to parent
  React.useEffect(() => {
    if (onHeightChange && totalHeight > 0) {
      onHeightChange(totalHeight);
    }
  }, [onHeightChange, totalHeight]);
  
  return (
    <div 
      data-card 
      style={{ 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
        overflow: 'hidden', 
        background: 'white',
        margin: '0 auto',
        width: '380px',  // Increased width for better visibility
        height: `${totalHeight}px`,
        position: 'relative'
      }}
    >
      
      {/* Background Container - seamless scroll */}
      <CardBackground 
        height={totalHeight} 
        topImageHeight={topImageHeight}
        middleImageHeight={middleImageHeight} 
        bottomImageHeight={bottomImageHeight}
        middleImagesNeeded={numberOfMiddleImages}
        contentHeight={textHeight} 
      />

      {/* Text Container - overlays background */}
      <CardContent 
        monster={monster}
        dict={dict}
        textRef={textRef}
        topPadding={topPadding}
        totalHeight={totalHeight}
        bottomPadding={bottomPadding}
      />
    </div>
  );
}