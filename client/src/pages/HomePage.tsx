import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import PropertyCard from "@/components/PropertyCard";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';
import villaImage from '@assets/generated_images/independent_villa_with_garden.png';
import commercialImage from '@assets/generated_images/commercial_office_building_india.png';
import plotImage from '@assets/generated_images/residential_plot_ready_construction.png';
import kitchenImage from '@assets/generated_images/modern_kitchen_interior_apartment.png';

export default function HomePage() {
  // TODO: Remove mock data
  const featuredProperties = [
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
    },
  ];

  const newListings = [
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
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection backgroundImage={heroImage} />
        
        <CategorySection />

        {/* Featured Properties */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif font-bold text-3xl mb-2">Featured Properties</h2>
                <p className="text-muted-foreground">Handpicked premium properties for you</p>
              </div>
              <a href="/listings" className="text-primary font-medium hover:underline" data-testid="link-view-all-featured">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsSection />

        {/* New Listings */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif font-bold text-3xl mb-2">New Listings</h2>
                <p className="text-muted-foreground">Recently added properties</p>
              </div>
              <a href="/listings" className="text-primary font-medium hover:underline" data-testid="link-view-all-new">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newListings.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
              Ready to Sell Your Property?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of sellers and list your property with verified buyers waiting
            </p>
            <a href="/seller/register" data-testid="link-become-seller">
              <button className="bg-background text-foreground hover-elevate active-elevate-2 px-8 py-4 rounded-lg font-semibold text-lg">
                Become a Seller
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
