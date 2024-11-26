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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: "",
    model: "",
    price: "",
    imageUrl: "",
    releaseDate: "",
    displaySize: "",
    displayResolution: "",
    camera: "",
    video: "",
    ram: "",
    storage: "",
    chipset: "",
    battery: "",
    batteryType: "",
    osType: "",
    body: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Logic to add the device
    console.log("Device added:", formData);
    setIsPopupOpen(false); // Close the popup
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
      
          {/* Add button */}
          <Button style={{ marginLeft: "16px" }} onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>


      {/* Popup form */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Device</h2>
            <form>
              {(Object.keys(formData) as (keyof typeof formData)[]).map((key) => (
                <div key={key} className="form-group">
                  <label>{key.replace(/([A-Z])/g, " $1")}</label>
                  <Input
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
              <div className="form-actions">
                <Button type="button" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button type="button" onClick={() => setIsPopupOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      
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
            />
          ))}
      </div>
      <style jsx>{`
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
  }
`}</style>
    </div>
  )
}
