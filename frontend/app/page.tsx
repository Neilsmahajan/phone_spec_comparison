"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ChevronDown } from 'lucide-react'
import PhoneCard from '@/components/ui/phoneCard'
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

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

  // ... add any other brand mappings
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("")
  const [devices, setDevices] = useState<Device[]>([])
  const [openDialog, setOpenDialog] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_id: '',
    device_name: '',
    device_image_url: '',
    brand_id: '',
    display_size: '',
    display_res: '',
    camera: '',
    video: '',
    ram: '',
    chipset: '',
    battery: '',
    battery_type: '',
    release_date: '',
    body: '',
    os_type: '',
    storage: '',
    price: ''
  });

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

  const handleAddDevice = async () => {
    try {
      await fetch('http://localhost:3001/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });
      setOpenDialog(false);
      // Trigger a re-fetch by updating sortOption
      setSortOption(sortOption);
      // Reset form
      setNewDevice({
        device_id: '',
        device_name: '',
        device_image_url: '',
        brand_id: '',
        display_size: '',
        display_res: '',
        camera: '',
        video: '',
        ram: '',
        chipset: '',
        battery: '',
        battery_type: '',
        release_date: '',
        body: '',
        os_type: '',
        storage: '',
        price: ''
      });
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

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
        <Button 
          variant="default" 
          onClick={() => setOpenDialog(true)}
          style={{ marginLeft: '10px' }}
        >
          Add Device
        </Button>
      </div>
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
            />
          ))}
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <TextField
              label="Device ID"
              value={newDevice.device_id}
              onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
              fullWidth
            />
            <TextField
              label="Device Name"
              value={newDevice.device_name}
              onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={newDevice.device_image_url}
              onChange={(e) => setNewDevice({...newDevice, device_image_url: e.target.value})}
              fullWidth
            />
            <TextField
              label="Brand ID"
              value={newDevice.brand_id}
              onChange={(e) => setNewDevice({...newDevice, brand_id: e.target.value})}
              fullWidth
            />
            <TextField
              label="Display Size"
              value={newDevice.display_size}
              onChange={(e) => setNewDevice({...newDevice, display_size: e.target.value})}
              fullWidth
            />
            <TextField
              label="Display Resolution"
              value={newDevice.display_res}
              onChange={(e) => setNewDevice({...newDevice, display_res: e.target.value})}
              fullWidth
            />
            <TextField
              label="Camera"
              value={newDevice.camera}
              onChange={(e) => setNewDevice({...newDevice, camera: e.target.value})}
              fullWidth
            />
            <TextField
              label="Video"
              value={newDevice.video}
              onChange={(e) => setNewDevice({...newDevice, video: e.target.value})}
              fullWidth
            />
            <TextField
              label="RAM"
              value={newDevice.ram}
              onChange={(e) => setNewDevice({...newDevice, ram: e.target.value})}
              fullWidth
            />
            <TextField
              label="Chipset"
              value={newDevice.chipset}
              onChange={(e) => setNewDevice({...newDevice, chipset: e.target.value})}
              fullWidth
            />
            <TextField
              label="Battery"
              value={newDevice.battery}
              onChange={(e) => setNewDevice({...newDevice, battery: e.target.value})}
              fullWidth
            />
            <TextField
              label="Battery Type"
              value={newDevice.battery_type}
              onChange={(e) => setNewDevice({...newDevice, battery_type: e.target.value})}
              fullWidth
            />
            <TextField
              label="Release Date"
              type="date"
              value={newDevice.release_date}
              onChange={(e) => setNewDevice({...newDevice, release_date: e.target.value})}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Body"
              value={newDevice.body}
              onChange={(e) => setNewDevice({...newDevice, body: e.target.value})}
              fullWidth
            />
            <TextField
              label="OS Type"
              value={newDevice.os_type}
              onChange={(e) => setNewDevice({...newDevice, os_type: e.target.value})}
              fullWidth
            />
            <TextField
              label="Storage"
              value={newDevice.storage}
              onChange={(e) => setNewDevice({...newDevice, storage: e.target.value})}
              fullWidth
            />
            <TextField
              label="Price"
              value={newDevice.price}
              onChange={(e) => setNewDevice({...newDevice, price: e.target.value})}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outline">Cancel</Button>
          <Button onClick={handleAddDevice} variant="default">
            Add Device
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
