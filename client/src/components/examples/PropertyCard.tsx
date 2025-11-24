import PropertyCard from '../PropertyCard'
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png'
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png'
import villaImage from '@assets/generated_images/independent_villa_with_garden.png'

export default function PropertyCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <PropertyCard
        id="1"
        title="Luxury 3BHK Apartment in Prime Location"
        price={8500000}
        location="Bandra West, Mumbai"
        imageUrl={heroImage}
        bedrooms={3}
        bathrooms={2}
        area={1450}
        propertyType="Apartment"
        isFeatured={true}
        isVerified={true}
        sellerType="Builder"
        transactionType="Sale"
      />
      <PropertyCard
        id="2"
        title="Spacious 2BHK Flat with Modern Amenities"
        price={45000}
        location="Koramangala, Bangalore"
        imageUrl={apartmentImage}
        bedrooms={2}
        bathrooms={2}
        area={1200}
        propertyType="Apartment"
        isVerified={true}
        sellerType="Individual"
        transactionType="Rent"
      />
      <PropertyCard
        id="3"
        title="Beautiful Independent Villa with Garden"
        price={12500000}
        location="Whitefield, Bangalore"
        imageUrl={villaImage}
        bedrooms={4}
        bathrooms={3}
        area={2800}
        propertyType="Villa"
        isFeatured={false}
        isVerified={true}
        sellerType="Broker"
        transactionType="Sale"
      />
    </div>
  )
}
