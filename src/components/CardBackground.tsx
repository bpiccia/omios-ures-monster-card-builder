interface CardBackgroundProps {
  readonly height: number;
  readonly topImageHeight: number;
  readonly middleImageHeight: number;
  readonly bottomImageHeight: number;
  readonly middleImagesNeeded: number;
  readonly contentHeight: number;
}

export function CardBackground({ height, topImageHeight, middleImageHeight, bottomImageHeight, middleImagesNeeded }: CardBackgroundProps) {
  const baseScrollHeight = topImageHeight + bottomImageHeight;
  
  console.log('CardBackground Heights:', {
    containerHeight: height,
    baseScrollHeight,
    middleImageHeight,
    middleImagesNeeded,
    estimatedTotalHeight: baseScrollHeight + (middleImagesNeeded * middleImageHeight)
  });
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* Top image - natural aspect ratio at full width */}
      <img 
        src="/top.png" 
        alt="" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          objectFit: 'contain', 
          display: 'block',
          flexShrink: 0
        }} 
      />
      
      {/* Middle images - repeat as needed */}
      {Array.from({ length: middleImagesNeeded }, (_, index) => (
        <img 
          key={index}
          src="/middle.png" 
          alt="" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
          }} 
        />
      ))}
      
      {/* Bottom image - natural aspect ratio at full width */}
      <img 
        src="/bottom.png" 
        alt="" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          objectFit: 'contain', 
          display: 'block',
          flexShrink: 0
        }} 
      />
    </div>
  );
}