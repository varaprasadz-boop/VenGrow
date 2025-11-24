import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import ListingsPage from "@/pages/ListingsPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import EmailVerifiedPage from "@/pages/EmailVerifiedPage";
import OTPVerificationPage from "@/pages/OTPVerificationPage";
import PasswordResetSuccessPage from "@/pages/PasswordResetSuccessPage";
import BuyerDashboardPage from "@/pages/buyer/BuyerDashboardPage";
import FavoritesPage from "@/pages/buyer/FavoritesPage";
import InquiriesPage from "@/pages/buyer/InquiriesPage";
import ProfilePage from "@/pages/buyer/ProfilePage";
import SettingsPage from "@/pages/buyer/SettingsPage";
import NotificationsPage from "@/pages/buyer/NotificationsPage";
import PackagesPage from "@/pages/PackagesPage";
import SellerTypePage from "@/pages/seller/SellerTypePage";
import AboutPage from "@/pages/static/AboutPage";
import ContactPage from "@/pages/static/ContactPage";
import FAQPage from "@/pages/static/FAQPage";
import TermsPage from "@/pages/static/TermsPage";
import PrivacyPage from "@/pages/static/PrivacyPage";
import RefundPage from "@/pages/static/RefundPage";
import HowItWorksPage from "@/pages/static/HowItWorksPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import ForbiddenPage from "@/pages/error/ForbiddenPage";
import ServerErrorPage from "@/pages/error/ServerErrorPage";
import MaintenancePage from "@/pages/error/MaintenancePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/listings" component={ListingsPage} />
      <Route path="/property/:id" component={PropertyDetailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/verify-email" component={EmailVerificationPage} />
      <Route path="/email-verified" component={EmailVerifiedPage} />
      <Route path="/verify-otp" component={OTPVerificationPage} />
      <Route path="/password-reset-success" component={PasswordResetSuccessPage} />
      <Route path="/dashboard" component={BuyerDashboardPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/inquiries" component={InquiriesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/packages" component={PackagesPage} />
      <Route path="/seller/type" component={SellerTypePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/refund" component={RefundPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/404" component={NotFoundPage} />
      <Route path="/403" component={ForbiddenPage} />
      <Route path="/500" component={ServerErrorPage} />
      <Route path="/maintenance" component={MaintenancePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
