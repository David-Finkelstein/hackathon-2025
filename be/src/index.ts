import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  MediaResolution,
  Type,
} from "@google/genai";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";

// TypeScript interfaces for damage assessment
interface DamageItem {
  itemName: string;
  condition: 'missing' | 'damaged' | 'broken';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface RoomAssessment {
  room: string;
  damageDetected: boolean;
  items: DamageItem[];
  notes?: string;
}

interface ItemToCheck {
  room: string;
  item: string;
}

interface FinalSummary {
  overallStatus: 'all_clear' | 'minor_issues' | 'major_concerns';
  summary: string;
  itemsToCheck: ItemToCheck[];
  totalIssuesFound: number;
}

interface CompareResponse {
  summary: FinalSummary;
  roomAssessments: RoomAssessment[];
}

const GEMINI_INSPECTION_MODEL = "gemini-3-pro-preview";
const GEMINI_SUMMARY_MODEL = "gemini-2.5-flash";
const PORT = process.env.PORT || 3000;
const PREVIOUS_KITCHEN_FILENAME = "files/ogk0546aag6u";
const PREVIOUS_BATHROOM_FILENAME = "files/o640dppxs8a0";
const PREVIOUS_LIVING_ROOM_FILENAME = "files/ieya8nw8hjvn";
const PREVIOUS_BEDROOM_FILENAME = "files/5x2lxy2d0vhs";

// Mock room inventories (to be replaced with actual inventories later)
const ROOM_INVENTORIES: Record<string, string> = {
  Kitchen: `Large Appliances & Furniture
* 1 Double-Door Commercial Refrigerator: Large black-frame unit with glass doors.
* 1 Standard Oven/Range: Integrated into the lower black cabinetry.
* Black Cabinetry System: Includes multiple large drawers with silver horizontal handles.
* White Countertops: L-shaped preparation surface.
Small Appliances (High Theft Risk)
* 1 Professional Espresso/Coffee Machine: Large black unit on the far left.
* 1 Mini Milk/Beverage Fridge: Small black countertop unit with a glass door.
* 1 Water Bar dispenser: Located to the right of the milk dispenser.
* 1 Microwave: Silver unit on the far right of the counter.
* 1 Electric Milk Frother: Small black unit next to the toaster.
* 1 Panini Press/Griddle: Small black appliance near the kettle.
Fixtures & Safety Equipment
* 1 Fire Extinguisher: Red canister located on the floor between the cabinets and the refrigerator.
* 2 Floating Wooden Shelves: Mounted on the wall above the main counter.
* Track Lighting System: Black ceiling-mounted rail with three adjustable spotlights.
* 1 Built-in Sink: Stainless steel or white basin integrated into the left counter.
* Wall Fixtures: Multiple electrical outlets and switches visible on the white tiled backsplash.
Decor & Non-Food Items
* Glass Containers/Jars: Several empty glass storage jars on the shelves and counter.
* Herringbone Wood Flooring: Light-colored patterned wooden floor.`,
  
  Bathroom: `Fixtures & Furniture
* 3 Sinks: Large, white rectangular vessel sinks wall-mounted in a row.
* 3 Faucets: Silver, wall-mounted industrial-style taps.
* 3 Mirrors: Round mirrors with thin gold/brass frames.
* 3 Wall Lights: Black gooseneck fixtures with large exposed round bulbs.
* 1 Paper Towel Dispenser: White plastic unit mounted on the far wall.
* 1 Wicker Basket: Located in the bottom left foreground, sitting on a black counter.
* 3 Counter Sections: Black floating surfaces between the sinks used for holding decor and soap.
Decor & Amenities
* 2 Potted Plants: Small artificial greenery in black pots located between the sinks.
* 3 Soap Bottles: Large amber glass/plastic bottles with pump dispensers.
* 1 Metal Canister: A white/silver pressurized canister (likely air freshener or specialized soap) next to the first plant.`,
  
  'Living Room': `Electronics & Technology (High Theft Risk)
* 1 Large Flat-Screen TV: Wall-mounted with visible cables.
* 1 Video Conferencing Bar/Camera: Black unit mounted directly above the TV.
* 1 Tablet: Mounted on a charging stand on the left side of the wooden console, connected via a white cable.
* 1 Air Conditioning Unit: White wall-mounted unit located at the top of the frame.
Furniture & Large Assets
* 1 Wooden Media Console: Mid-century style with two drawers and three open shelving compartments.
* 2 Leather/Vinyl Armchairs: Brown, modern bucket-style seats with thin black metal legs.
* 1 Large Potted Fiddle Leaf Fig: Located in the corner by the window in a terracotta-style pot.
* 1 Area Rug: Dark, textured/mottled grey and black low-pile carpet.
Decor & Small Items
* 1 Blue House-Shaped Sculpture: Large decorative "Home" logo sitting on the console.
* 1 QR Code/Information Stand: Small wooden base with a printed card, located next to the tablet.
* 1 Wall Sconce/Light: Industrial black fixture with an exposed round bulb above the window.
* 1 Window Blind/Shade: White horizontal slatted blind.
* Books/Media: Visible items stored within the open compartments of the wooden console.
Structural Features
* 1 Large Window: Offering a city view, with black frames.
* White Painted Walls: Large surface area behind the TV and console.
* Power Outlets: Two white electrical sockets visible on the wall between the console and the plant.`,
  
  Bedroom: `Furniture & Large Assets
* 1 Pink Loveseat/Sofa: Mid-century style with light wood legs.
* 2 Armchairs: One light grey (right) and one dark grey (left).
* 1 Wooden Coffee Table: Round, light-colored wood.
* 1 Side Table: Small round wooden table (left, holding a plant).
* 1 Large Geometric Bookshelf: White honeycomb/diamond pattern shelving unit built into the wall.
* 1 Area Rug: Dark blue/grey textured rug under the seating area.
Decor & Small Items (High Theft/Damage Risk)
* 4 Throw Pillows: All on the pink sofa. Three have "Guesty Nights" branding; one has a green geometric pattern.
* 2 Accent Cushions: One teal (on the left chair) and one light blue with yellow detail (on the right chair).
* 8+ Trophies/Awards: Various glass and acrylic awards displayed within the geometric shelf units.
* 1 Large Glass Vase: On the coffee table, containing green foliage.
* 1 Glass Cup/Mug: On the coffee table, containing a yellow liquid (likely tea).
* 4+ Small Vases/Bottles: Clear glass decorative bottles placed inside the shelf units.
Greenery & Structure
* 4 Potted Plants: * 1 Large floor plant (left).
    * 1 Medium plant on the side table (left).
    * 1 Snake plant (Sansevieria) in a pot on the floor (right of the sofa).
    * 1 Small plant on top of the shelf unit.
* Structural Features: 1 Concrete-finish pillar (left) and light wood laminate flooring throughout.`
};

// Load environment variables from .env file
dotenv.config();

/**
 * Create advanced damage assessment prompt with chain-of-thought strategy
 */
function createDamageAssessmentPrompt(roomName: string, inventory: string): string {
  return `You are inspecting a ${roomName} for property damage after guest checkout.

**REFERENCE INVENTORY:**
${inventory}

**YOUR TASK:**
Compare the PREVIOUS image (pre-check-in baseline) with the CURRENT image (post-checkout).

**ANALYSIS PROTOCOL:**

Step 1 - SYSTEMATIC SCAN:
- Divide the room mentally into a 3x3 grid
- Scan from left to right, top to bottom
- For each grid section, compare previous vs current images

Step 2 - INVENTORY VERIFICATION:
- Go through each item in the reference inventory above
- Check if the item is visible and intact in BOTH images
- Note if an item appears damaged or missing in the CURRENT image only

Step 3 - DAMAGE IDENTIFICATION:
Focus ONLY on physical damage or absence:
- Missing items that were present before
- Broken/cracked items (glass, mirrors, furniture)
- Stains or damage to surfaces (walls, floors, counters)
- Damaged fixtures (doors, handles, faucets)

IGNORE: Clutter, mess, displaced items, lighting differences, slight movements

Step 4 - SEVERITY ASSESSMENT:
- LOW: Minor scuffs, easily cleanable marks
- MEDIUM: Noticeable damage requiring repair/replacement
- HIGH: Significant structural damage or missing expensive items

**OUTPUT FORMAT:**
Respond with a JSON object following this exact schema:
{
  "damageDetected": boolean,
  "items": [
    {
      "itemName": "specific item name",
      "condition": "missing" | "damaged" | "broken",
      "description": "brief specific description of the issue",
      "severity": "low" | "medium" | "high"
    }
  ],
  "notes": "any additional context (optional)"
}

If no damage detected, return: {"damageDetected": false, "items": [], "notes": "No damage or missing items detected"}`;
}

/**
 * Create summary prompt for final assessment
 */
function createSummaryPrompt(assessments: RoomAssessment[]): string {
  return `Analyze these room damage assessments and create a concise summary:

${JSON.stringify(assessments, null, 2)}

Provide a JSON response with this schema:
{
  "overallStatus": "all_clear" | "minor_issues" | "major_concerns",
  "summary": "A 1-2 line description of the overall property condition",
  "itemsToCheck": [
    {
      "room": "Room Name",
      "item": "specific item description"
    }
  ],
  "totalIssuesFound": number
}

Rules:
- "all_clear": No damage in any room
- "minor_issues": Only low severity items
- "major_concerns": Any medium/high severity items
- "summary": Write 1-2 sentences describing the overall condition (e.g., "Property is in excellent condition with no damage detected" or "Minor issues found requiring attention before next guest")
- "itemsToCheck": List only actionable items with their room names that require attention or verification
- Include the room name for each item to make it clear where issues were found`;
}

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    // Accept jpg/jpeg and png images
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Initialize the Generative AI client
 * Throws an error if GOOGLE_API_KEY is not set
 */
function initializeGenAI(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_API_KEY environment variable is not set. Please configure it in your .env file."
    );
  }

  return new GoogleGenAI({ apiKey });
}

// Initialize GenAI client globally
const genAI = initializeGenAI();

// Create Express app
const app = express();
app.use(express.json());

/**
 * Endpoint 1: Upload an image to Gemini File API
 * POST /upload
 * Expects: multipart/form-data with 'image' field containing a jpg or png file
 * Returns: { fileName: string }
 */
app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log(`📤 Uploading image to Gemini File API...`);

    // Determine file extension based on mimetype
    const fileExtension = req.file.mimetype === "image/png" ? "png" : "jpg";
    
    // Create a temporary file from the buffer
    const tempFilePath = path.join(process.cwd(), `temp-${Date.now()}.${fileExtension}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
      // Upload the image to Gemini File API
      const uploadedFile = await genAI.files.upload({
        file: tempFilePath,
        config: {
          mimeType: req.file.mimetype,
          displayName: req.file.originalname,
        },
      });

      console.log(`✅ Uploaded file: ${uploadedFile.name}`);

      // Wait for file to be processed
      let fileState = uploadedFile.state;
      while (fileState === "PROCESSING") {
        console.log("⏳ Waiting for file to be processed...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedFile = await genAI.files.get({ name: uploadedFile.name! });
        fileState = updatedFile.state!;
      }

      if (fileState === "FAILED") {
        throw new Error("File processing failed");
      }

      console.log("✅ File processed successfully");

      // Clean up temp file
      fs.unlinkSync(tempFilePath);

      return res.json({ fileName: uploadedFile.name });
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to upload image",
    });
  }
});

/**
 * Endpoint 2: Compare two images using Gemini
 * POST /compare
 * Expects: { image1: string, image2: string } - file names from Gemini File API
 * Returns: { result: string } - AI analysis of the two images
 */
app.post("/compare", async (req: Request, res: Response) => {
  try {
    const { kitchenFilename, bathroomFilename, livingRoomFilename, bedroomFilename } = req.body;

    if (!kitchenFilename || !bathroomFilename || !livingRoomFilename || !bedroomFilename) {
      return res.status(400).json({
        error: "All four file names are required: kitchenFilename, bathroomFilename, livingRoomFilename, bedroomFilename",
      });
    }

    console.log(`📡 Retrieving images from Gemini File API...`);
    const previousKitchenFile = await genAI.files.get({ name: PREVIOUS_KITCHEN_FILENAME });
    const previousBathroomFile = await genAI.files.get({ name: PREVIOUS_BATHROOM_FILENAME });
    const previousLivingRoomFile = await genAI.files.get({ name: PREVIOUS_LIVING_ROOM_FILENAME });
    const previousBedroomFile = await genAI.files.get({ name: PREVIOUS_BEDROOM_FILENAME });
    // Retrieve the files using genAI.files.get
    const kitchenFile = await genAI.files.get({ name: kitchenFilename });
    const bathroomFile = await genAI.files.get({ name: bathroomFilename });
    const livingRoomFile = await genAI.files.get({ name: livingRoomFilename });
    const bedroomFile = await genAI.files.get({ name: bedroomFilename });

    console.log(`✅ Retrieved kitchen file: ${kitchenFile.name}`);
    console.log(`✅ Retrieved bathroom file: ${bathroomFile.name}`);
    console.log(`✅ Retrieved living room file: ${livingRoomFile.name}`);
    console.log(`✅ Retrieved bedroom file: ${bedroomFile.name}`);

    // Create room comparison pairs: [previous, current, roomName]
    const roomPairs: Array<[any, any, string]> = [
      [previousKitchenFile, kitchenFile, 'Kitchen'],
      [previousBathroomFile, bathroomFile, 'Bathroom'],
      [previousLivingRoomFile, livingRoomFile, 'Living Room'],
      [previousBedroomFile, bedroomFile, 'Bedroom'],
    ];

    console.log("📡 Comparing room images for damage assessment...");

    // Create array of promises for parallel execution
    const assessmentPromises = roomPairs.map(async ([previousFile, currentFile, roomName]) => {
      console.log(`🔍 Analyzing ${roomName}...`);
      
      try {
        const result = await genAI.models.generateContent({
          model: GEMINI_INSPECTION_MODEL,
          contents: createUserContent([
            createPartFromUri(previousFile.uri!, previousFile.mimeType!),
            createPartFromUri(currentFile.uri!, currentFile.mimeType!),
            createDamageAssessmentPrompt(roomName as string, ROOM_INVENTORIES[roomName]),
          ]),
          config: {
            temperature: 0.1,
            topP: 0.1,
            topK: 10,
            mediaResolution: MediaResolution.MEDIA_RESOLUTION_HIGH,
            thinkingConfig: { includeThoughts: false },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                damageDetected: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      itemName: { type: Type.STRING },
                      condition: { type: Type.STRING },
                      description: { type: Type.STRING },
                      severity: { type: Type.STRING }
                    },
                    required: ['itemName', 'condition', 'description', 'severity']
                  }
                },
                notes: { type: Type.STRING }
              },
              required: ['damageDetected', 'items']
            }
          }
        });

        // Parse JSON response
        const responseText = result.text!;
        let roomAssessment: RoomAssessment;
        
        try {
          const parsed = JSON.parse(responseText);
          roomAssessment = {
            room: roomName as string,
            damageDetected: parsed.damageDetected,
            items: parsed.items,
            notes: parsed.notes
          };
        } catch (error) {
          console.error(`⚠️ Failed to parse JSON for ${roomName}, using fallback`);
          roomAssessment = {
            room: roomName as string,
            damageDetected: false,
            items: [],
            notes: `Error parsing response: ${responseText.substring(0, 100)}`
          };
        }
        
        console.log(`✅ ${roomName} assessment completed`);
        return roomAssessment;
        
      } catch (error) {
        console.error(`❌ Error analyzing ${roomName}:`, error);
        return {
          room: roomName as string,
          damageDetected: false,
          items: [],
          notes: `Error during analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });

    // Wait for all assessments to complete in parallel
    const assessmentResults = await Promise.all(assessmentPromises);

    console.log("📊 Generating final summary...");

    // Generate final summary with structured JSON
    const summaryResult = await genAI.models.generateContent({
      model: GEMINI_SUMMARY_MODEL,
      contents: createUserContent([createSummaryPrompt(assessmentResults)]),
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallStatus: { type: Type.STRING },
            summary: { type: Type.STRING },
            itemsToCheck: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  room: { type: Type.STRING },
                  item: { type: Type.STRING }
                },
                required: ['room', 'item']
              }
            },
            totalIssuesFound: { type: Type.NUMBER }
          },
          required: ['overallStatus', 'summary', 'itemsToCheck', 'totalIssuesFound']
        }
      }
    });

    // Parse summary JSON response
    let summary: FinalSummary;
    const summaryText = summaryResult.text!;
    
    try {
      summary = JSON.parse(summaryText) as FinalSummary;
    } catch (error) {
      console.error('⚠️ Failed to parse summary JSON, using fallback');
      const totalIssues = assessmentResults.reduce((sum, r) => sum + r.items.length, 0);
      summary = {
        overallStatus: 'minor_issues',
        summary: 'Unable to generate summary - please review room assessments for details',
        itemsToCheck: [{ room: 'System', item: 'Manual review required - summary parsing failed' }],
        totalIssuesFound: totalIssues
      };
    }

    console.log("✅ Damage assessment completed successfully");

    const response: CompareResponse = {
      summary,
      roomAssessments: assessmentResults,
    };

    return res.json(response);
  } catch (error) {
    console.error("❌ Error comparing images:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to compare images",
    });
  }
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /upload - Upload an image`);
  console.log(`   POST /compare - Compare two images`);
  console.log(`   GET /health - Health check`);
});
