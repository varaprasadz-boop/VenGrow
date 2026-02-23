import { storage } from "./storage";

export async function seedFormTemplates() {
  console.log("Checking for existing form templates...");

  const existing = await storage.getFormTemplates();
  if (existing.length > 0) {
    console.log(`Found ${existing.length} form templates, skipping seed.`);
    return;
  }

  console.log("No form templates found. Seeding default templates...");

  const sellerTypes = ["individual", "broker", "builder"] as const;

  for (const sellerType of sellerTypes) {
    const templateName = `${sellerType.charAt(0).toUpperCase() + sellerType.slice(1)} Property Listing Form`;

    const template = await storage.createFormTemplate({
      name: templateName,
      sellerType,
      version: 1,
      status: "published",
      showPreviewBeforeSubmit: true,
      allowSaveDraft: true,
      autoApproval: false,
      termsText: "I agree to the Terms of Service and Privacy Policy. I confirm that the information provided is accurate.",
    });

    const basicInfoSection = await storage.createFormSection({
      formTemplateId: template.id,
      stage: 1,
      name: "Basic Info",
      icon: "FileText",
      sortOrder: 0,
      showInFilters: false,
      isDefault: true,
      isActive: true,
    });

    const stage1Fields = [
      { label: "Transaction Type", fieldKey: "transaction_type", fieldType: "radio" as const, icon: "ArrowRightLeft", isRequired: true, isDefault: true, sortOrder: 0, options: ["Sale", "Rent", "Lease"] },
      { label: "Category", fieldKey: "category", fieldType: "dropdown" as const, icon: "Grid3x3", isRequired: true, isDefault: true, sortOrder: 1, sourceType: "category_master" },
      { label: "Subcategory", fieldKey: "subcategory", fieldType: "dropdown" as const, icon: "List", isRequired: true, isDefault: true, sortOrder: 2, sourceType: "linked_to_parent", linkedFieldKey: "category" },
      { label: "Property Title", fieldKey: "property_title", fieldType: "text" as const, icon: "Type", isRequired: true, isDefault: true, sortOrder: 3, validationRules: { charLimit: 100 } },
      { label: "Description", fieldKey: "description", fieldType: "textarea" as const, icon: "FileText", isRequired: true, isDefault: true, sortOrder: 4 },
      { label: "Project/Society Name", fieldKey: "project_society_name", fieldType: "alphanumeric" as const, icon: "Building2", isRequired: false, isDefault: true, sortOrder: 5 },
      { label: "State", fieldKey: "state", fieldType: "dropdown" as const, icon: "MapPin", isRequired: true, isDefault: true, sortOrder: 6, sourceType: "state_master" },
      { label: "City", fieldKey: "city", fieldType: "dropdown" as const, icon: "MapPin", isRequired: true, isDefault: true, sortOrder: 7, sourceType: "linked_to_parent", linkedFieldKey: "state" },
      { label: "Locality", fieldKey: "locality", fieldType: "text" as const, icon: "MapPin", isRequired: true, isDefault: true, sortOrder: 8 },
      { label: "Area in Locality", fieldKey: "area_in_locality", fieldType: "text" as const, icon: "MapPin", isRequired: false, isDefault: true, sortOrder: 9 },
      { label: "Nearby Landmark", fieldKey: "nearby_landmark", fieldType: "text" as const, icon: "MapPin", isRequired: false, isDefault: true, sortOrder: 10 },
      { label: "PIN Code", fieldKey: "pin_code", fieldType: "numeric" as const, icon: "Hash", isRequired: false, isDefault: true, sortOrder: 11 },
      { label: "Price", fieldKey: "price", fieldType: "numeric" as const, icon: "IndianRupee", isRequired: true, isDefault: true, sortOrder: 12 },
      { label: "Area", fieldKey: "area", fieldType: "numeric" as const, icon: "Ruler", isRequired: true, isDefault: true, sortOrder: 13 },
      { label: "Area Unit", fieldKey: "area_unit", fieldType: "dropdown" as const, icon: "Ruler", isRequired: true, isDefault: true, sortOrder: 14, options: ["Sq.ft", "Sq.yd", "Sq.m", "Acres", "Hectares", "Cents", "Grounds", "Bigha", "Kanal", "Marla", "Gunta", "Biswa"] },
    ];

    for (const field of stage1Fields) {
      await storage.createFormField({
        sectionId: basicInfoSection.id,
        label: field.label,
        fieldKey: field.fieldKey,
        fieldType: field.fieldType,
        icon: field.icon,
        isRequired: field.isRequired,
        isDefault: field.isDefault,
        sortOrder: field.sortOrder,
        options: field.options || null,
        sourceType: field.sourceType || null,
        linkedFieldKey: field.linkedFieldKey || null,
        validationRules: field.validationRules || null,
        displayStyle: "default",
        isActive: true,
      } as any);
    }

    const propertyDetailsSection = await storage.createFormSection({
      formTemplateId: template.id,
      stage: 2,
      name: "Property Details",
      icon: "Home",
      sortOrder: 0,
      showInFilters: true,
      isDefault: false,
      isActive: true,
    });

    const stage2PropertyFields = [
      { label: "BHK/Bedrooms", fieldKey: "bhk_bedrooms", fieldType: "dropdown" as const, icon: "Bed", sortOrder: 0, options: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"] },
      { label: "Bathrooms", fieldKey: "bathrooms", fieldType: "dropdown" as const, icon: "Bath", sortOrder: 1, options: ["1", "2", "3", "4", "5+"] },
      { label: "Balconies", fieldKey: "balconies", fieldType: "dropdown" as const, icon: "DoorOpen", sortOrder: 2, options: ["0", "1", "2", "3", "4+"] },
      { label: "Facing", fieldKey: "facing", fieldType: "dropdown" as const, icon: "Compass", sortOrder: 3, options: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"] },
      { label: "Floor", fieldKey: "floor", fieldType: "numeric" as const, icon: "Building", sortOrder: 4 },
      { label: "Total Floors", fieldKey: "total_floors", fieldType: "numeric" as const, icon: "Building", sortOrder: 5 },
      { label: "Furnishing", fieldKey: "furnishing", fieldType: "dropdown" as const, icon: "Armchair", sortOrder: 6, options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"] },
      { label: "Flooring", fieldKey: "flooring", fieldType: "dropdown" as const, icon: "Grid3x3", sortOrder: 7, options: ["Marble", "Vitrified", "Wooden", "Granite", "Mosaic", "Cement", "Others"] },
      { label: "Age of Property", fieldKey: "age_of_property", fieldType: "dropdown" as const, icon: "Clock", sortOrder: 8, options: ["New Construction", "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"] },
      { label: "Possession Status", fieldKey: "possession_status", fieldType: "dropdown" as const, icon: "Key", sortOrder: 9, options: ["Ready to Move", "Under Construction"] },
    ];

    for (const field of stage2PropertyFields) {
      await storage.createFormField({
        sectionId: propertyDetailsSection.id,
        label: field.label,
        fieldKey: field.fieldKey,
        fieldType: field.fieldType,
        icon: field.icon,
        isRequired: false,
        isDefault: false,
        sortOrder: field.sortOrder,
        options: field.options || null,
        displayStyle: "grid",
        isActive: true,
      } as any);
    }

    const amenitiesSection = await storage.createFormSection({
      formTemplateId: template.id,
      stage: 2,
      name: "Amenities",
      icon: "Star",
      sortOrder: 1,
      showInFilters: true,
      isDefault: false,
      isActive: true,
    });

    await storage.createFormField({
      sectionId: amenitiesSection.id,
      label: "Amenities",
      fieldKey: "amenities",
      fieldType: "checkbox",
      icon: "Star",
      isRequired: false,
      isDefault: false,
      sortOrder: 0,
      options: [
        "Swimming Pool", "Gymnasium", "Club House", "Park", "Power Back Up",
        "Lift", "Security", "Reserved Parking", "Visitor Parking",
        "Rain Water Harvesting", "Intercom Facility", "Internet/Wi-Fi",
        "Piped Gas", "Jogging Track", "Air Conditioned", "Maintenance Staff",
        "Waste Disposal", "Water Storage", "Fire Safety", "CCTV",
        "Smart Home", "Vaastu Compliant",
      ],
      displayStyle: "checklist",
      isActive: true,
    } as any);

    const mediaSection = await storage.createFormSection({
      formTemplateId: template.id,
      stage: 3,
      name: "Media Upload",
      icon: "Camera",
      sortOrder: 0,
      showInFilters: false,
      isDefault: true,
      isActive: true,
    });

    await storage.createFormField({
      sectionId: mediaSection.id,
      label: "Property Images",
      fieldKey: "property_images",
      fieldType: "file_upload",
      icon: "Image",
      isRequired: true,
      isDefault: true,
      sortOrder: 0,
      fileConfig: { maxFiles: 20, maxSizeMB: 5, allowedTypes: ["image/jpeg", "image/png", "image/webp"] },
      displayStyle: "default",
      isActive: true,
    } as any);

    await storage.createFormField({
      sectionId: mediaSection.id,
      label: "YouTube Video URL",
      fieldKey: "youtube_video_url",
      fieldType: "text",
      icon: "Video",
      isRequired: false,
      isDefault: true,
      sortOrder: 1,
      placeholder: "https://www.youtube.com/watch?v=...",
      displayStyle: "default",
      isActive: true,
    } as any);

    console.log(`Created form template for seller type: ${sellerType} (id: ${template.id})`);
  }

  console.log("Form template seeding completed successfully!");
}
