"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, Plus } from 'lucide-react'
import PhoneCard from '@/components/ui/phoneCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"


const BRAND_MAPPING = [
  { name: 'Nokia', id: 1 },
  { name: 'Samsung', id: 9 },
  { name: 'Asus', id: 46 },
  { name: 'Apple', id: 48 },
  { name: 'Huawei', id: 58 },
  { name: 'Xiaomi', id: 80 },
  { name: 'OnePlus', id: 95 },
  { name: 'Google', id: 107 },
] as const;

interface Device {
  id: number;
  device_name: string;
  price: number;
  device_image_url: string;
  release_date: string;
  display_size: string;
  display_res: string;
  camera: string;
  video: string;
  ram: string;
  storage: string;
  chipset: string;
  battery: string;
  battery_type: string;
  os_type: string;
  body: string;
  brand_name: string;
  device_id: string;
}

const brand_mapping: { [key: string]: string } = {
  '1': 'Nokia',
  '9': 'Samsung',
  '46': 'Asus',
  '48': 'Apple',
  '58': 'Huawei',
  '80': 'Xiaomi',
  '95': 'OnePlus',
  '107': 'Google',
};

type PhoneFormData = {
  device_id: string;
  device_name: string;
  device_image_url: string;
  brand_id: string;
  display_size: string;
  display_res: string;
  camera: string;
  video: string;
  ram: string;
  chipset: string;
  battery: string;
  battery_type: string;
  release_date: string;
  body: string;
  os_type: string;
  storage: string;
  price: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("")
  const [devices, setDevices] = useState<Device[]>([])
  const [date, setDate] = useState<Date>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDeviceDelete = (deletedId: string) => {
    setDevices(devices.filter(device => device.device_id !== deletedId));
  };

  useEffect(() => {
    const brandIdsParam = selectedBrands.length > 0 ? selectedBrands.join(',') : '';

    let baseUrl = 'http://localhost:3001/devices';

    // Add sorting routes only if a sort option is selected
    if (sortOption && sortOption !== "default") {
      switch (sortOption) {
        case 'priceHighToLow':
          baseUrl = 'http://localhost:3001/devices/price/desc';
          break;
        case 'priceLowToHigh':
          baseUrl = 'http://localhost:3001/devices/price/asc';
          break;
        case 'dateNewToOld':
          baseUrl = 'http://localhost:3001/devices/sort/desc';
          break;
        case 'dateOldToNew':
          baseUrl = 'http://localhost:3001/devices/sort/asc';
          break;
      }
    }

    fetch(`${baseUrl}?brandIds=${brandIdsParam}`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        setDevices(data);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
      });
  }, [searchTerm, selectedBrands, sortOption])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const phoneData: PhoneFormData = {
      device_id: formData.get('device_id') as string,
      device_name: formData.get('device_name') as string,
      device_image_url: formData.get('device_image_url') as string,
      brand_id: formData.get('brand_id') as string,
      display_size: formData.get('display_size') as string,
      display_res: formData.get('display_res') as string,
      camera: formData.get('camera') as string,
      video: formData.get('video') as string,
      ram: formData.get('ram') as string,
      chipset: formData.get('chipset') as string,
      battery: formData.get('battery') as string,
      battery_type: formData.get('battery_type') as string,
      release_date: date ? format(date, 'yyyy-MM-dd') : '',
      body: formData.get('body') as string,
      os_type: formData.get('os_type') as string,
      storage: formData.get('storage') as string,
      price: parseInt(formData.get('price') as string),
    }

    try {
      const response = await fetch('http://localhost:3001/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(phoneData),
      })

      if (response.ok) {
        setDialogOpen(false)
        // Optionally refresh the phones list here
      } else {
        console.error('Failed to add phone')
      }
    } catch (error) {
      console.error('Error adding phone:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phone Finder</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search phones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        {selectedBrands.length > 0 && (
          <div className="text-sm text-muted-foreground mt-1">
            Selected: {selectedBrands.map(brandId => brand_mapping[brandId]).join(', ')}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Brands <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Brands</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {BRAND_MAPPING.map(({ name, id }) => (
              <DropdownMenuCheckboxItem
                key={id}
                checked={selectedBrands.includes(id)}
                onCheckedChange={(checked) => {
                  const newSelectedBrands = checked
                    ? [...selectedBrands, id]
                    : selectedBrands.filter((b) => b !== id)
                  setSelectedBrands(newSelectedBrands)
                  console.log('Selected brands:', newSelectedBrands)
                  setSearchTerm("")
                }}
              >
                {name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Select onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
            <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="dateNewToOld">Newest to Oldest</SelectItem>
            <SelectItem value="dateOldToNew">Oldest to Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add Phone
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Phone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device_id">Device ID</Label>
                <Input id="device_id" name="device_id" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device_name">Device Name</Label>
                <Input id="device_name" name="device_name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_id">Brand</Label>
                <Select name="brand_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(brand_mapping).map(([id, brand]) => (
                      <SelectItem key={id} value={id}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="1"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="release_date">Release Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="device_image_url">Image URL</Label>
                <Input id="device_image_url" name="device_image_url" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_size">Display Size</Label>
                <Input id="display_size" name="display_size" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_res">Display Resolution</Label>
                <Input id="display_res" name="display_res" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="camera">Camera</Label>
                <Input id="camera" name="camera" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video</Label>
                <Input id="video" name="video" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ram">RAM</Label>
                <Input id="ram" name="ram" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chipset">Chipset</Label>
                <Input id="chipset" name="chipset" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="battery">Battery</Label>
                <Input id="battery" name="battery" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="battery_type">Battery Type</Label>
                <Input id="battery_type" name="battery_type" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Input id="body" name="body" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="os_type">OS Type</Label>
                <Input id="os_type" name="os_type" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Storage</Label>
                <Input id="storage" name="storage" required />
              </div>
            </div>

            <Button type="submit" className="w-full">Add Phone</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices
          .filter(device => 
            device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((device) => (
            <PhoneCard
              key={device.id}
              model={device.device_name}
              price={device.price}
              imageUrl={device.device_image_url}
              releaseDate={device.release_date}
              displaySize={device.display_size}
              displayResolution={device.display_res}
              camera={device.camera}
              video={device.video}
              ram={device.ram}
              storage={device.storage}
              chipset={device.chipset}
              battery={device.battery}
              batteryType={device.battery_type}
              osType={device.os_type}
              body={device.body}
              brand_name={device.brand_name}
              device_id={device.device_id}
              onDelete={handleDeviceDelete}
            />
          ))}
      </div>
     
    </div>
  )
}
