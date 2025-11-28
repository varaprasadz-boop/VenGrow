import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapView from "@/components/PropertyMapView";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid3x3, List, Map } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';
import villaImage from '@assets/generated_images/independent_villa_with_garden.png';
import commercialImage from '@assets/generated_images/commercial_office_building_india.png';
import plotImage from '@assets/generated_images/residential_plot_ready_construction.png';
import kitchenImage from '@assets/generated_images/modern_kitchen_interior_apartment.png';

export default function ListingsPage() {
  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");

  // TODO: Remove mock data
  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      price: 8500000,
      location: "Bandra West, Mumbai",
      imageUrl: heroImage,
      bedrooms: 3,
      bathrooms: 2,
      area: 1450,
      propertyType: "Apartment",
      isFeatured: true,
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
      lat: 19.0596,
      lng: 72.8295,
    },
    {
      id: "2",
      title: "Spacious 2BHK Flat with Modern Amenities",
      price: 45000,
      location: "Koramangala, Bangalore",
      imageUrl: apartmentImage,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: "Apartment",
      isVerified: true,
      sellerType: "Individual" as const,
      transactionType: "Rent" as const,
      lat: 12.9352,
      lng: 77.6245,
    },
    {
      id: "3",
      title: "Beautiful Independent Villa with Garden",
      price: 12500000,
      location: "Whitefield, Bangalore",
      imageUrl: villaImage,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      propertyType: "Villa",
      isVerified: true,
      sellerType: "Broker" as const,
      transactionType: "Sale" as const,
      lat: 12.9698,
      lng: 77.7500,
    },
    {
      id: "4",
      title: "Modern Commercial Office Space",
      price: 15000000,
      location: "Cyber City, Gurgaon",
      imageUrl: commercialImage,
      area: 3500,
      propertyType: "Commercial",
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
      lat: 28.4947,
      lng: 77.0889,
    },
    {
      id: "5",
      title: "Residential Plot in Developing Area",
      price: 3500000,
      location: "Electronic City, Bangalore",
      imageUrl: plotImage,
      area: 2400,
      propertyType: "Plot",
      isVerified: false,
      sellerType: "Individual" as const,
      transactionType: "Sale" as const,
      lat: 12.8456,
      lng: 77.6603,
    },
    {
      id: "6",
      title: "Fully Furnished 3BHK Premium Apartment",
      price: 75000,
      location: "Powai, Mumbai",
      imageUrl: kitchenImage,
      bedrooms: 3,
      bathrooms: 2,
      area: 1650,
      propertyType: "Apartment",
      isFeatured: true,
      isVerified: true,
      sellerType: "Broker" as const,
      transactionType: "Rent" as const,
      lat: 19.1176,
      lng: 72.9060,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif font-bold text-3xl mb-2">All Properties</h1>
                  <p className="text-muted-foreground">
                    {properties.length} properties found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Type Toggle */}
                  <div className="hidden sm:flex border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === 'grid' ? 'bg-accent' : ''}`}
                      onClick={() => setViewType('grid')}
                      data-testid="button-view-grid"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === 'list' ? 'bg-accent' : ''}`}
                      onClick={() => setViewType('list')}
                      data-testid="button-view-list"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === 'map' ? 'bg-accent' : ''}`}
                      onClick={() => setViewType('map')}
                      data-testid="button-view-map"
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="featured">Featured First</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden" data-testid="button-mobile-filters">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <div className="mt-8">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Properties Display */}
              {viewType === 'map' ? (
                <PropertyMapView 
                  properties={properties} 
                  className="h-[600px]" 
                />
              ) : (
                <>
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }>
                    {properties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center pt-8">
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>Previous</Button>
                      <Button variant="default">1</Button>
                      <Button variant="outline">2</Button>
                      <Button variant="outline">3</Button>
                      <Button variant="outline">Next</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
