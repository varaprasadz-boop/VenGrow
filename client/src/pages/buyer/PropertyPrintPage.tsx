import Header from "@/components/Header";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyPrintPage() {
  const property = {
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    price: "₹85 L",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,200 sqft",
    description:
      "Spacious and well-maintained 3BHK apartment in prime Bandra location with modern amenities.",
    features: ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Power Backup"],
    contact: {
      name: "Raj Properties",
      phone: "+91 XXXXX XXXXX",
      email: "raj@example.com",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={true} userType="buyer" />

      {/* Print Actions */}
      <div className="max-w-4xl mx-auto px-8 py-4 print:hidden">
        <div className="flex gap-4">
          <Button onClick={() => window.print()} data-testid="button-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" data-testid="button-download">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 print:py-0">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b pb-6">
            <h1 className="font-serif font-bold text-4xl mb-2">
              {property.title}
            </h1>
            <p className="text-lg text-gray-600">{property.location}</p>
            <p className="text-3xl font-bold text-orange-600 mt-4">
              {property.price}
            </p>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-400">Image {i}</span>
              </div>
            ))}
          </div>

          {/* Details */}
          <div>
            <h2 className="font-bold text-2xl mb-4">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms} BHK</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-semibold">{property.area}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-bold text-2xl mb-4">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="font-bold text-2xl mb-4">Amenities & Features</h2>
            <ul className="grid grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-orange-600">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="border-t pt-6">
            <h2 className="font-bold text-2xl mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {property.contact.name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {property.contact.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {property.contact.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
