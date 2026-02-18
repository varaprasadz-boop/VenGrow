import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { validateEmail, validatePhone, cleanPhone, normalizeEmail } from "@/utils/validation";
import { PhoneInput } from "@/components/ui/location-select";

import { Card } from "@/components/ui/card";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useAuth } from "@/hooks/useAuth";

const LocationPicker = lazy(() => import("@/components/LocationPicker"));
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UploadResult } from "@uppy/core";
import type { Project } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  Phone,
  Mail,
  AlertCircle,
  Home,
  Loader2,
  Save,
  Building2,
  Navigation,
  Star,
} from "lucide-react";
import { PopularCitySelect } from "@/components/ui/popular-city-select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  MEASUREMENT_UNITS,
  FLOORING_OPTIONS,
  VIEW_OPTIONS,
  TENANTS_PREFERRED_OPTIONS,
  LOCK_IN_MONTHS_OPTIONS,
  NEGOTIABLE_OPTIONS,
  PROPERTY_AMENITIES,
  NEW_PROJECT_AMENITIES,
  NEW_PROJECT_CATEGORIES,
  NEW_PROJECT_CAR_PARKING_OPTIONS,
  NEW_PROJECT_TOTAL_FLOORS_OPTIONS,
  NEW_PROJECT_FLATS_ON_FLOOR_OPTIONS,
  NEW_PROJECT_LIFTS_OPTIONS,
  PG_GENDER_OPTIONS,
  PG_LISTED_FOR_OPTIONS,
  PG_ROOM_TYPE_OPTIONS,
  PG_AVAILABLE_IN_OPTIONS,
  PG_FACILITIES_LIST,
  PG_RULES_LIST,
  PG_SERVICES_LIST,
  PG_NOTICE_PERIOD_OPTIONS,
} from "@/constants/property-options";

interface PropertyFormData {
  propertyType: string;
  transactionType: string;
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  latitude: string;
  longitude: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  floor: string;
  totalFloors: string;
  area: string;
  areaUnit: string;
  flooring: string;
  facing: string;
  furnishing: string;
  ageOfProperty: string;
  possessionStatus: string;
  expectedPossessionDate: string;
  amenities: string[];
  highlights: string[];
  photos: { url: string; caption: string; isPrimary: boolean }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  agreedToTerms: boolean;
  verifiedInfo: boolean;
  projectId: string;
  nearbyLandmark: string;
  superBuiltUpArea: string;
  carParkingCount: string;
  maintenanceCharges: string;
  viewType: string;
  numberOfLifts: string;
  isNegotiable: string;
  securityDeposit: string;
  lockInMonths: string;
  tenantsPreferred: string;
  negotiableRent: string;
  brokerageBothSides: string;
  disclosure: string;
  isResale: string;
  totalFlats: string;
  flatsOnFloor: string;
  totalVillas: string;
  isCornerProperty: string;
  roadWidthFeet: string;
  liftsAvailable: string;
  availableFrom: string;
  plotLength: string;
  plotBreadth: string;
  isCornerPlot: string;
  roadWidthPlotMeters: string;
  clubHouseAvailable: string;
  floorAllowedConstruction: string;
  soilType: string;
  fencing: string;
  waterSource: string;
  titleClear: string;
  farmHouse: string;
  approachRoadType: string;
  distanceFromNearestTown: string;
  farmProjectName: string;
  coLivingName: string;
  pgGender: string;
  pgListedFor: string;
  pgRoomType: string;
  pgAvailableIn: string;
  pgFurnishingDetails: string;
  pgAcAvailable: string;
  pgWashRoomType: string;
  pgFacilities: string[];
  pgRules: string[];
  pgCctv: string;
  pgBiometricEntry: string;
  pgSecurityGuard: string;
  pgServices: string[];
  pgFoodProvided: string;
  pgNonVegProvided: string;
  pgNoticePeriod: string;
  newProjectCategory: string;
  areaInLocality: string;
  newProjectFloorPlans: { superBuiltUpArea: string; carpetArea: string; bhk: string; bathrooms: string; balconies: string; totalPrice: string }[];
  newProjectDimensions: { area: string; totalPrice: string }[];
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Property type & location" },
  { id: 2, title: "Details", description: "Rooms & specifications" },
  { id: 3, title: "Photos", description: "Upload images" },
  { id: 4, title: "Review", description: "Contact & submit" },
];

const HIGHLIGHTS_LIST = [
  "Corner Property",
  "Sea View",
  "Garden View",
  "Near Metro",
  "Near School",
  "Near Hospital",
  "Near Market",
  "Gated Community",
  "Well Ventilated",
  "Vastu Compliant",
  "Prime Location",
  "Near IT Hub",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry"
];

export default function CreatePropertyPage() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const isEditMode = !!params.id;
  // Check if we're on an admin route
  const isAdminRoute = location?.startsWith('/admin/property/edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyType: "",
    transactionType: "",
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor: "",
    totalFloors: "",
    area: "",
    areaUnit: "Sq-ft",
    flooring: "",
    facing: "",
    furnishing: "",
    ageOfProperty: "",
    possessionStatus: "",
    expectedPossessionDate: "",
    amenities: [],
    highlights: [],
    photos: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    agreedToTerms: false,
    verifiedInfo: false,
    projectId: "",
    nearbyLandmark: "",
    superBuiltUpArea: "",
    carParkingCount: "",
    maintenanceCharges: "",
    viewType: "",
    numberOfLifts: "",
    isNegotiable: "",
    securityDeposit: "",
    lockInMonths: "",
    tenantsPreferred: "",
    negotiableRent: "",
    brokerageBothSides: "",
    disclosure: "",
    isResale: "",
    totalFlats: "",
    flatsOnFloor: "",
    totalVillas: "",
    isCornerProperty: "",
    roadWidthFeet: "",
    liftsAvailable: "",
    availableFrom: "",
    plotLength: "",
    plotBreadth: "",
    isCornerPlot: "",
    roadWidthPlotMeters: "",
    clubHouseAvailable: "",
    floorAllowedConstruction: "",
    soilType: "",
    fencing: "",
    waterSource: "",
    titleClear: "",
    farmHouse: "",
    approachRoadType: "",
    distanceFromNearestTown: "",
    farmProjectName: "",
    coLivingName: "",
    pgGender: "",
    pgListedFor: "",
    pgRoomType: "",
    pgAvailableIn: "",
    pgFurnishingDetails: "",
    pgAcAvailable: "",
    pgWashRoomType: "",
    pgFacilities: [],
    pgRules: [],
    pgCctv: "",
    pgBiometricEntry: "",
    pgSecurityGuard: "",
    pgServices: [],
    pgFoodProvided: "",
    pgNonVegProvided: "",
    pgNoticePeriod: "",
    newProjectCategory: "",
    areaInLocality: "",
    newProjectFloorPlans: [
      { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
      { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
      { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
      { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
    ],
    newProjectDimensions: [
      { area: "", totalPrice: "" },
      { area: "", totalPrice: "" },
      { area: "", totalPrice: "" },
      { area: "", totalPrice: "" },
    ],
  });

  const { data: canCreateData, isLoading: checkingLimit } = useQuery<{
    canCreate: boolean;
    reason?: string;
  }>({
    queryKey: ["/api/subscriptions/can-create-listing"],
  });

  const canHaveProjects = user?.sellerType && ["builder", "broker"].includes(user.sellerType);

  const { data: sellerProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/seller/projects"],
    enabled: canHaveProjects,
  });

  const liveProjects = useMemo(() => {
    return sellerProjects.filter(p => p.status === "live");
  }, [sellerProjects]);

  const { data: subscriptionData, isLoading: loadingSubscription } = useQuery<{
    subscription?: { id: string; listingsUsed: number };
    package?: { name: string; listingLimit: number };
    usage?: { listingsUsed: number; listingLimit: number; remainingListings: number };
  }>({
    queryKey: ["/api/subscriptions/current"],
  });

  const { data: authData } = useQuery<{
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      phone?: string;
    };
  }>({
    queryKey: ["/api/auth/me"],
  });

  // Load property data if in edit mode
  // Use admin endpoint if user is admin, otherwise use regular endpoint
  const { data: propertyData, isLoading: loadingProperty } = useQuery<{
    id: string;
    propertyType: string;
    transactionType: string;
    title: string;
    description?: string;
    price: number;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    locality?: string;
    latitude?: string;
    longitude?: string;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    floor?: number;
    totalFloors?: number;
    area: number;
    facing?: string;
    furnishing?: string;
    ageOfProperty?: number;
    possessionStatus?: string;
    amenities?: string[];
    highlights?: string[];
    projectId?: string;
    images?: Array<{ url: string; caption?: string; isPrimary?: boolean }>;
    sellerId?: string;
    seller?: {
      id: string;
      businessName?: string;
      firstName?: string;
      lastName?: string;
      sellerType?: string;
      isVerified?: boolean;
    };
    sellerUser?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
  }>({
    queryKey: ["/api/properties", params.id],
    enabled: isEditMode && !!params.id,
    queryFn: async () => {
      const response = await fetch(`/api/properties/${params.id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch property");
      return response.json();
    },
  });

  // Fetch seller user information if in edit mode and sellerId exists
  // Only fetch if not already included in propertyData (for admins, it might be included)
  const { data: sellerUserData } = useQuery<{
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
  }>({
    queryKey: ["/api/seller-user", propertyData?.sellerId],
    enabled: isEditMode && !!propertyData?.sellerId && !propertyData?.sellerUser,
    queryFn: async () => {
      if (!propertyData?.sellerId) return null;
      // If propertyData already has sellerUser, use that
      if (propertyData.sellerUser) {
        return propertyData.sellerUser;
      }
      
      try {
        // First get the seller profile to get userId
        const sellerProfileRes = await fetch(`/api/sellers/${propertyData.sellerId}`, { credentials: "include" });
        if (!sellerProfileRes.ok) {
          // If 401, it might be an auth issue - skip for now
          if (sellerProfileRes.status === 401) {
            console.warn("Unauthorized to fetch seller profile - skipping seller user data fetch");
            return null;
          }
          console.warn("Failed to fetch seller profile:", sellerProfileRes.status);
          return null;
        }
        const sellerProfile = await sellerProfileRes.json();
        
        // Then get the user information using userId from seller profile
        if (sellerProfile?.userId) {
          const userRes = await fetch(`/api/users/${sellerProfile.userId}`, { credentials: "include" });
          if (!userRes.ok) {
            // If 401, it might be an auth issue - skip for now
            if (userRes.status === 401) {
              console.warn("Unauthorized to fetch user - skipping seller user data fetch");
              return null;
            }
            console.warn("Failed to fetch user:", userRes.status);
            return null;
          }
          const userData = await userRes.json();
          console.log("Fetched seller user data:", { 
            id: userData.id, 
            email: userData.email, 
            phone: userData.phone,
            firstName: userData.firstName,
            lastName: userData.lastName
          });
          return userData;
        }
        return null;
      } catch (error) {
        console.error("Error fetching seller user data:", error);
        return null;
      }
    },
    retry: false, // Don't retry on 401 errors
  });

  // Populate form when property data loads
  useEffect(() => {
    if (propertyData) {
      setFormData(prev => ({
        ...prev,
        propertyType: propertyData.propertyType || "",
        transactionType: propertyData.transactionType || "",
        title: propertyData.title || "",
        description: propertyData.description || "",
        price: propertyData.price?.toString() || "",
        address: propertyData.address || "",
        city: propertyData.city || "",
        state: propertyData.state || "",
        pincode: propertyData.pincode || "",
        locality: propertyData.locality || "",
        latitude: propertyData.latitude || "",
        longitude: propertyData.longitude || "",
        bedrooms: propertyData.bedrooms?.toString() || "",
        bathrooms: propertyData.bathrooms?.toString() || "",
        balconies: propertyData.balconies?.toString() || "",
        floor: propertyData.floor?.toString() || "",
        totalFloors: propertyData.totalFloors?.toString() || "",
        area: propertyData.area?.toString() || "",
        areaUnit: (propertyData as any).areaUnit || "Sq-ft",
        flooring: (propertyData as any).flooring || "",
        facing: propertyData.facing || "",
        furnishing: propertyData.furnishing || "",
        ageOfProperty: propertyData.ageOfProperty?.toString() || "",
        possessionStatus: propertyData.possessionStatus || "",
        expectedPossessionDate: (propertyData as any).expectedPossessionDate || "",
        amenities: propertyData.amenities || [],
        highlights: propertyData.highlights || [],
        photos: (propertyData.images || [])
          .map((img: any) => ({
            url: img.url || img,
            caption: img.caption || "",
            isPrimary: img.isPrimary || false,
          }))
          .sort((a, b) => {
            // Sort so primary photo is first
            if (a.isPrimary) return -1;
            if (b.isPrimary) return 1;
            return 0;
          }),
        agreedToTerms: true,
        verifiedInfo: true,
        projectId: propertyData.projectId || "",
        nearbyLandmark: (propertyData as any).nearbyLandmark || "",
        superBuiltUpArea: (propertyData as any).superBuiltUpArea?.toString() || "",
        carParkingCount: (propertyData as any).carParkingCount?.toString() || "",
        maintenanceCharges: (propertyData as any).maintenanceCharges?.toString() || "",
        viewType: (propertyData as any).viewType || "",
        numberOfLifts: (propertyData as any).numberOfLifts?.toString() || "",
        isNegotiable: (propertyData as any).isNegotiable != null ? String((propertyData as any).isNegotiable) : "",
        securityDeposit: (propertyData as any).securityDeposit?.toString() || "",
        lockInMonths: (propertyData as any).lockInMonths?.toString() || "",
        tenantsPreferred: (propertyData as any).tenantsPreferred || "",
        negotiableRent: (propertyData as any).negotiableRent || "",
        brokerageBothSides: (propertyData as any).brokerageBothSides || "",
        disclosure: (propertyData as any).disclosure || "",
        isResale: (propertyData as any).isResale === true ? "resale" : (propertyData as any).isResale === false ? "new" : "",
        totalFlats: (propertyData as any).totalFlats?.toString() || "",
        flatsOnFloor: (propertyData as any).flatsOnFloor?.toString() || "",
        totalVillas: (propertyData as any).totalVillas?.toString() || "",
        isCornerProperty: (propertyData as any).isCornerProperty === true ? "yes" : (propertyData as any).isCornerProperty === false ? "no" : "",
        roadWidthFeet: (propertyData as any).roadWidthFeet?.toString() || "",
        liftsAvailable: (propertyData as any).liftsAvailable === true ? "yes" : (propertyData as any).liftsAvailable === false ? "no" : "",
        availableFrom: (propertyData as any).availableFrom || "",
        plotLength: (propertyData as any).plotLength?.toString() || "",
        plotBreadth: (propertyData as any).plotBreadth?.toString() || "",
        isCornerPlot: (propertyData as any).isCornerPlot === true ? "yes" : (propertyData as any).isCornerPlot === false ? "no" : "",
        roadWidthPlotMeters: (propertyData as any).roadWidthPlotMeters?.toString() || "",
        clubHouseAvailable: (propertyData as any).clubHouseAvailable === true ? "yes" : (propertyData as any).clubHouseAvailable === false ? "no" : "",
        floorAllowedConstruction: (propertyData as any).floorAllowedConstruction?.toString() || "",
        soilType: (propertyData as any).soilType || "",
        fencing: (propertyData as any).fencing === true ? "yes" : (propertyData as any).fencing === false ? "no" : "",
        waterSource: (propertyData as any).waterSource || "",
        titleClear: (propertyData as any).titleClear === true ? "yes" : (propertyData as any).titleClear === false ? "no" : "",
        farmHouse: (propertyData as any).farmHouse === true ? "yes" : (propertyData as any).farmHouse === false ? "no" : "",
        approachRoadType: (propertyData as any).approachRoadType || "",
        distanceFromNearestTown: (propertyData as any).distanceFromNearestTown || "",
        farmProjectName: (propertyData as any).farmProjectName || "",
        coLivingName: (propertyData as any).coLivingName || "",
        pgGender: (propertyData as any).pgGender || "",
        pgListedFor: (propertyData as any).pgListedFor || "",
        pgRoomType: (propertyData as any).pgRoomType || "",
        pgAvailableIn: (propertyData as any).pgAvailableIn || "",
        pgFurnishingDetails: (propertyData as any).pgFurnishingDetails || "",
        pgAcAvailable: (propertyData as any).pgAcAvailable === true ? "yes" : (propertyData as any).pgAcAvailable === false ? "no" : "",
        pgWashRoomType: (propertyData as any).pgWashRoomType || "",
        pgFacilities: Array.isArray((propertyData as any).pgFacilities) ? (propertyData as any).pgFacilities : [],
        pgRules: Array.isArray((propertyData as any).pgRules) ? (propertyData as any).pgRules : [],
        pgCctv: (propertyData as any).pgCctv === true ? "yes" : (propertyData as any).pgCctv === false ? "no" : "",
        pgBiometricEntry: (propertyData as any).pgBiometricEntry === true ? "yes" : (propertyData as any).pgBiometricEntry === false ? "no" : "",
        pgSecurityGuard: (propertyData as any).pgSecurityGuard === true ? "yes" : (propertyData as any).pgSecurityGuard === false ? "no" : "",
        pgServices: Array.isArray((propertyData as any).pgServices) ? (propertyData as any).pgServices : [],
        pgFoodProvided: (propertyData as any).pgFoodProvided === true ? "yes" : (propertyData as any).pgFoodProvided === false ? "no" : "",
        pgNonVegProvided: (propertyData as any).pgNonVegProvided === true ? "yes" : (propertyData as any).pgNonVegProvided === false ? "no" : "",
        pgNoticePeriod: (propertyData as any).pgNoticePeriod || "",
        newProjectCategory: (propertyData as any).newProjectCategory || "",
        areaInLocality: (propertyData as any).areaInLocality || "",
        newProjectFloorPlans: (() => {
          const raw = (propertyData as any).newProjectFloorPlans;
          if (!Array.isArray(raw) || raw.length === 0) {
            return [
              { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
              { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
              { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
              { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" },
            ];
          }
          const mapped = raw.map((fp: any) => ({
            superBuiltUpArea: fp.superBuiltUpArea?.toString() ?? "",
            carpetArea: fp.carpetArea?.toString() ?? "",
            bhk: fp.bhk?.toString() ?? "",
            bathrooms: fp.bathrooms?.toString() ?? "",
            balconies: fp.balconies?.toString() ?? "",
            totalPrice: fp.totalPrice?.toString() ?? "",
          }));
          while (mapped.length < 4) mapped.push({ superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" });
          return mapped.slice(0, 4);
        })(),
        newProjectDimensions: (() => {
          const raw = (propertyData as any).newProjectDimensions;
          if (!Array.isArray(raw) || raw.length === 0) {
            return [{ area: "", totalPrice: "" }, { area: "", totalPrice: "" }, { area: "", totalPrice: "" }, { area: "", totalPrice: "" }];
          }
          const mapped = raw.map((d: any) => ({ area: d.area?.toString() ?? "", totalPrice: d.totalPrice?.toString() ?? "" }));
          while (mapped.length < 4) mapped.push({ area: "", totalPrice: "" });
          return mapped.slice(0, 4);
        })(),
      }));
    }
  }, [propertyData]);

  // Update contact fields when seller user data loads (for admin editing)
  // Also check propertyData.sellerUser if available
  useEffect(() => {
    if (isEditMode) {
      const userData = sellerUserData || propertyData?.sellerUser;
      if (userData) {
        const contactName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "";
        // Handle phone - it might be null, undefined, or empty string
        const contactPhone = (userData.phone && userData.phone.trim()) ? userData.phone.trim() : "";
        const contactEmail = userData.email || "";

        console.log("Updating contact fields from seller user data:", { 
          contactName, 
          contactPhone, 
          contactEmail,
          rawPhone: userData.phone 
        });

        setFormData(prev => ({
          ...prev,
          contactName: contactName,
          contactPhone: contactPhone,
          contactEmail: contactEmail,
        }));
      }
    }
  }, [sellerUserData, propertyData?.sellerUser, isEditMode]);

  useEffect(() => {
    const user = authData?.user;
    if (user && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        contactName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "",
        contactPhone: user.phone || "",
        contactEmail: user.email || "",
      }));
    }
  }, [authData, isEditMode]);

  const createPropertyMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: async (result) => {
      if (result.success) {
        // Save photos if any were uploaded
        if (formData.photos && formData.photos.length > 0) {
          try {
            // Extract photo URLs from the photos array
            const photoURLs = formData.photos.map((photo: any) => {
              // Handle both object format {url: "..."} and string format
              return typeof photo === 'string' ? photo : photo.url || photo;
            }).filter((url: string) => url && url.trim() !== "");

            if (photoURLs.length > 0) {
              const photosResponse = await apiRequest("POST", `/api/properties/${result.property.id}/photos`, {
                photoURLs: photoURLs
              });
              
              if (!photosResponse.ok) {
                console.error("Failed to save property photos");
                // Don't fail the whole operation, just log the error
                toast({
                  title: "Property created, but photos failed to save",
                  description: "You can add photos later by editing the property.",
                  variant: "destructive",
                });
              }
            }
          } catch (error: any) {
            console.error("Error saving property photos:", error);
            // Don't fail the whole operation, just show a warning
            toast({
              title: "Property created, but photos failed to save",
              description: "You can add photos later by editing the property.",
              variant: "destructive",
            });
          }
        }

        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/can-create-listing"] });
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/current"] });
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
        queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
        toast({
          title: "Property Created",
          description: "Your property listing has been saved as draft. Submit it for review when ready.",
        });
        navigate((isAdmin || isAdminRoute) ? `/admin/properties` : `/seller/properties`);
      } else {
        throw new Error(result.message || "Failed to create property");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("PATCH", `/api/properties/${params.id}`, data);
      return response.json();
    },
    onSuccess: async (result) => {
      // Save photos if any were uploaded
      if (formData.photos && formData.photos.length > 0) {
        try {
          const photoURLs = formData.photos.map((photo: any) => {
            return typeof photo === 'string' ? photo : photo.url || photo;
          }).filter((url: string) => url && url.trim() !== "");

          if (photoURLs.length > 0) {
            const photosResponse = await apiRequest("POST", `/api/properties/${params.id}/photos`, {
              photoURLs: photoURLs
            });
            
            if (!photosResponse.ok) {
              console.error("Failed to save property photos");
            }
          }
        } catch (error: any) {
          console.error("Error saving property photos:", error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["/api/properties", params.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      
      const message = result.needsReapproval 
        ? result.message || "Changes saved. Your listing will be reviewed before going live."
        : "Property updated successfully";
      
      toast({
        title: "Property Updated",
        description: message,
      });
      navigate((isAdmin || isAdminRoute) ? `/admin/properties` : `/seller/properties`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: keyof PropertyFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "amenities" | "highlights", item: string) => {
    const current = formData[field];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field, updated);
  };

  const togglePgArray = (field: "pgFacilities" | "pgRules" | "pgServices", item: string) => {
    const current = formData[field];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field, updated);
  };

  const updateNewProjectFloorPlan = (planIndex: number, field: string, value: string) => {
    setFormData(prev => {
      const next = [...prev.newProjectFloorPlans];
      next[planIndex] = { ...next[planIndex], [field]: value };
      return { ...prev, newProjectFloorPlans: next };
    });
  };

  const updateNewProjectDimension = (dimIndex: number, field: "area" | "totalPrice", value: string) => {
    setFormData(prev => {
      const next = [...prev.newProjectDimensions];
      next[dimIndex] = { ...next[dimIndex], [field]: value };
      return { ...prev, newProjectDimensions: next };
    });
  };

  const toggleNewProjectAmenity = (item: string) => {
    const current = formData.amenities;
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField("amenities", updated);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const base = !!(
          formData.propertyType &&
          formData.transactionType &&
          formData.title &&
          formData.price &&
          formData.address &&
          formData.city &&
          formData.state
        );
        if (!base) return false;
        if (formData.propertyType === "new_projects") {
          const hasLocation = !!(formData.latitude && formData.longitude && formData.locality?.trim());
          const hasProject = !!formData.projectId?.trim();
          const hasCategory = !!formData.newProjectCategory?.trim();
          if (!hasCategory || !hasProject || !formData.locality?.trim() || !hasLocation) return false;
        }
        if (formData.transactionType === "sale") {
          return !!(formData.isResale === "new" || formData.isResale === "resale");
        }
        if (formData.transactionType === "rent" || formData.transactionType === "lease") {
          return !!(
            formData.availableFrom === "immediate" ||
            (formData.availableFrom && formData.availableFrom.length === 10)
          );
        }
        return true;
      }
      case 2: {
        if (formData.propertyType === "pg_co_living") {
          const pgBase = !!(formData.coLivingName?.trim() && (formData.price || formData.area));
          if (!pgBase) return false;
          return !!(
            formData.pgGender?.trim() &&
            formData.pgListedFor?.trim() &&
            formData.pgRoomType?.trim() &&
            formData.pgAvailableIn?.trim() &&
            (formData.pgAcAvailable === "yes" || formData.pgAcAvailable === "no") &&
            formData.pgWashRoomType?.trim() &&
            (formData.pgFacilities?.length > 0 || formData.pgRules?.length > 0 || formData.pgServices?.length > 0) &&
            (formData.pgFoodProvided === "yes" || formData.pgFoodProvided === "no") &&
            (formData.pgNonVegProvided === "yes" || formData.pgNonVegProvided === "no") &&
            formData.pgNoticePeriod?.trim()
          );
        }
        if (formData.propertyType === "new_projects") {
          const cat = formData.newProjectCategory;
          const hasFacing = !!formData.facing?.trim();
          const hasMaintenance = !!(formData.maintenanceCharges && parseInt(formData.maintenanceCharges, 10) >= 0);
          const hasPrice = !!(formData.price && parseInt(formData.price, 10) > 0);
          const hasPossession = !!formData.possessionStatus?.trim();
          if (cat === "apartment") {
            const fp1 = formData.newProjectFloorPlans[0];
            const hasFp1 = !!(fp1?.superBuiltUpArea && fp1?.carpetArea && fp1?.bhk && fp1?.bathrooms && fp1?.balconies !== "" && fp1?.totalPrice);
            const hasFlats = !!(formData.totalFlats && formData.flatsOnFloor && formData.totalFloors && formData.numberOfLifts !== "" && formData.flooring && formData.carParkingCount !== undefined && formData.carParkingCount !== "");
            return !!(hasFp1 && hasFlats && hasFacing && hasMaintenance && hasPrice && hasPossession);
          }
          if (cat === "row_house" || cat === "villa") {
            const fp1 = formData.newProjectFloorPlans[0];
            const hasFp1 = !!(fp1?.superBuiltUpArea && fp1?.carpetArea && fp1?.bhk && fp1?.bathrooms && fp1?.balconies !== "" && fp1?.totalPrice);
            const hasUnits = !!(formData.totalVillas && parseInt(formData.totalVillas, 10) > 0);
            return !!(hasFp1 && hasUnits && formData.flooring && formData.carParkingCount !== undefined && formData.carParkingCount !== "" && hasFacing && hasMaintenance && hasPrice && hasPossession);
          }
          if (cat === "plot") {
            const dim1 = formData.newProjectDimensions[0];
            const hasDim1 = !!(dim1?.area && dim1?.totalPrice);
            const hasUnits = !!(formData.totalVillas && parseInt(formData.totalVillas, 10) > 0);
            return !!(hasDim1 && hasUnits && hasFacing && hasMaintenance && hasPrice);
          }
          return false;
        }
        const base = !!(
          formData.area &&
          (
            formData.propertyType === "plot" ||
            formData.propertyType === "joint_venture" ||
            formData.propertyType === "commercial" ||
            formData.propertyType === "farmhouse" ||
            (formData.bedrooms && formData.bathrooms)
          )
        );
        if (!base) return false;
        if (
          formData.propertyType === "apartment" &&
          (formData.transactionType === "sale" || formData.transactionType === "lease")
        ) {
          return !!(formData.totalFlats && formData.flatsOnFloor && parseInt(formData.totalFlats, 10) > 0 && parseInt(formData.flatsOnFloor, 10) > 0);
        }
        if (formData.propertyType === "villa") {
          const totalVillasOk = !!(formData.totalVillas && parseInt(formData.totalVillas, 10) > 0);
          const totalFloorsOk = !!(formData.totalFloors && parseInt(formData.totalFloors, 10) > 0);
          const cornerOk = formData.isCornerProperty === "yes" || formData.isCornerProperty === "no";
          const liftsOk = formData.liftsAvailable === "yes" || formData.liftsAvailable === "no";
          return !!(totalVillasOk && totalFloorsOk && cornerOk && liftsOk);
        }
        if (formData.propertyType === "independent_house") {
          const totalUnitsOk = !!(formData.totalVillas && parseInt(formData.totalVillas, 10) > 0);
          const totalFloorsOk = !!(formData.totalFloors && parseInt(formData.totalFloors, 10) > 0);
          const cornerOk = formData.isCornerProperty === "yes" || formData.isCornerProperty === "no";
          const liftsOk = formData.liftsAvailable === "yes" || formData.liftsAvailable === "no";
          return !!(totalUnitsOk && totalFloorsOk && cornerOk && liftsOk);
        }
        if (formData.propertyType === "plot" || formData.propertyType === "joint_venture") {
          const lengthOk = !!(formData.plotLength && parseInt(formData.plotLength, 10) > 0);
          const breadthOk = !!(formData.plotBreadth && parseInt(formData.plotBreadth, 10) > 0);
          const cornerOk = formData.isCornerPlot === "yes" || formData.isCornerPlot === "no";
          const roadOk = !!(formData.roadWidthPlotMeters !== "" && parseInt(formData.roadWidthPlotMeters, 10) >= 0);
          const clubOk = formData.clubHouseAvailable === "yes" || formData.clubHouseAvailable === "no";
          const floorOk = formData.transactionType !== "sale" || !!(formData.floorAllowedConstruction !== "" && parseInt(formData.floorAllowedConstruction, 10) >= 0);
          return !!(lengthOk && breadthOk && cornerOk && roadOk && clubOk && floorOk);
        }
        if (formData.propertyType === "commercial") {
          const areaOk = !!(formData.area && parseInt(formData.area, 10) > 0);
          const facingOk = !!formData.facing?.trim();
          return !!(areaOk && facingOk);
        }
        if (formData.propertyType === "farmhouse") {
          const areaOk = !!(formData.area && parseInt(formData.area, 10) > 0);
          const soilOk = !!formData.soilType?.trim();
          const fencingOk = formData.fencing === "yes" || formData.fencing === "no";
          const waterOk = !!formData.waterSource?.trim();
          const titleOk = formData.titleClear === "yes" || formData.titleClear === "no";
          const farmHouseOk = formData.farmHouse === "yes" || formData.farmHouse === "no";
          return !!(areaOk && soilOk && fencingOk && waterOk && titleOk && farmHouseOk);
        }
        return true;
      }
      case 3:
        // Photos are optional but recommended - allow proceeding without photos
        // User can add photos later or proceed to next step
        return true;
      case 4:
        if (!formData.contactName || !formData.contactPhone || !formData.contactEmail ||
            !formData.agreedToTerms || !formData.verifiedInfo) {
          return false;
        }
        // Validate email and phone format
        if (!validateEmail(formData.contactEmail.trim())) {
          return false;
        }
        if (!validatePhone(formData.contactPhone)) {
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Warn user if proceeding from step 3 without photos
      if (currentStep === 3 && (!formData.photos || formData.photos.length === 0)) {
        toast({
          title: "No photos uploaded",
          description: "You can proceed without photos, but properties with photos get more views. You can add photos later by editing the property.",
          duration: 5000,
        });
      }
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Provide specific error messages for step 4
      if (currentStep === 4) {
        if (!formData.contactName || !formData.contactPhone || !formData.contactEmail) {
          toast({
            title: "Contact Information Required",
            description: "Please fill in all contact fields.",
            variant: "destructive",
          });
        } else if (!validateEmail(formData.contactEmail.trim())) {
          toast({
            title: "Invalid Email Format",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
        } else if (!validatePhone(formData.contactPhone)) {
          toast({
            title: "Invalid Phone Number",
            description: "Please enter a valid 10-digit Indian mobile number starting with 6-9.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Missing Information",
            description: "Please verify information and accept terms.",
            variant: "destructive",
          });
        }
      } else {
        if (currentStep === 1 && formData.transactionType === "sale" && !formData.isResale) {
          toast({
            title: "Sale details required",
            description: "Please select New property or Resale.",
            variant: "destructive",
          });
        } else if (currentStep === 1 && (formData.transactionType === "rent" || formData.transactionType === "lease") && !formData.availableFrom) {
          toast({
            title: "Available From required",
            description: "Please select when the property is available (Immediate or date).",
            variant: "destructive",
          });
        } else if (currentStep === 1 && formData.propertyType === "new_projects") {
          if (!formData.newProjectCategory?.trim()) {
            toast({ title: "Category required", description: "Please select Apartment, Row House, Villa, or Plots.", variant: "destructive" });
          } else if (!formData.projectId?.trim()) {
            toast({ title: "Project required", description: "Please select a Project / Society Name.", variant: "destructive" });
          } else if (!formData.locality?.trim()) {
            toast({ title: "Locality required", description: "Please enter Locality.", variant: "destructive" });
          } else if (!formData.latitude || !formData.longitude) {
            toast({ title: "Location on map required", description: "Please pin the location on the map (Google Search).", variant: "destructive" });
          } else {
            toast({ title: "Missing information", description: "Please fill all required New Project fields.", variant: "destructive" });
          }
        } else if (currentStep === 2 && formData.propertyType === "new_projects") {
          toast({
            title: "New project details required",
            description: "Please fill all required fields for your category (floor plans or dimensions, common details, possession).",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "apartment" && formData.transactionType === "sale" && (!formData.totalFlats || !formData.flatsOnFloor)) {
          toast({
            title: "Building details required",
            description: "For apartment sale, please enter Total Flats and Flats on the Floor.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "apartment" && formData.transactionType === "lease" && (!formData.totalFlats || !formData.flatsOnFloor)) {
          toast({
            title: "Building details required",
            description: "For apartment lease, please enter Total Flats and Flats on the Floor.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "villa" && (!formData.totalVillas || !formData.totalFloors || !formData.isCornerProperty || !formData.liftsAvailable)) {
          toast({
            title: "Villa details required",
            description: "For villa listings, please enter Total Villas, Total Floors, Corner Property, and Lifts Available.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "independent_house" && (!formData.totalVillas || !formData.totalFloors || !formData.isCornerProperty || !formData.liftsAvailable)) {
          toast({
            title: "Independent house details required",
            description: "For independent house listings, please enter Total Units, Total Floors, Corner Property, and Lifts Available.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && (formData.propertyType === "plot" || formData.propertyType === "joint_venture")) {
          toast({
            title: "Plot details required",
            description: "For plot listings, please enter Plot Area, Length, Breadth, Corner Plot, Road width, and Club House. For sale, also enter Floor allowed for Construction.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "commercial") {
          toast({
            title: "Commercial details required",
            description: "For commercial listings, please enter Available Area and Facing.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "farmhouse") {
          toast({
            title: "Farm details required",
            description: "For farm listings, please enter Land Area, Soil Type, Fencing, Water Source, Title Clear, and Farm House.",
            variant: "destructive",
          });
        } else if (currentStep === 2 && formData.propertyType === "pg_co_living") {
          toast({
            title: "PG/Co-living details required",
            description: "Please fill in all required PG/Co-living details (name, gender, listed for, room type, wash room, food, notice period, and at least one of facilities, rules, or services).",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields before proceeding.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      if (!formData.contactName || !formData.contactPhone || !formData.contactEmail) {
        toast({
          title: "Contact Information Required",
          description: "Please fill in all contact fields.",
          variant: "destructive",
        });
      } else if (!validateEmail(formData.contactEmail.trim())) {
        toast({
          title: "Invalid Email Format",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
      } else if (!validatePhone(formData.contactPhone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit Indian mobile number starting with 6-9.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Missing Information",
          description: "Please complete all required fields and agreements.",
          variant: "destructive",
        });
      }
      return;
    }

    const isNewProject = formData.propertyType === "new_projects";
    const primaryPrice = isNewProject && (formData.newProjectCategory === "apartment" || formData.newProjectCategory === "row_house" || formData.newProjectCategory === "villa")
      ? (formData.newProjectFloorPlans[0]?.totalPrice ? parseInt(formData.newProjectFloorPlans[0].totalPrice, 10) : parseInt(formData.price, 10) || 0)
      : isNewProject && formData.newProjectCategory === "plot"
        ? (formData.newProjectDimensions[0]?.totalPrice ? parseInt(formData.newProjectDimensions[0].totalPrice, 10) : parseInt(formData.price, 10) || 0)
        : parseInt(formData.price) || 0;
    const primaryArea = isNewProject && (formData.newProjectCategory === "apartment" || formData.newProjectCategory === "row_house" || formData.newProjectCategory === "villa")
      ? (formData.newProjectFloorPlans[0]?.superBuiltUpArea ? parseInt(formData.newProjectFloorPlans[0].superBuiltUpArea, 10) : parseInt(formData.area, 10) || 0)
      : isNewProject && formData.newProjectCategory === "plot"
        ? (formData.newProjectDimensions[0]?.area ? parseInt(formData.newProjectDimensions[0].area, 10) : parseInt(formData.area, 10) || 0)
        : parseInt(formData.area) || 0;

    const propertyData = {
      title: formData.title,
      description: formData.description,
      propertyType: formData.propertyType,
      transactionType: formData.transactionType,
      price: primaryPrice,
      pricePerSqft: primaryArea ? Math.round(primaryPrice / primaryArea) : (formData.area ? Math.round(parseInt(formData.price) / parseInt(formData.area)) : null),
      area: primaryArea,
      areaUnit: formData.areaUnit || "Sq-ft",
      flooring: formData.flooring || null,
      bedrooms: parseInt(formData.bedrooms) || null,
      bathrooms: parseInt(formData.bathrooms) || null,
      balconies: parseInt(formData.balconies) || null,
      floor: parseInt(formData.floor) || null,
      totalFloors: parseInt(formData.totalFloors) || null,
      facing: formData.facing || null,
      furnishing: formData.furnishing || null,
      ageOfProperty: parseInt(formData.ageOfProperty) || null,
      possessionStatus: formData.possessionStatus || null,
      expectedPossessionDate: formData.expectedPossessionDate || null,
      address: formData.address,
      locality: formData.locality || null,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      amenities: formData.amenities,
      highlights: formData.highlights,
      projectId: formData.projectId || null,
      contactName: formData.contactName?.trim() || null,
      contactPhone: formData.contactPhone ? cleanPhone(formData.contactPhone) : null,
      contactEmail: formData.contactEmail ? normalizeEmail(formData.contactEmail) : null,
      nearbyLandmark: formData.nearbyLandmark?.trim() || null,
      newProjectCategory: formData.propertyType === "new_projects" ? (formData.newProjectCategory || null) : null,
      areaInLocality: formData.propertyType === "new_projects" ? (formData.areaInLocality?.trim() || null) : null,
      newProjectFloorPlans: formData.propertyType === "new_projects" ? formData.newProjectFloorPlans.map(fp => ({
        superBuiltUpArea: fp.superBuiltUpArea ? parseInt(fp.superBuiltUpArea, 10) : undefined,
        carpetArea: fp.carpetArea ? parseInt(fp.carpetArea, 10) : undefined,
        bhk: fp.bhk ? parseInt(fp.bhk, 10) : undefined,
        bathrooms: fp.bathrooms ? parseInt(fp.bathrooms, 10) : undefined,
        balconies: fp.balconies !== "" ? parseInt(fp.balconies, 10) : undefined,
        totalPrice: fp.totalPrice ? parseInt(fp.totalPrice, 10) : undefined,
      })).filter(fp => fp.superBuiltUpArea || fp.totalPrice) : undefined,
      newProjectDimensions: formData.propertyType === "new_projects" ? formData.newProjectDimensions.map(d => ({
        area: d.area ? parseInt(d.area, 10) : undefined,
        totalPrice: d.totalPrice ? parseInt(d.totalPrice, 10) : undefined,
      })).filter(d => d.area || d.totalPrice) : undefined,
      superBuiltUpArea: formData.superBuiltUpArea ? parseInt(formData.superBuiltUpArea, 10) : null,
      carParkingCount: formData.carParkingCount ? parseInt(formData.carParkingCount, 10) : null,
      maintenanceCharges: formData.maintenanceCharges ? parseInt(formData.maintenanceCharges, 10) : null,
      viewType: formData.viewType || null,
      numberOfLifts: formData.numberOfLifts ? parseInt(formData.numberOfLifts, 10) : null,
      isNegotiable: formData.isNegotiable === "true" ? true : formData.isNegotiable === "false" ? false : null,
      securityDeposit: formData.securityDeposit ? parseInt(formData.securityDeposit, 10) : null,
      lockInMonths: formData.lockInMonths ? parseInt(formData.lockInMonths, 10) : null,
      tenantsPreferred: formData.tenantsPreferred || null,
      negotiableRent: formData.negotiableRent || null,
      brokerageBothSides: formData.brokerageBothSides || null,
      disclosure: formData.disclosure || null,
      isResale: formData.isResale === "resale" ? true : formData.isResale === "new" ? false : null,
      totalFlats: formData.totalFlats ? parseInt(formData.totalFlats, 10) : null,
      flatsOnFloor: formData.flatsOnFloor ? parseInt(formData.flatsOnFloor, 10) : null,
      totalVillas: formData.totalVillas ? parseInt(formData.totalVillas, 10) : null,
      isCornerProperty: formData.isCornerProperty === "yes" ? true : formData.isCornerProperty === "no" ? false : null,
      roadWidthFeet: formData.roadWidthFeet ? parseInt(formData.roadWidthFeet, 10) : null,
      liftsAvailable: formData.liftsAvailable === "yes" ? true : formData.liftsAvailable === "no" ? false : null,
      plotLength: formData.plotLength ? parseInt(formData.plotLength, 10) : null,
      plotBreadth: formData.plotBreadth ? parseInt(formData.plotBreadth, 10) : null,
      isCornerPlot: formData.isCornerPlot === "yes" ? true : formData.isCornerPlot === "no" ? false : null,
      roadWidthPlotMeters: formData.roadWidthPlotMeters ? parseInt(formData.roadWidthPlotMeters, 10) : null,
      clubHouseAvailable: formData.clubHouseAvailable === "yes" ? true : formData.clubHouseAvailable === "no" ? false : null,
      floorAllowedConstruction: formData.floorAllowedConstruction ? parseInt(formData.floorAllowedConstruction, 10) : null,
      soilType: formData.soilType || null,
      fencing: formData.fencing === "yes" ? true : formData.fencing === "no" ? false : null,
      waterSource: formData.waterSource || null,
      titleClear: formData.titleClear === "yes" ? true : formData.titleClear === "no" ? false : null,
      farmHouse: formData.farmHouse === "yes" ? true : formData.farmHouse === "no" ? false : null,
      approachRoadType: formData.approachRoadType || null,
      distanceFromNearestTown: formData.distanceFromNearestTown || null,
      farmProjectName: formData.farmProjectName || null,
      coLivingName: formData.propertyType === "pg_co_living" ? (formData.coLivingName?.trim() || null) : null,
      pgGender: formData.propertyType === "pg_co_living" ? (formData.pgGender || null) : null,
      pgListedFor: formData.propertyType === "pg_co_living" ? (formData.pgListedFor || null) : null,
      pgRoomType: formData.propertyType === "pg_co_living" ? (formData.pgRoomType || null) : null,
      pgAvailableIn: formData.propertyType === "pg_co_living" ? (formData.pgAvailableIn || null) : null,
      pgFurnishingDetails: formData.propertyType === "pg_co_living" ? (formData.pgFurnishingDetails?.trim() || null) : null,
      pgAcAvailable: formData.propertyType === "pg_co_living" ? (formData.pgAcAvailable === "yes" ? true : formData.pgAcAvailable === "no" ? false : null) : null,
      pgWashRoomType: formData.propertyType === "pg_co_living" ? (formData.pgWashRoomType || null) : null,
      pgFacilities: formData.propertyType === "pg_co_living" ? (formData.pgFacilities?.length ? formData.pgFacilities : null) : null,
      pgRules: formData.propertyType === "pg_co_living" ? (formData.pgRules?.length ? formData.pgRules : null) : null,
      pgCctv: formData.propertyType === "pg_co_living" ? (formData.pgCctv === "yes" ? true : formData.pgCctv === "no" ? false : null) : null,
      pgBiometricEntry: formData.propertyType === "pg_co_living" ? (formData.pgBiometricEntry === "yes" ? true : formData.pgBiometricEntry === "no" ? false : null) : null,
      pgSecurityGuard: formData.propertyType === "pg_co_living" ? (formData.pgSecurityGuard === "yes" ? true : formData.pgSecurityGuard === "no" ? false : null) : null,
      pgServices: formData.propertyType === "pg_co_living" ? (formData.pgServices?.length ? formData.pgServices : null) : null,
      pgFoodProvided: formData.propertyType === "pg_co_living" ? (formData.pgFoodProvided === "yes" ? true : formData.pgFoodProvided === "no" ? false : null) : null,
      pgNonVegProvided: formData.propertyType === "pg_co_living" ? (formData.pgNonVegProvided === "yes" ? true : formData.pgNonVegProvided === "no" ? false : null) : null,
      pgNoticePeriod: formData.propertyType === "pg_co_living" ? (formData.pgNoticePeriod || null) : null,
      availableFrom:
        formData.availableFrom?.trim() === "immediate" || (formData.availableFrom && formData.availableFrom.length === 10)
          ? formData.availableFrom.trim()
          : null,
    };

    if (isEditMode) {
      updatePropertyMutation.mutate(propertyData);
    } else {
      createPropertyMutation.mutate(propertyData);
    }
  };

  const formatPrice = (price: string): string => {
    const num = parseInt(price);
    if (isNaN(num)) return "₹0";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  if (loadingProperty) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading property...</p>
        </div>
      </main>
    );
  }

  if (checkingLimit || loadingSubscription) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking your subscription...</p>
        </div>
      </main>
    );
  }

  if (!isEditMode && !canCreateData?.canCreate) {
    return (
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Listing Limit Reached</AlertTitle>
            <AlertDescription>
              {subscriptionData?.subscription 
                ? `You've used ${subscriptionData.usage?.listingsUsed ?? subscriptionData.subscription.listingsUsed} of ${subscriptionData.usage?.listingLimit ?? subscriptionData.package?.listingLimit} listings in your ${subscriptionData.package?.name} plan.`
                : "You don't have an active subscription."}
            </AlertDescription>
          </Alert>
          <Card className="p-8 text-center">
            <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Upgrade Your Plan</h1>
            <p className="text-muted-foreground mb-6">
              To create more property listings, please upgrade to a higher package.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate((isAdmin || isAdminRoute) ? "/admin/dashboard" : "/seller/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate((isAdmin || isAdminRoute) ? "/admin/packages" : "/seller/packages")}>
                View Packages
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{isEditMode ? "Edit Property" : "Add Property"}</h1>
              {!isEditMode && subscriptionData?.subscription && (
                <Badge variant="outline">
                  {subscriptionData.usage?.listingsUsed ?? subscriptionData.subscription.listingsUsed}/{subscriptionData.usage?.listingLimit ?? subscriptionData.package?.listingLimit} listings used
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-colors ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {STEPS.map(step => (
                <div key={step.id} className="text-center flex-1">
                  <p className={currentStep >= step.id ? "font-medium" : "text-muted-foreground"}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-6">
                Property Basic Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          propertyType: value,
                          ...(value === "pg_co_living" ? { transactionType: "rent" } : {}),
                          ...(value === "new_projects" ? { transactionType: "sale", isResale: "new" } : {}),
                        }));
                      }}
                    >
                      <SelectTrigger id="propertyType" data-testid="select-property-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartments</SelectItem>
                        <SelectItem value="villa">Villas</SelectItem>
                        <SelectItem value="plot">Plots</SelectItem>
                        <SelectItem value="independent_house">Independent House</SelectItem>
                        <SelectItem value="new_projects">New Projects</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="joint_venture">Joint Venture</SelectItem>
                        <SelectItem value="pg_co_living">PG / Co-Living</SelectItem>
                        <SelectItem value="farmhouse">Farm Land</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionType">Transaction Type *</Label>
                    <Select
                      value={formData.transactionType}
                      onValueChange={(value) => updateField("transactionType", value)}
                      disabled={formData.propertyType === "pg_co_living"}
                    >
                      <SelectTrigger id="transactionType" data-testid="select-transaction-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.propertyType !== "pg_co_living" && <SelectItem value="sale">For Sale</SelectItem>}
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.propertyType === "pg_co_living" && (
                      <p className="text-xs text-muted-foreground">PG Co-living is rent-only (monthly rent).</p>
                    )}
                  </div>
                </div>

                {formData.propertyType === "new_projects" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="newProjectCategory">Category *</Label>
                      <Select
                        value={formData.newProjectCategory}
                        onValueChange={(value) => updateField("newProjectCategory", value)}
                      >
                        <SelectTrigger id="newProjectCategory" data-testid="select-new-project-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {NEW_PROJECT_CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectIdNew" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Project / Society Name *
                      </Label>
                      <Select
                        value={formData.projectId || "none"}
                        onValueChange={(value) => updateField("projectId", value === "none" ? "" : value)}
                      >
                        <SelectTrigger id="projectIdNew" data-testid="select-project-new">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select project</SelectItem>
                          {(sellerProjects || []).map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name} – {project.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!canHaveProjects && (
                        <p className="text-xs text-amber-600">Only Brokers and Builders can create projects. <a href="/seller/projects/create" className="underline">Create a project</a> first if you have access.</p>
                      )}
                      {canHaveProjects && liveProjects.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          <a href="/seller/projects/create" className="text-primary underline">Create a project</a> first, then add this new project listing.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {(canHaveProjects && formData.transactionType === "sale" && liveProjects.length > 0 && formData.propertyType !== "new_projects") && (
                  <div className="space-y-2">
                    <Label htmlFor="projectId" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Link to Project (Optional)
                    </Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => updateField("projectId", value === "none" ? "" : value)}
                    >
                      <SelectTrigger id="projectId" data-testid="select-project">
                        <SelectValue placeholder="Select a project to link this property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project (standalone listing)</SelectItem>
                        {liveProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} - {project.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Link this property to one of your projects. Properties linked to projects appear on the project page.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    data-testid="input-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    A catchy title helps attract more buyers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your property, its features, amenities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">₹</span>
                    <Input
                      id="price"
                      type="number"
                      placeholder={formData.transactionType === "rent" ? "45000" : "8500000"}
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      data-testid="input-price"
                    />
                    {formData.transactionType === "rent" && (
                      <span className="text-muted-foreground whitespace-nowrap">/month</span>
                    )}
                  </div>
                  {formData.price && (
                    <p className="text-sm text-primary font-medium">
                      {formatPrice(formData.price)}
                    </p>
                  )}
                </div>

                {(formData.transactionType === "rent" || formData.transactionType === "lease") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Available From *</Label>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={
                            formData.availableFrom === "immediate"
                              ? "immediate"
                              : formData.availableFrom && formData.availableFrom.length === 10
                                ? "date"
                                : !formData.availableFrom
                                  ? ""
                                  : "date"
                          }
                          onValueChange={(value) => updateField("availableFrom", value === "immediate" ? "immediate" : value === "date" ? "date" : "")}
                        >
                          <SelectTrigger id="availableFrom">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="date">Select date</SelectItem>
                          </SelectContent>
                        </Select>
                        {(formData.availableFrom === "date" || (formData.availableFrom && formData.availableFrom !== "immediate" && formData.availableFrom.length === 10)) && (
                          <Input
                            type="date"
                            value={formData.availableFrom === "date" ? "" : formData.availableFrom}
                            onChange={(e) => updateField("availableFrom", e.target.value)}
                          />
                        )}
                        {formData.availableFrom === "immediate" && (
                          <p className="text-xs text-muted-foreground">Property is available for occupancy immediately.</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                        <Input
                          id="securityDeposit"
                          type="number"
                          placeholder="e.g., 100000"
                          value={formData.securityDeposit}
                          onChange={(e) => updateField("securityDeposit", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lockInMonths">Lock-in period (months)</Label>
                        <Select
                          value={formData.lockInMonths}
                          onValueChange={(value) => updateField("lockInMonths", value)}
                        >
                          <SelectTrigger id="lockInMonths">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCK_IN_MONTHS_OPTIONS.map((m) => (
                              <SelectItem key={m} value={String(m)}>{m} months</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenantsPreferred">Tenants Preferred</Label>
                      <Select
                        value={formData.tenantsPreferred}
                        onValueChange={(value) => updateField("tenantsPreferred", value)}
                      >
                        <SelectTrigger id="tenantsPreferred">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {TENANTS_PREFERRED_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Negotiable (Rent)</Label>
                        <Select
                          value={formData.negotiableRent}
                          onValueChange={(value) => updateField("negotiableRent", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {NEGOTIABLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Brokerage Both Sides</Label>
                        <Select
                          value={formData.brokerageBothSides}
                          onValueChange={(value) => updateField("brokerageBothSides", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {NEGOTIABLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Disclosure</Label>
                        <Select
                          value={formData.disclosure}
                          onValueChange={(value) => updateField("disclosure", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {NEGOTIABLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {formData.transactionType === "sale" && (
                  <>
                    <div className="space-y-2">
                      <Label>New property or Resale *</Label>
                      <Select
                        value={formData.isResale}
                        onValueChange={(value) => updateField("isResale", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New property</SelectItem>
                          <SelectItem value="resale">Resale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price Negotiable</Label>
                      <Select
                        value={formData.isNegotiable}
                        onValueChange={(value) => updateField("isNegotiable", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Location Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        rows={2}
                        placeholder="Building name, street, area"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        data-testid="textarea-address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => {
                            updateField("state", value);
                            // Clear city when state changes
                            updateField("city", "");
                          }}
                        >
                          <SelectTrigger id="state" data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <PopularCitySelect
                          value={formData.city}
                          onValueChange={(value) => updateField("city", value)}
                          stateValue={formData.state}
                          placeholder="Select or enter city"
                          data-testid="select-city"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="locality">Locality {formData.propertyType === "new_projects" && "*"}</Label>
                        <Input
                          id="locality"
                          placeholder="e.g., Bandra West"
                          value={formData.locality}
                          onChange={(e) => updateField("locality", e.target.value)}
                          data-testid="input-locality"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          placeholder="400001"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                          data-testid="input-pincode"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nearbyLandmark">Near by Land mark (Optional)</Label>
                      <Input
                        id="nearbyLandmark"
                        placeholder="e.g., Near metro station"
                        value={formData.nearbyLandmark}
                        onChange={(e) => updateField("nearbyLandmark", e.target.value)}
                      />
                    </div>

                    {formData.propertyType === "new_projects" && (
                      <div className="space-y-2">
                        <Label htmlFor="areaInLocality">Area in Locality (Optional)</Label>
                        <Input
                          id="areaInLocality"
                          placeholder="e.g., Sector 5"
                          value={formData.areaInLocality}
                          onChange={(e) => updateField("areaInLocality", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-4 mt-4">
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" />
                          {formData.propertyType === "new_projects" ? "Google Search *" : "Pin Location on Map"}
                        </Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Select your property's exact location on the map or enter coordinates manually
                        </p>
                        <Suspense fallback={
                          <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center border">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        }>
                          <div className="border rounded-lg overflow-hidden">
                            <LocationPicker
                              latitude={formData.latitude ? parseFloat(formData.latitude) : undefined}
                              longitude={formData.longitude ? parseFloat(formData.longitude) : undefined}
                              onLocationChange={(lat, lng) => {
                                updateField("latitude", lat.toString());
                                updateField("longitude", lng.toString());
                              }}
                              onAddressSelect={(address) => {
                                // Optionally update address field when location is selected
                                if (address && !formData.address) {
                                  updateField("address", address);
                                }
                              }}
                              defaultCity={formData.city || "Mumbai"}
                              height="400px"
                            />
                          </div>
                        </Suspense>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="latitude" className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            Latitude (Optional)
                          </Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 19.0760"
                            value={formData.latitude}
                            onChange={(e) => {
                              const lat = e.target.value;
                              updateField("latitude", lat);
                              // Update map if both coordinates are valid
                              if (lat && formData.longitude) {
                                const latNum = parseFloat(lat);
                                const lngNum = parseFloat(formData.longitude);
                                if (!isNaN(latNum) && !isNaN(lngNum)) {
                                  // Map will update via the latitude/longitude props
                                }
                              }
                            }}
                            data-testid="input-latitude"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter latitude manually or select on map
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="longitude" className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            Longitude (Optional)
                          </Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 72.8777"
                            value={formData.longitude}
                            onChange={(e) => {
                              const lng = e.target.value;
                              updateField("longitude", lng);
                              // Update map if both coordinates are valid
                              if (lng && formData.latitude) {
                                const latNum = parseFloat(formData.latitude);
                                const lngNum = parseFloat(lng);
                                if (!isNaN(latNum) && !isNaN(lngNum)) {
                                  // Map will update via the latitude/longitude props
                                }
                              }
                            }}
                            data-testid="input-longitude"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter longitude manually or select on map
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-6">
                Property Specifications
              </h2>

              <div className="space-y-6">
                {formData.propertyType === "new_projects" && (
                  <>
                    {(formData.newProjectCategory === "apartment" || formData.newProjectCategory === "row_house" || formData.newProjectCategory === "villa") && (
                      <div>
                        <h3 className="font-semibold mb-4">Floor Plans</h3>
                        <p className="text-sm text-muted-foreground mb-4">Add up to 4 floor plan configurations. At least Floor Plan 1 is required.</p>
                        {[0, 1, 2, 3].map((idx) => {
                          const fp = formData.newProjectFloorPlans[idx];
                          return (
                            <div key={idx} className="border rounded-lg p-4 mb-4 space-y-3">
                              <h4 className="font-medium text-sm">Floor Plan {idx + 1}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div className="space-y-1">
                                  <Label>Super Built Up (sqft)</Label>
                                  <Input type="number" placeholder="e.g. 1200" value={fp.superBuiltUpArea} onChange={(e) => updateNewProjectFloorPlan(idx, "superBuiltUpArea", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Carpet Area (sqft)</Label>
                                  <Input type="number" placeholder="e.g. 1000" value={fp.carpetArea} onChange={(e) => updateNewProjectFloorPlan(idx, "carpetArea", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>BHK</Label>
                                  <Input type="number" min={1} placeholder="e.g. 3" value={fp.bhk} onChange={(e) => updateNewProjectFloorPlan(idx, "bhk", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Bathroom</Label>
                                  <Input type="number" min={1} placeholder="e.g. 2" value={fp.bathrooms} onChange={(e) => updateNewProjectFloorPlan(idx, "bathrooms", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Balcony</Label>
                                  <Input type="number" min={0} placeholder="e.g. 2" value={fp.balconies} onChange={(e) => updateNewProjectFloorPlan(idx, "balconies", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label>Total Price (₹)</Label>
                                  <Input type="number" placeholder="e.g. 8500000" value={fp.totalPrice} onChange={(e) => updateNewProjectFloorPlan(idx, "totalPrice", e.target.value)} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {formData.newProjectCategory === "plot" && (
                      <div>
                        <h3 className="font-semibold mb-4">Dimensions</h3>
                        <p className="text-sm text-muted-foreground mb-4">Add up to 4 dimension configurations. At least Dimension 1 is required.</p>
                        {[0, 1, 2, 3].map((idx) => {
                          const dim = formData.newProjectDimensions[idx];
                          return (
                            <div key={idx} className="border rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-end">
                              <span className="font-medium text-sm">Dimension {idx + 1}</span>
                              <div className="space-y-1">
                                <Label>Area (sqft)</Label>
                                <Input type="number" placeholder="e.g. 1200" value={dim.area} onChange={(e) => updateNewProjectDimension(idx, "area", e.target.value)} className="w-40" />
                              </div>
                              <div className="space-y-1">
                                <Label>Total Price (₹)</Label>
                                <Input type="number" placeholder="e.g. 5000000" value={dim.totalPrice} onChange={(e) => updateNewProjectDimension(idx, "totalPrice", e.target.value)} className="w-40" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Common Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Facings Available *</Label>
                          <Input placeholder="e.g. North, East" value={formData.facing} onChange={(e) => updateField("facing", e.target.value)} />
                        </div>
                        {(formData.newProjectCategory === "apartment" || formData.newProjectCategory === "row_house" || formData.newProjectCategory === "villa") && (
                          <div className="space-y-2">
                            <Label>Flooring Type *</Label>
                            <Select value={formData.flooring} onValueChange={(v) => updateField("flooring", v)}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {FLOORING_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>No. of car parking *</Label>
                          <Select value={formData.carParkingCount ?? ""} onValueChange={(v) => updateField("carParkingCount", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {NEW_PROJECT_CAR_PARKING_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Maintenance charges (₹) *</Label>
                          <Input type="number" placeholder="e.g. 3000" value={formData.maintenanceCharges} onChange={(e) => updateField("maintenanceCharges", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Per sft price (₹) *</Label>
                          <Input type="number" placeholder="e.g. 7000" value={formData.price} onChange={(e) => updateField("price", e.target.value)} />
                          <p className="text-xs text-muted-foreground">Used as indicative price per sqft for the project</p>
                        </div>
                        {formData.newProjectCategory === "apartment" && (
                          <>
                            <div className="space-y-2">
                              <Label>Total Flats *</Label>
                              <Input type="number" min={1} placeholder="e.g. 100" value={formData.totalFlats} onChange={(e) => updateField("totalFlats", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Total Floors *</Label>
                              <Select value={formData.totalFloors ?? ""} onValueChange={(v) => updateField("totalFloors", v)}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                  {NEW_PROJECT_TOTAL_FLOORS_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Flats on the Floor *</Label>
                              <Select value={formData.flatsOnFloor ?? ""} onValueChange={(v) => updateField("flatsOnFloor", v)}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                  {NEW_PROJECT_FLATS_ON_FLOOR_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>No. of Lifts *</Label>
                              <Select value={formData.numberOfLifts ?? ""} onValueChange={(v) => updateField("numberOfLifts", v)}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                  {NEW_PROJECT_LIFTS_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        {(formData.newProjectCategory === "row_house" || formData.newProjectCategory === "villa" || formData.newProjectCategory === "plot") && (
                          <div className="space-y-2">
                            <Label>Total Units *</Label>
                            <Input type="number" min={1} placeholder="e.g. 24" value={formData.totalVillas} onChange={(e) => updateField("totalVillas", e.target.value)} />
                          </div>
                        )}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Possession *</Label>
                          <Select value={formData.possessionStatus ?? ""} onValueChange={(v) => updateField("possessionStatus", v)}>
                            <SelectTrigger><SelectValue placeholder="Under Construction or Ready to Move" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under Construction">Under Construction</SelectItem>
                              <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                            </SelectContent>
                          </Select>
                          {formData.possessionStatus === "Under Construction" && (
                            <div className="mt-2">
                              <Label className="text-muted-foreground">When is the possession?</Label>
                              <Input type="text" placeholder="e.g. Dec 2026" value={formData.expectedPossessionDate} onChange={(e) => updateField("expectedPossessionDate", e.target.value)} className="mt-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Amenities</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {NEW_PROJECT_AMENITIES.map((a) => (
                          <div key={a} className="flex items-center gap-2">
                            <Checkbox
                              id={`amenity-np-${a}`}
                              checked={formData.amenities.includes(a)}
                              onCheckedChange={() => toggleNewProjectAmenity(a)}
                            />
                            <Label htmlFor={`amenity-np-${a}`} className="font-normal cursor-pointer text-sm">{a}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {formData.propertyType !== "new_projects" && (
                <>
                {formData.propertyType !== "plot" && formData.propertyType !== "joint_venture" && formData.propertyType !== "farmhouse" && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4">Room Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Select
                            value={formData.bedrooms}
                            onValueChange={(value) => updateField("bedrooms", value)}
                          >
                            <SelectTrigger id="bedrooms" data-testid="select-bedrooms">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Studio</SelectItem>
                              <SelectItem value="1">1 BHK</SelectItem>
                              <SelectItem value="2">2 BHK</SelectItem>
                              <SelectItem value="3">3 BHK</SelectItem>
                              <SelectItem value="4">4 BHK</SelectItem>
                              <SelectItem value="5">5+ BHK</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Select
                            value={formData.bathrooms}
                            onValueChange={(value) => updateField("bathrooms", value)}
                          >
                            <SelectTrigger id="bathrooms" data-testid="select-bathrooms">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="balconies">Balconies</Label>
                          <Select
                            value={formData.balconies}
                            onValueChange={(value) => updateField("balconies", value)}
                          >
                            <SelectTrigger id="balconies" data-testid="select-balconies">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="font-semibold mb-4">Area Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">
                        {(formData.propertyType === "plot" || formData.propertyType === "joint_venture") ? "Plot Area" : "Carpet Area"} ({formData.areaUnit}){formData.propertyType === "pg_co_living" ? " (Optional)" : " *"}
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="1200"
                        value={formData.area}
                        onChange={(e) => updateField("area", e.target.value)}
                        data-testid="input-area"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="areaUnit">Measuring in</Label>
                      <Select
                        value={formData.areaUnit}
                        onValueChange={(value) => updateField("areaUnit", value)}
                      >
                        <SelectTrigger id="areaUnit" data-testid="select-area-unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEASUREMENT_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.propertyType !== "plot" && formData.propertyType !== "joint_venture" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="superBuiltUpArea">Super Built-up Area ({formData.areaUnit}) (Optional)</Label>
                        <Input
                          id="superBuiltUpArea"
                          type="number"
                          placeholder="e.g., 1400"
                          value={formData.superBuiltUpArea}
                          onChange={(e) => updateField("superBuiltUpArea", e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="carParkingCount">No. of car parking</Label>
                      <Select
                        value={formData.carParkingCount || "0"}
                        onValueChange={(value) => updateField("carParkingCount", value)}
                      >
                        <SelectTrigger id="carParkingCount">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                            <SelectItem value="6">6+</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceCharges">Maintenance charges (₹/month)</Label>
                      <Input
                        id="maintenanceCharges"
                        type="number"
                        placeholder="e.g., 3000"
                        value={formData.maintenanceCharges}
                        onChange={(e) => updateField("maintenanceCharges", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="viewType">View</Label>
                      <Select
                        value={formData.viewType}
                        onValueChange={(value) => updateField("viewType", value)}
                      >
                        <SelectTrigger id="viewType">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {VIEW_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.area && formData.price && (
                      <div className="space-y-2">
                        <Label>Price per {formData.areaUnit.toLowerCase()}</Label>
                        <p className="text-lg font-semibold text-primary py-2">
                          ₹{Math.round(parseInt(formData.price) / parseInt(formData.area)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {formData.propertyType !== "plot" && formData.propertyType !== "joint_venture" && (
                  <>
                    <Separator />

                    {formData.propertyType !== "farmhouse" && (
                      <div>
                        <h3 className="font-semibold mb-4">Floor & Facing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="floor">Floor Number</Label>
                            <Input
                              id="floor"
                              type="number"
                              placeholder="3"
                              value={formData.floor}
                              onChange={(e) => updateField("floor", e.target.value)}
                              data-testid="input-floor"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="totalFloors">Total Floors</Label>
                            <Input
                              id="totalFloors"
                              type="number"
                              placeholder="10"
                              value={formData.totalFloors}
                              onChange={(e) => updateField("totalFloors", e.target.value)}
                              data-testid="input-total-floors"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="facing">Facing</Label>
                            <Select
                              value={formData.facing}
                              onValueChange={(value) => updateField("facing", value)}
                            >
                              <SelectTrigger id="facing" data-testid="select-facing">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                                <SelectItem value="north-east">North-East</SelectItem>
                                <SelectItem value="north-west">North-West</SelectItem>
                                <SelectItem value="south-east">South-East</SelectItem>
                                <SelectItem value="south-west">South-West</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {(formData.propertyType === "apartment" || formData.propertyType === "new_projects") && formData.transactionType === "sale" && (
                      <div>
                        <h3 className="font-semibold mb-4">Building Details (Sale)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalFlats">Total Flats *</Label>
                            <Input
                              id="totalFlats"
                              type="number"
                              min={1}
                              placeholder="e.g., 24"
                              value={formData.totalFlats}
                              onChange={(e) => updateField("totalFlats", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Total flats in the building</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flatsOnFloor">Flats on the Floor *</Label>
                            <Input
                              id="flatsOnFloor"
                              type="number"
                              min={1}
                              placeholder="e.g., 2"
                              value={formData.flatsOnFloor}
                              onChange={(e) => updateField("flatsOnFloor", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Flats on the same floor</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="numberOfLifts">No. of lifts</Label>
                            <Input
                              id="numberOfLifts"
                              type="number"
                              min={0}
                              placeholder="e.g., 2"
                              value={formData.numberOfLifts}
                              onChange={(e) => updateField("numberOfLifts", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.propertyType === "villa" && (
                      <div>
                        <h3 className="font-semibold mb-4">Villa Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalVillas">Total Villas *</Label>
                            <Input
                              id="totalVillas"
                              type="number"
                              min={1}
                              placeholder="e.g., 12"
                              value={formData.totalVillas}
                              onChange={(e) => updateField("totalVillas", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Total villas in the complex</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalFloorsVilla">Total Floors *</Label>
                            <Input
                              id="totalFloorsVilla"
                              type="number"
                              min={1}
                              placeholder="e.g., 2"
                              value={formData.totalFloors}
                              onChange={(e) => updateField("totalFloors", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Number of floors in the villa</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="isCornerProperty">Corner Property *</Label>
                            <Select
                              value={formData.isCornerProperty || ""}
                              onValueChange={(value) => updateField("isCornerProperty", value)}
                            >
                              <SelectTrigger id="isCornerProperty">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roadWidthFeet">Width of road facing the Villa (ft)</Label>
                            <Input
                              id="roadWidthFeet"
                              type="number"
                              min={0}
                              placeholder="e.g., 30"
                              value={formData.roadWidthFeet}
                              onChange={(e) => updateField("roadWidthFeet", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="liftsAvailable">Lifts Available *</Label>
                            <Select
                              value={formData.liftsAvailable || ""}
                              onValueChange={(value) => updateField("liftsAvailable", value)}
                            >
                              <SelectTrigger id="liftsAvailable">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.propertyType === "independent_house" && (
                      <div>
                        <h3 className="font-semibold mb-4">Independent House Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalUnitsIH">Total Units *</Label>
                            <Input
                              id="totalUnitsIH"
                              type="number"
                              min={1}
                              placeholder="e.g., 1"
                              value={formData.totalVillas}
                              onChange={(e) => updateField("totalVillas", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Number of units</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalFloorsIH">Total Floors *</Label>
                            <Input
                              id="totalFloorsIH"
                              type="number"
                              min={1}
                              placeholder="e.g., 2"
                              value={formData.totalFloors}
                              onChange={(e) => updateField("totalFloors", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="isCornerPropertyIH">Corner Property *</Label>
                            <Select
                              value={formData.isCornerProperty || ""}
                              onValueChange={(value) => updateField("isCornerProperty", value)}
                            >
                              <SelectTrigger id="isCornerPropertyIH">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roadWidthFeetIH">Width of road (ft)</Label>
                            <Input
                              id="roadWidthFeetIH"
                              type="number"
                              min={0}
                              placeholder="e.g., 30"
                              value={formData.roadWidthFeet}
                              onChange={(e) => updateField("roadWidthFeet", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="liftsAvailableIH">Lifts Available *</Label>
                            <Select
                              value={formData.liftsAvailable || ""}
                              onValueChange={(value) => updateField("liftsAvailable", value)}
                            >
                              <SelectTrigger id="liftsAvailableIH">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {(formData.propertyType === "plot" || formData.propertyType === "joint_venture") && (
                      <div>
                        <h3 className="font-semibold mb-4">Plot Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plotLength">Plot Length *</Label>
                            <Input
                              id="plotLength"
                              type="number"
                              min={1}
                              placeholder="e.g., 50"
                              value={formData.plotLength}
                              onChange={(e) => updateField("plotLength", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">In meters or same as area unit</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plotBreadth">Plot Breadth *</Label>
                            <Input
                              id="plotBreadth"
                              type="number"
                              min={1}
                              placeholder="e.g., 30"
                              value={formData.plotBreadth}
                              onChange={(e) => updateField("plotBreadth", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="isCornerPlot">Is Corner Plot *</Label>
                            <Select
                              value={formData.isCornerPlot || ""}
                              onValueChange={(value) => updateField("isCornerPlot", value)}
                            >
                              <SelectTrigger id="isCornerPlot">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roadWidthPlotMeters">Width of Road Facing the Plot (m) *</Label>
                            <Input
                              id="roadWidthPlotMeters"
                              type="number"
                              min={0}
                              placeholder="e.g., 12"
                              value={formData.roadWidthPlotMeters}
                              onChange={(e) => updateField("roadWidthPlotMeters", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="clubHouseAvailable">Club House Available *</Label>
                            <Select
                              value={formData.clubHouseAvailable || ""}
                              onValueChange={(value) => updateField("clubHouseAvailable", value)}
                            >
                              <SelectTrigger id="clubHouseAvailable">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.transactionType === "sale" && (
                            <div className="space-y-2">
                              <Label htmlFor="floorAllowedConstruction">Floor allowed for Construction *</Label>
                              <Input
                                id="floorAllowedConstruction"
                                type="number"
                                min={0}
                                placeholder="e.g., 2"
                                value={formData.floorAllowedConstruction}
                                onChange={(e) => updateField("floorAllowedConstruction", e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.propertyType === "commercial" && (
                      <div>
                        <h3 className="font-semibold mb-4">Commercial Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="availableAreaCommercial">Available Area ({formData.areaUnit}) *</Label>
                            <Input
                              id="availableAreaCommercial"
                              type="number"
                              min={1}
                              placeholder="e.g., 2000"
                              value={formData.area}
                              onChange={(e) => updateField("area", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Area available for use</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="facingCommercial">Facing</Label>
                            <Select
                              value={formData.facing || ""}
                              onValueChange={(value) => updateField("facing", value)}
                            >
                              <SelectTrigger id="facingCommercial">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="north-east">North-East</SelectItem>
                                <SelectItem value="north-west">North-West</SelectItem>
                                <SelectItem value="south-east">South-East</SelectItem>
                                <SelectItem value="south-west">South-West</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roadWidthCommercial">Width of Road (ft)</Label>
                            <Input
                              id="roadWidthCommercial"
                              type="number"
                              min={0}
                              placeholder="e.g., 30"
                              value={formData.roadWidthFeet}
                              onChange={(e) => updateField("roadWidthFeet", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.propertyType === "farmhouse" && (
                      <div>
                        <h3 className="font-semibold mb-4">Farm Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="soilType">Soil Type *</Label>
                            <Select
                              value={formData.soilType || ""}
                              onValueChange={(value) => updateField("soilType", value)}
                            >
                              <SelectTrigger id="soilType">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="sandy">Sandy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fencing">Fencing *</Label>
                            <Select
                              value={formData.fencing || ""}
                              onValueChange={(value) => updateField("fencing", value)}
                            >
                              <SelectTrigger id="fencing">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waterSource">Water Source *</Label>
                            <Select
                              value={formData.waterSource || ""}
                              onValueChange={(value) => updateField("waterSource", value)}
                            >
                              <SelectTrigger id="waterSource">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="borewell">Borewell</SelectItem>
                                <SelectItem value="open_well">Open Well</SelectItem>
                                <SelectItem value="canal">Canal</SelectItem>
                                <SelectItem value="river">River</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="titleClear">Title Clear *</Label>
                            <Select
                              value={formData.titleClear || ""}
                              onValueChange={(value) => updateField("titleClear", value)}
                            >
                              <SelectTrigger id="titleClear">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="farmHouse">Farm House *</Label>
                            <Select
                              value={formData.farmHouse || ""}
                              onValueChange={(value) => updateField("farmHouse", value)}
                            >
                              <SelectTrigger id="farmHouse">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="approachRoadType">Approach Road Type</Label>
                            <Select
                              value={formData.approachRoadType || ""}
                              onValueChange={(value) => updateField("approachRoadType", value)}
                            >
                              <SelectTrigger id="approachRoadType">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mud">Mud</SelectItem>
                                <SelectItem value="tar">Tar</SelectItem>
                                <SelectItem value="concrete">Concrete</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roadWidthFeetFarm">Width of Road (ft)</Label>
                            <Input
                              id="roadWidthFeetFarm"
                              type="number"
                              min={0}
                              placeholder="e.g., 20"
                              value={formData.roadWidthFeet}
                              onChange={(e) => updateField("roadWidthFeet", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="distanceFromNearestTown">Distance from Nearest Town</Label>
                            <Input
                              id="distanceFromNearestTown"
                              placeholder="e.g., 5 km"
                              value={formData.distanceFromNearestTown}
                              onChange={(e) => updateField("distanceFromNearestTown", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="farmProjectName">Farm Project Name (Manage Farm Land)</Label>
                            <Input
                              id="farmProjectName"
                              placeholder="e.g., Green Valley Farms"
                              value={formData.farmProjectName}
                              onChange={(e) => updateField("farmProjectName", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.propertyType === "pg_co_living" && (
                      <div>
                        <h3 className="font-semibold mb-4">PG / Co-living Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="coLivingName">Co-Living Name *</Label>
                            <Input
                              id="coLivingName"
                              placeholder="e.g., StayEasy Co-living"
                              value={formData.coLivingName}
                              onChange={(e) => updateField("coLivingName", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgGender">Gender *</Label>
                            <Select
                              value={formData.pgGender || ""}
                              onValueChange={(value) => updateField("pgGender", value)}
                            >
                              <SelectTrigger id="pgGender">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {PG_GENDER_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgListedFor">Listed for *</Label>
                            <Select
                              value={formData.pgListedFor || ""}
                              onValueChange={(value) => updateField("pgListedFor", value)}
                            >
                              <SelectTrigger id="pgListedFor">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {PG_LISTED_FOR_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgRoomType">Room Type *</Label>
                            <Select
                              value={formData.pgRoomType || ""}
                              onValueChange={(value) => updateField("pgRoomType", value)}
                            >
                              <SelectTrigger id="pgRoomType">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {PG_ROOM_TYPE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgAvailableIn">Available In *</Label>
                            <Select
                              value={formData.pgAvailableIn || ""}
                              onValueChange={(value) => updateField("pgAvailableIn", value)}
                            >
                              <SelectTrigger id="pgAvailableIn">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {PG_AVAILABLE_IN_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="pgFurnishingDetails">Furnishing Details</Label>
                            <Textarea
                              id="pgFurnishingDetails"
                              placeholder="Describe furnishing..."
                              value={formData.pgFurnishingDetails}
                              onChange={(e) => updateField("pgFurnishingDetails", e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgAcAvailable">AC / Non-AC *</Label>
                            <Select
                              value={formData.pgAcAvailable || ""}
                              onValueChange={(value) => updateField("pgAcAvailable", value)}
                            >
                              <SelectTrigger id="pgAcAvailable">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgWashRoomType">Wash Room *</Label>
                            <Select
                              value={formData.pgWashRoomType || ""}
                              onValueChange={(value) => updateField("pgWashRoomType", value)}
                            >
                              <SelectTrigger id="pgWashRoomType">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Attached">Attached</SelectItem>
                                <SelectItem value="Common Bathroom">Common Bathroom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Facilities * (select at least one)</Label>
                            <div className="flex flex-wrap gap-2">
                              {PG_FACILITIES_LIST.map((facility) => (
                                <div key={facility} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`pg-fac-${facility}`}
                                    checked={formData.pgFacilities.includes(facility)}
                                    onCheckedChange={() => togglePgArray("pgFacilities", facility)}
                                  />
                                  <Label htmlFor={`pg-fac-${facility}`} className="text-sm font-normal cursor-pointer">{facility}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Rules * (select at least one)</Label>
                            <div className="flex flex-wrap gap-2">
                              {PG_RULES_LIST.map((rule) => (
                                <div key={rule} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`pg-rule-${rule}`}
                                    checked={formData.pgRules.includes(rule)}
                                    onCheckedChange={() => togglePgArray("pgRules", rule)}
                                  />
                                  <Label htmlFor={`pg-rule-${rule}`} className="text-sm font-normal cursor-pointer">{rule}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgCctv">CCTV Coverage</Label>
                            <Select
                              value={formData.pgCctv || ""}
                              onValueChange={(value) => updateField("pgCctv", value)}
                            >
                              <SelectTrigger id="pgCctv">
                                <SelectValue placeholder="Yes/No" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgBiometricEntry">Biometric Entry</Label>
                            <Select
                              value={formData.pgBiometricEntry || ""}
                              onValueChange={(value) => updateField("pgBiometricEntry", value)}
                            >
                              <SelectTrigger id="pgBiometricEntry">
                                <SelectValue placeholder="Yes/No" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgSecurityGuard">Security Guard</Label>
                            <Select
                              value={formData.pgSecurityGuard || ""}
                              onValueChange={(value) => updateField("pgSecurityGuard", value)}
                            >
                              <SelectTrigger id="pgSecurityGuard">
                                <SelectValue placeholder="Yes/No" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Services * (select at least one)</Label>
                            <div className="flex flex-wrap gap-2">
                              {PG_SERVICES_LIST.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`pg-svc-${service}`}
                                    checked={formData.pgServices.includes(service)}
                                    onCheckedChange={() => togglePgArray("pgServices", service)}
                                  />
                                  <Label htmlFor={`pg-svc-${service}`} className="text-sm font-normal cursor-pointer">{service}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgFoodProvided">Food Provided *</Label>
                            <Select
                              value={formData.pgFoodProvided || ""}
                              onValueChange={(value) => updateField("pgFoodProvided", value)}
                            >
                              <SelectTrigger id="pgFoodProvided">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgNonVegProvided">Non Veg Provided *</Label>
                            <Select
                              value={formData.pgNonVegProvided || ""}
                              onValueChange={(value) => updateField("pgNonVegProvided", value)}
                            >
                              <SelectTrigger id="pgNonVegProvided">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pgNoticePeriod">Notice Period *</Label>
                            <Select
                              value={formData.pgNoticePeriod || ""}
                              onValueChange={(value) => updateField("pgNoticePeriod", value)}
                            >
                              <SelectTrigger id="pgNoticePeriod">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {PG_NOTICE_PERIOD_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {((formData.propertyType === "apartment" || formData.propertyType === "new_projects") && (formData.transactionType === "rent" || formData.transactionType === "lease")) && (
                      <div>
                        <h3 className="font-semibold mb-4">
                          Building Details{formData.transactionType === "lease" ? "" : " (Optional)"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalFlatsRent">
                              Total Flats{formData.transactionType === "lease" ? " *" : ""}
                            </Label>
                            <Input
                              id="totalFlatsRent"
                              type="number"
                              min={1}
                              placeholder="e.g., 24"
                              value={formData.totalFlats}
                              onChange={(e) => updateField("totalFlats", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Total flats in the building</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flatsOnFloorRent">
                              Flats on the Floor{formData.transactionType === "lease" ? " *" : ""}
                            </Label>
                            <Input
                              id="flatsOnFloorRent"
                              type="number"
                              min={1}
                              placeholder="e.g., 2"
                              value={formData.flatsOnFloor}
                              onChange={(e) => updateField("flatsOnFloor", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Flats on the same floor</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="numberOfLiftsRent">No. of lifts</Label>
                            <Input
                              id="numberOfLiftsRent"
                              type="number"
                              min={0}
                              placeholder="e.g., 2"
                              value={formData.numberOfLifts}
                              onChange={(e) => updateField("numberOfLifts", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.propertyType !== "farmhouse" && (
                      <>
                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="furnishing">Furnishing</Label>
                            <Select
                              value={formData.furnishing}
                              onValueChange={(value) => updateField("furnishing", value)}
                            >
                              <SelectTrigger id="furnishing" data-testid="select-furnishing">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unfurnished">Unfurnished</SelectItem>
                                <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                                <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flooring">Flooring</Label>
                            <Select
                              value={formData.flooring || "none"}
                              onValueChange={(value) => updateField("flooring", value === "none" ? "" : value)}
                            >
                              <SelectTrigger id="flooring" data-testid="select-flooring">
                                <SelectValue placeholder="Select flooring" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {FLOORING_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ageOfProperty">Age of Property (years)</Label>
                            <Select
                              value={formData.ageOfProperty}
                              onValueChange={(value) => updateField("ageOfProperty", value)}
                            >
                              <SelectTrigger id="ageOfProperty" data-testid="select-age">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">New Construction</SelectItem>
                                <SelectItem value="1">Less than 1 year</SelectItem>
                                <SelectItem value="3">1-3 years</SelectItem>
                                <SelectItem value="5">3-5 years</SelectItem>
                                <SelectItem value="10">5-10 years</SelectItem>
                                <SelectItem value="15">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="possessionStatus">Possession Status</Label>
                            <Select
                              value={formData.possessionStatus}
                              onValueChange={(value) => updateField("possessionStatus", value)}
                            >
                              <SelectTrigger id="possessionStatus" data-testid="select-possession">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ready">Ready to Move</SelectItem>
                                <SelectItem value="under_construction">Under Construction</SelectItem>
                                <SelectItem value="upcoming">Upcoming Project</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(formData.possessionStatus === "under_construction" || formData.possessionStatus === "under-construction") && (
                            <div className="space-y-2">
                              <Label htmlFor="expectedPossessionDate">Expected Possession Date</Label>
                              <Input
                                id="expectedPossessionDate"
                                type="month"
                                value={formData.expectedPossessionDate}
                                onChange={(e) => updateField("expectedPossessionDate", e.target.value)}
                                data-testid="input-expected-possession-date"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                {formData.propertyType !== "farmhouse" && formData.propertyType !== "plot" && formData.propertyType !== "joint_venture" && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PROPERTY_AMENITIES.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={`amenity-${amenity}`}
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={() => toggleArrayItem("amenities", amenity)}
                              data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s/g, "-")}`}
                            />
                            <Label
                              htmlFor={`amenity-${amenity}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Highlights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HIGHLIGHTS_LIST.map((highlight) => (
                      <div key={highlight} className="flex items-center space-x-2">
                        <Checkbox
                          id={`highlight-${highlight}`}
                          checked={formData.highlights.includes(highlight)}
                          onCheckedChange={() => toggleArrayItem("highlights", highlight)}
                          data-testid={`checkbox-highlight-${highlight.toLowerCase().replace(/\s/g, "-")}`}
                        />
                        <Label
                          htmlFor={`highlight-${highlight}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {highlight}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
            </>
                )}
              </div>
            </Card>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-2">
                Upload Photos
              </h2>
              <p className="text-muted-foreground mb-6">
                Add high-quality photos to attract more buyers
              </p>

              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Upload Property Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    PNG, JPG up to 10MB each (max 20 photos)
                  </p>
                  <ObjectUploader
                    maxNumberOfFiles={5}
                    maxFileSize={10485760}
                    allowedFileTypes={["image/*"]}
                    onGetUploadParameters={async (file) => {
                      try {
                        const response = await apiRequest("POST", "/api/objects/upload");
                        if (!response.ok) {
                          const errorData = await response.json().catch(() => ({}));
                          throw new Error(errorData.error || "Failed to get upload URL");
                        }
                        const data = await response.json();
                        if (!data.uploadURL) {
                          throw new Error("Upload URL not received from server");
                        }
                        
                        // Store the final object URL in file metadata for later retrieval
                        // The signed URL format: https://storage.googleapis.com/bucket/path?signature
                        // After upload, the file will be at: https://storage.googleapis.com/bucket/path
                        let finalURL = data.url;
                        if (!finalURL && data.uploadURL) {
                          try {
                            const urlObj = new URL(data.uploadURL);
                            finalURL = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
                          } catch (e) {
                            console.warn("Could not parse upload URL:", e);
                            finalURL = data.uploadURL;
                          }
                        }
                        
                        // Store in file metadata for retrieval after upload completes
                        if (file && finalURL) {
                          file.meta = file.meta || {};
                          file.meta.finalURL = finalURL;
                          file.meta.uploadURL = finalURL; // Also store as uploadURL for compatibility
                        }
                        
                        return {
                          method: "PUT" as const,
                          url: data.uploadURL, // Signed URL for upload
                        };
                      } catch (error: any) {
                        console.error("Error getting upload parameters:", error);
                        throw new Error(error.message || "Failed to get upload URL. Please try again.");
                      }
                    }}
                    onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                      console.log("Upload complete result:", result);
                      
                      if (result.successful && result.successful.length > 0) {
                        const newPhotos = result.successful.map((file: any, index) => {
                          // Extract the final object URL from various possible locations
                          let uploadURL = "";
                          
                          // Priority order for URL extraction:
                          // 1. Direct url property
                          // 2. Response from upload (response.url or response.uploadURL)
                          // 3. File metadata (meta.finalURL or meta.uploadURL)
                          // 4. Direct file properties (uploadURL, source)
                          
                          if (file.url) {
                            uploadURL = file.url;
                          } else if (file.response?.url) {
                            uploadURL = file.response.url;
                          } else if (file.response?.uploadURL) {
                            uploadURL = file.response.uploadURL;
                          } else if (file.meta?.finalURL) {
                            uploadURL = file.meta.finalURL;
                          } else if (file.meta?.uploadURL) {
                            uploadURL = file.meta.uploadURL;
                          } else if (file.uploadURL) {
                            uploadURL = file.uploadURL;
                          } else if (file.source) {
                            uploadURL = file.source;
                          }
                          
                          // If URL is relative, make it absolute
                          if (uploadURL && uploadURL.startsWith("/") && !uploadURL.startsWith("//")) {
                            uploadURL = `${window.location.origin}${uploadURL}`;
                          }
                          
                          console.log("Uploaded file:", file.name, "Extracted URL:", uploadURL);
                          
                          return {
                            url: uploadURL,
                            caption: "",
                            isPrimary: formData.photos.length === 0 && index === 0,
                          };
                        }).filter((photo) => photo.url && photo.url.trim() !== ""); // Filter out any photos without URLs
                        
                        console.log("New photos to add:", newPhotos);
                        console.log("Current photos:", formData.photos);
                        
                        if (newPhotos.length > 0) {
                          // Only set first new photo as primary if no photos exist yet
                          if (formData.photos.length === 0) {
                            newPhotos[0].isPrimary = true;
                            // Make sure other new photos are not primary
                            for (let i = 1; i < newPhotos.length; i++) {
                              newPhotos[i].isPrimary = false;
                            }
                          } else {
                            // If photos already exist, new photos should not be primary
                            newPhotos.forEach(photo => photo.isPrimary = false);
                          }
                          
                          const updatedPhotos = [...formData.photos, ...newPhotos];
                          // Ensure primary photo is first
                          updatedPhotos.sort((a, b) => {
                            if (a.isPrimary) return -1;
                            if (b.isPrimary) return 1;
                            return 0;
                          });
                          
                          console.log("Updated photos array:", updatedPhotos);
                          updateField("photos", updatedPhotos as unknown as string[]);
                          toast({
                            title: "Photos uploaded",
                            description: `Successfully uploaded ${newPhotos.length} photo(s). They will appear below.`,
                          });
                        } else {
                          console.error("No valid URLs extracted from uploaded files:", result.successful);
                          toast({
                            title: "Upload issue",
                            description: "Photos were uploaded but URLs could not be extracted. Please try uploading again or contact support.",
                            variant: "destructive",
                            duration: 10000,
                          });
                        }
                      }
                      if (result.failed && result.failed.length > 0) {
                        const errorMessages = result.failed.map((file: any) => {
                          const error = file.error?.message || file.error?.message || file.error?.toString() || file.error || "Unknown error";
                          return `${file.name || "File"}: ${error}`;
                        }).join(", ");
                        
                        console.error("Failed uploads details:", result.failed);
                        
                        toast({
                          title: "Some uploads failed",
                          description: `${result.failed.length} photo(s) failed to upload. ${errorMessages}`,
                          variant: "destructive",
                          duration: 10000, // Show for 10 seconds to read the error
                        });
                      }
                    }}
                    buttonVariant="default"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Photos
                  </ObjectUploader>
                </div>

                {formData.photos && formData.photos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Uploaded Photos ({formData.photos.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo: any, index: number) => {
                        // Handle both object format {url: "...", caption: "..."} and string format
                        const photoUrl = typeof photo === 'string' ? photo : (photo?.url || photo);
                        const photoCaption = typeof photo === 'object' && photo?.caption ? photo.caption : `Photo ${index + 1}`;
                        
                        if (!photoUrl) {
                          console.warn("Photo at index", index, "has no URL:", photo);
                          return null;
                        }
                        
                        return (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg border overflow-hidden group bg-muted"
                          >
                            <img
                              src={photoUrl}
                              alt={photoCaption}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Failed to load image:", photoUrl);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show error placeholder
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex items-center justify-center h-full text-muted-foreground text-xs">
                                      <div class="text-center">
                                        <ImageIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>Failed to load</p>
                                      </div>
                                    </div>
                                  `;
                                }
                              }}
                            />
                            {/* Action buttons - shown on hover */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {/* Set as Cover button - show if not already cover */}
                              {!(typeof photo === 'object' && photo?.isPrimary) && (
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
                                  onClick={() => {
                                    const updated = [...formData.photos];
                                    const photoToMove = updated[index];
                                    // Remove from current position
                                    updated.splice(index, 1);
                                    // Move to front and set as primary
                                    updated.unshift({
                                      ...photoToMove,
                                      isPrimary: true,
                                    });
                                    // Update all other photos to not be primary
                                    updated.forEach((photo, i) => {
                                      if (i > 0) {
                                        photo.isPrimary = false;
                                      }
                                    });
                                    updateField("photos", updated);
                                    toast({
                                      title: "Cover photo updated",
                                      description: "This photo is now set as the cover photo.",
                                    });
                                  }}
                                  data-testid={`button-set-cover-${index}`}
                                  title="Set as cover photo"
                                >
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                </Button>
                              )}
                              {/* Remove button */}
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 bg-background/90 backdrop-blur-sm"
                                onClick={() => {
                                  const photoToRemove = formData.photos[index];
                                  const isPrimary = typeof photoToRemove === 'object' && photoToRemove?.isPrimary;
                                  const updated = formData.photos.filter((_: any, i: number) => i !== index);
                                  
                                  // If we removed the primary photo, set the first remaining photo as primary
                                  if (isPrimary && updated.length > 0) {
                                    updated[0] = {
                                      ...updated[0],
                                      isPrimary: true,
                                    };
                                  }
                                  
                                  updateField("photos", updated);
                                  toast({
                                    title: "Photo removed",
                                    description: updated.length > 0 
                                      ? "Photo has been removed from your listing." 
                                      : "Photo removed. Add more photos to showcase your property.",
                                  });
                                }}
                                data-testid={`button-remove-photo-${index}`}
                                title="Remove photo"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {/* Cover Photo Badge */}
                            {(index === 0 || (typeof photo === 'object' && photo?.isPrimary)) && (
                              <div className="absolute bottom-2 left-2 z-10">
                                <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Cover Photo
                                </Badge>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Alert>
                  <ImageIcon className="h-4 w-4" />
                  <AlertTitle>Photo Tips</AlertTitle>
                  <AlertDescription>
                    Include photos of all rooms, kitchen, bathrooms, and outdoor areas.
                    Good lighting and multiple angles help attract more buyers.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8">
                  <h2 className="font-serif font-bold text-xl mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        placeholder="Your name"
                        value={formData.contactName}
                        onChange={(e) => updateField("contactName", e.target.value)}
                        data-testid="input-contact-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <PhoneInput
                        value={cleanPhone(formData.contactPhone)}
                        onValueChange={(v) => updateField("contactPhone", v)}
                        data-testid="input-contact-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        data-testid="input-contact-email"
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="verifiedInfo"
                          checked={formData.verifiedInfo}
                          onCheckedChange={(checked) => updateField("verifiedInfo", !!checked)}
                          data-testid="checkbox-verified"
                        />
                        <Label htmlFor="verifiedInfo" className="text-sm font-normal cursor-pointer">
                          I verify that all the information provided is accurate and true
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => updateField("agreedToTerms", !!checked)}
                          data-testid="checkbox-terms"
                        />
                        <Label htmlFor="agreedToTerms" className="text-sm font-normal cursor-pointer">
                          I agree to the Terms & Conditions and Privacy Policy
                        </Label>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h3 className="font-semibold mb-4">Property Preview</h3>

                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {formData.photos.length > 0 ? (
                        <img
                          src={formData.photos[0].url}
                          alt="Cover"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No photos yet</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <h4 className="font-semibold line-clamp-2">
                          {formData.title || "Property Title"}
                        </h4>
                        <Badge>{formData.transactionType === "rent" ? "For Rent" : formData.transactionType === "lease" ? "For Lease" : "For Sale"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {formData.locality ? `${formData.locality}, ` : ""}{formData.city || "City"}, {formData.state || "State"}
                        </span>
                      </div>
                      <p className="text-2xl font-bold font-serif text-primary mb-4">
                        {formData.price ? formatPrice(formData.price) : "₹0"}
                        {formData.transactionType === "rent" && <span className="text-sm font-normal">/month</span>}
                      </p>
                    </div>

                    <Separator />

                    {formData.propertyType !== "plot" && formData.propertyType !== "joint_venture" && (
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.bedrooms || "-"}</span>
                          <span className="text-xs text-muted-foreground">Beds</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.bathrooms || "-"}</span>
                          <span className="text-xs text-muted-foreground">Baths</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.area || "-"}</span>
                          <span className="text-xs text-muted-foreground">{formData.areaUnit || "Sq-ft"}</span>
                        </div>
                      </div>
                    )}

                    {formData.amenities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {formData.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{formData.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <p className="text-sm font-medium mb-2">Contact:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{formData.contactPhone || "Phone number"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{formData.contactEmail || "Email"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep === 1 ? (
              <Button
                variant="outline"
                onClick={() => navigate((isAdmin || isAdminRoute) ? "/admin/dashboard" : "/seller/dashboard")}
                data-testid="button-cancel"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < 4 ? (
              <Button onClick={handleNext} data-testid="button-next">
                Next: {STEPS[currentStep]?.title}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={(isEditMode ? updatePropertyMutation.isPending : createPropertyMutation.isPending) || !formData.agreedToTerms || !formData.verifiedInfo}
                data-testid="button-submit"
              >
                {(isEditMode ? updatePropertyMutation.isPending : createPropertyMutation.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? "Update Property" : "Add Property"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
  );
}
