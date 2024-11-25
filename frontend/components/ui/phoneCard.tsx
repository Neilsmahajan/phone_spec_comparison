import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function PhoneCard({
  brand_name,
  model,
  price,
  imageUrl,
  releaseDate,
  displaySize,
  displayResolution,
  camera,
  video,
  ram,
  storage,
  chipset,
  battery,
  batteryType,
  osType,
  body,

}: {
  brand_name: string;
  model: string;
  price: number;
  imageUrl?: string;
  releaseDate: string;
  displaySize?: string;
  displayResolution?: string;
  camera?: string;
  video?: string;
  ram?: string;
  storage?: string;
  chipset?: string;
  battery?: string;
  batteryType?: string;
  osType?: string;
  body?: string;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="flex flex-col w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{brand_name} {model}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="w-full h-48 relative">
            <img 
              src={imageUrl} 
              alt={`${brand_name} ${model}`}
              className="object-contain w-full h-full rounded-lg"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-2xl font-semibold">
            ${price.toLocaleString()}
          </p>
          
          <p className="text-sm text-muted-foreground">
            Release Date: {formatDate(releaseDate)}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          {displaySize && (
            <div className="flex gap-2">
              <span className="font-medium min-w-20">Display:</span>
              <span>{displaySize} {displayResolution && `(${displayResolution})`}</span>
            </div>
          )}
          
          {camera && (
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="font-medium min-w-20">Camera:</span>
                <span>{camera}</span>
              </div>
              {video && (
                <div className="flex gap-2">
                  <span className="font-medium min-w-20">Video:</span>
                  <span>{video}</span>
                </div>
              )}
            </div>
          )}
          
          {(ram || storage) && (
            <div className="space-y-1">
              {ram && (
                <div className="flex gap-2">
                  <span className="font-medium min-w-20">RAM:</span>
                  <span>{ram}</span>
                </div>
              )}
              {storage && (
                <div className="flex gap-2">
                  <span className="font-medium min-w-20">Storage:</span>
                  <span>{storage}</span>
                </div>
              )}
            </div>
          )}
          
          {chipset && (
            <div className="flex gap-2">
              <span className="font-medium min-w-20">Chipset:</span>
              <span>{chipset}</span>
            </div>
          )}
          
          {battery && (
            <div className="flex gap-2">
              <span className="font-medium min-w-20">Battery:</span>
              <span>{battery} {batteryType && `(${batteryType})`}</span>
            </div>
          )}
          
          {osType && (
            <div className="flex gap-2">
              <span className="font-medium min-w-20">OS:</span>
              <span>{osType}</span>
            </div>
          )}
        </div>

        {body && (
          <p className="text-sm text-muted-foreground mt-4">{body}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default PhoneCard;