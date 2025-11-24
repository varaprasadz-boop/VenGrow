import Header from '../Header'

export default function HeaderExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Guest User</p>
        <Header isLoggedIn={false} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Logged In Buyer</p>
        <Header isLoggedIn={true} userType="buyer" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Logged In Seller</p>
        <Header isLoggedIn={true} userType="seller" />
      </div>
    </div>
  )
}
