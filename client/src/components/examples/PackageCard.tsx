import PackageCard from '../PackageCard'

export default function PackageCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 max-w-6xl">
      <PackageCard
        name="Basic"
        price={999}
        duration="month"
        maxListings={5}
        features={[
          "5 active listings",
          "30 days listing duration",
          "Standard placement",
          "Basic analytics",
          "Email support",
        ]}
      />
      <PackageCard
        name="Premium"
        price={2999}
        duration="month"
        maxListings={20}
        features={[
          "20 active listings",
          "60 days listing duration",
          "Priority placement",
          "Featured badge",
          "Full analytics dashboard",
          "Email & chat support",
        ]}
        isPopular={true}
      />
      <PackageCard
        name="Featured"
        price={9999}
        duration="month"
        maxListings="Unlimited"
        features={[
          "Unlimited listings",
          "90 days listing duration",
          "Top homepage placement",
          "Premium badge",
          "Advanced analytics",
          "Priority 24/7 support",
          "Dedicated account manager",
        ]}
      />
    </div>
  )
}
