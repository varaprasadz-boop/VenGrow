import { db } from "./db";
import { properties, propertyCustomData, formTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function migrateExistingPropertyData() {
  console.log("[Migration] Checking if property data migration is needed...");

  const existingCustomData = await db.select({ id: propertyCustomData.id }).from(propertyCustomData).limit(1);
  if (existingCustomData.length > 0) {
    console.log("[Migration] Property custom data already exists, skipping migration.");
    return;
  }

  const allProperties = await db.select().from(properties);
  if (allProperties.length === 0) {
    console.log("[Migration] No properties to migrate.");
    return;
  }

  const publishedTemplates = await db.select().from(formTemplates).where(eq(formTemplates.status, "published"));

  const templateMap: Record<string, string> = {};
  for (const t of publishedTemplates) {
    if (t.sellerType && !templateMap[t.sellerType]) {
      templateMap[t.sellerType] = t.id;
    }
  }

  const defaultTemplateId = publishedTemplates[0]?.id;
  if (!defaultTemplateId) {
    console.log("[Migration] No published form templates found, skipping migration.");
    return;
  }

  let migrated = 0;
  for (const prop of allProperties) {
    const formData: Record<string, unknown> = {};

    if (prop.bedrooms) formData.bedrooms = prop.bedrooms;
    if (prop.bathrooms) formData.bathrooms = prop.bathrooms;
    if ((prop as any).balconies) formData.balconies = (prop as any).balconies;
    if (prop.facing) formData.facing = prop.facing;
    if (prop.floor) formData.floor = prop.floor;
    if (prop.totalFloors) formData.totalFloors = prop.totalFloors;
    if ((prop as any).furnishing) formData.furnishing = (prop as any).furnishing;
    if ((prop as any).flooring) formData.flooring = (prop as any).flooring;
    if (prop.ageOfProperty) formData.ageOfProperty = prop.ageOfProperty;
    if (prop.possessionStatus) formData.possessionStatus = prop.possessionStatus;
    if (prop.amenities && Array.isArray(prop.amenities) && (prop.amenities as string[]).length > 0) {
      formData.amenities = prop.amenities;
    }
    if ((prop as any).superBuiltUpArea) formData.superBuiltUpArea = (prop as any).superBuiltUpArea;
    if ((prop as any).carpetArea) formData.carpetArea = (prop as any).carpetArea;
    if ((prop as any).maintenanceCharges) formData.maintenanceCharges = (prop as any).maintenanceCharges;
    if ((prop as any).carParkingCount) formData.carParkingCount = (prop as any).carParkingCount;

    if (Object.keys(formData).length === 0) continue;

    const sellerType = (prop as any).sellerType || "individual";
    const templateId = templateMap[sellerType] || defaultTemplateId;

    try {
      await db.insert(propertyCustomData).values({
        propertyId: prop.id,
        formTemplateId: templateId,
        formData,
      } as any);
      migrated++;
    } catch (e: any) {
      if (e.code === '23505') continue;
      console.error(`[Migration] Failed to migrate property ${prop.id}:`, e.message);
    }
  }

  console.log(`[Migration] Migrated ${migrated} properties to property_custom_data.`);
}
