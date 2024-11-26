import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  device_id,
  onDelete,
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
  device_id?: string;
  onDelete?: (id: string) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!device_id) return;
    
    try {
      const response = await fetch(`http://localhost:3001/devices/${device_id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onDelete?.(device_id);
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!device_id) return;

    const formData = new FormData(event.currentTarget);
    const updatedData = {
      device_name: model,
      device_image_url: formData.get('device_image_url'),
      display_size: formData.get('display_size'),
      display_res: formData.get('display_res'),
      camera: formData.get('camera'),
      video: formData.get('video'),
      ram: formData.get('ram'),
      chipset: formData.get('chipset'),
      battery: formData.get('battery'),
      battery_type: formData.get('battery_type'),
      release_date: formData.get('release_date'),
      body: formData.get('body'),
      os_type: formData.get('os_type'),
      storage: formData.get('storage'),
      price: parseInt(formData.get('price') as string),
    };

    try {
      const response = await fetch(`http://localhost:3001/devices/${device_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // You might want to add an onUpdate prop to refresh the data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating device:', error);
    }
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
      <CardFooter className="pt-4 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full">Update</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update {brand_name} {model}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="device_image_url">Image URL</Label>
                  <Input 
                    id="device_image_url" 
                    name="device_image_url" 
                    defaultValue={imageUrl}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    defaultValue={price}
                    min="0"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release_date">Release Date</Label>
                  <Input 
                    id="release_date" 
                    name="release_date" 
                    type="date" 
                    defaultValue={releaseDate.split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_size">Display Size</Label>
                  <Input 
                    id="display_size" 
                    name="display_size" 
                    defaultValue={displaySize}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_res">Display Resolution</Label>
                  <Input 
                    id="display_res" 
                    name="display_res" 
                    defaultValue={displayResolution}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="camera">Camera</Label>
                  <Input 
                    id="camera" 
                    name="camera" 
                    defaultValue={camera}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video">Video</Label>
                  <Input 
                    id="video" 
                    name="video" 
                    defaultValue={video}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Input 
                    id="ram" 
                    name="ram" 
                    defaultValue={ram}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input 
                    id="storage" 
                    name="storage" 
                    defaultValue={storage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chipset">Chipset</Label>
                  <Input 
                    id="chipset" 
                    name="chipset" 
                    defaultValue={chipset}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="battery">Battery</Label>
                  <Input 
                    id="battery" 
                    name="battery" 
                    defaultValue={battery}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="battery_type">Battery Type</Label>
                  <Input 
                    id="battery_type" 
                    name="battery_type" 
                    defaultValue={batteryType}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os_type">OS Type</Label>
                  <Input 
                    id="os_type" 
                    name="os_type" 
                    defaultValue={osType}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Input 
                  id="body" 
                  name="body" 
                  defaultValue={body}
                />
              </div>

              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {brand_name} {model}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default PhoneCard;