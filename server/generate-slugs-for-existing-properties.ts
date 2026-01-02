/**
 * Script to generate slugs for existing properties that don't have one
 * Run this after adding the slug column to the database
 * 
 * Usage: tsx server/generate-slugs-for-existing-properties.ts
 */

import { db, pool } from "./db";
import { properties } from "@shared/schema";
import { isNull, sql } from "drizzle-orm";
import { generatePropertySlug } from "@shared/utils";

async function generateSlugsForExistingProperties() {
  console.log("Starting slug generation for existing properties...");

  try {
    // Get all properties without slugs
    const propertiesWithoutSlugs = await pool.query(
      `SELECT id, title, city FROM properties WHERE slug IS NULL`
    );

    console.log(`Found ${propertiesWithoutSlugs.rows.length} properties without slugs`);

    let successCount = 0;
    let errorCount = 0;

    for (const property of propertiesWithoutSlugs.rows) {
      try {
        const { id, title, city } = property;
        
        if (!title) {
          console.warn(`Skipping property ${id} - no title`);
          errorCount++;
          continue;
        }

        // Generate base slug
        let slug = generatePropertySlug(title, city || undefined, id);
        
        // Ensure uniqueness
        let uniqueSlug = slug;
        let counter = 1;
        
        // Check if slug already exists
        while (true) {
          const existing = await pool.query(
            `SELECT id FROM properties WHERE slug = $1 AND id != $2 LIMIT 1`,
            [uniqueSlug, id]
          );
          
          if (existing.rows.length === 0) {
            break; // Slug is unique
          }
          
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        }

        // Update the property with the generated slug
        await pool.query(
          `UPDATE properties SET slug = $1 WHERE id = $2`,
          [uniqueSlug, id]
        );

        successCount++;
        
        if (successCount % 100 === 0) {
          console.log(`Processed ${successCount} properties...`);
        }
      } catch (error) {
        console.error(`Error generating slug for property ${property.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n✅ Slug generation complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${propertiesWithoutSlugs.rows.length}`);
  } catch (error) {
    console.error("Error generating slugs:", error);
    process.exit(1);
  }
  
  // Note: pool connections are managed automatically, no need to close
  process.exit(0);
}

// Run the script
generateSlugsForExistingProperties();

