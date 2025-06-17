import Replicate from 'replicate';
import fs from 'fs/promises';

// Initialize Replicate client
const replicate = new Replicate({
  auth: 'r8_Xfz3XIlPHiqhIzGttBx4l0DbpiA4EfT086Elj',
});

// TypeScript interfaces for better type safety
export interface InkArtParams {
  prompt: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  promptStrength?: number;
  saveToFile?: boolean;
  filename?: string;
}

export interface InkArtResult {
  imageUrl: string;
  savedPath?: string;
  metadata: {
    prompt: string;
    width: number;
    height: number;
    guidanceScale: number;
    timestamp: string;
  };
}

export interface TattooDesignParams {
  style: string;
  subject: string;
  placement?: string;
  customWidth?: number;
  customHeight?: number;
  sizeInInches?: {
    width: number;
    height: number;
  };
}

/**
 * Generate AI art using the SDXL Fresh Ink model
 * @param params - Configuration parameters for image generation
 * @returns Promise<InkArtResult> - Generated image URL and metadata
 */
export async function generateInkArt({
  prompt,
  width = 1024,
  height = 1024,
  numOutputs = 1,
  guidanceScale = 7.5,
  negativePrompt = 'ugly, broken, distorted, blurry, low quality, deformed',
  promptStrength = 0.8,
  saveToFile = false,
  filename = 'generated-ink-art.png'
}: InkArtParams): Promise<InkArtResult> {
  try {
    console.log('🎨 Generating AI ink art with prompt:', prompt);
    
    const output = await replicate.run(
      "fofr/sdxl-fresh-ink:8515c238222fa529763ec99b4ba1fa9d32ab5d6ebc82b4281de99e4dbdcec943",
      {
        input: {
          width,
          height,
          prompt,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: numOutputs,
          guidance_scale: guidanceScale,
          apply_watermark: false,
          high_noise_frac: 0.9,
          negative_prompt: negativePrompt,
          prompt_strength: promptStrength,
          num_inference_steps: 25
        }
      }
    ) as string[];

    if (!output || !output[0]) {
      throw new Error('No image generated from Replicate API');
    }

    const imageUrl = output[0];
    let savedPath: string | undefined;

    // Save image to disk if requested
    if (saveToFile && imageUrl) {
      try {
        // Fetch the image data
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const imageBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(imageBuffer);
        
        // Save to the public directory so it can be served
        const publicPath = `public/generated/${filename}`;
        await fs.mkdir('public/generated', { recursive: true });
        await fs.writeFile(publicPath, uint8Array);
        
        savedPath = publicPath;
        console.log('✅ Image saved to:', savedPath);
      } catch (saveError) {
        console.warn('⚠️ Failed to save image to disk:', saveError);
        // Don't throw here, just log the warning
      }
    }

    const result: InkArtResult = {
      imageUrl,
      savedPath,
      metadata: {
        prompt,
        width,
        height,
        guidanceScale,
        timestamp: new Date().toISOString()
      }
    };

    console.log('✅ AI ink art generated successfully');
    return result;

  } catch (error) {
    console.error('❌ Error generating ink art:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        throw new Error('Replicate API authentication failed. Please check your API key.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    
    throw new Error(`Failed to generate AI art: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert inches to pixels for tattoo design generation
 * @param inches - Size in inches
 * @param dpi - Dots per inch (default: 300 for high quality)
 * @returns Size in pixels
 */
function inchesToPixels(inches: number, dpi: number = 300): number {
  return Math.round(inches * dpi);
}

/**
 * Generate tattoo-specific AI art with optimized prompts and custom dimensions
 * @param params - Tattoo design parameters
 * @returns Promise<InkArtResult> - Generated tattoo design
 */
export async function generateTattooDesign({
  style,
  subject,
  placement = 'arm',
  customWidth,
  customHeight,
  sizeInInches
}: TattooDesignParams): Promise<InkArtResult> {
  // Default dimensions based on placement
  const placementDimensions: Record<string, { width: number; height: number }> = {
    arm: { width: 768, height: 1024 },
    shoulder: { width: 1024, height: 1024 },
    back: { width: 1024, height: 1344 },
    chest: { width: 1024, height: 768 },
    leg: { width: 768, height: 1344 },
    wrist: { width: 512, height: 512 },
    neck: { width: 512, height: 768 },
    ankle: { width: 512, height: 512 },
    bicep: { width: 768, height: 1024 }, // Added bicep as specific placement
    forearm: { width: 512, height: 1024 },
    thigh: { width: 768, height: 1344 },
    calf: { width: 512, height: 1024 }
  };

  let finalDimensions = placementDimensions[placement] || { width: 1024, height: 1024 };

  // Priority order for dimension determination:
  // 1. Custom width/height (direct pixel values)
  // 2. Size in inches (converted to pixels)
  // 3. Default placement dimensions

  if (customWidth && customHeight) {
    finalDimensions = { width: customWidth, height: customHeight };
    console.log(`🎯 Using custom dimensions: ${customWidth}x${customHeight}px`);
  } else if (sizeInInches) {
    finalDimensions = {
      width: inchesToPixels(sizeInInches.width),
      height: inchesToPixels(sizeInInches.height)
    };
    console.log(`📏 Converting ${sizeInInches.width}"x${sizeInInches.height}" to ${finalDimensions.width}x${finalDimensions.height}px`);
  } else {
    console.log(`📍 Using default dimensions for ${placement}: ${finalDimensions.width}x${finalDimensions.height}px`);
  }

  // Create optimized prompt for tattoo design
  const tattooPrompt = `${style} tattoo design of ${subject}, black ink on white background, clean lines, high contrast, tattoo art style, professional tattoo design, detailed linework`;
  
  const negativePrompt = 'color, colored, background, realistic skin, photographic, blurry, low quality, distorted, ugly, broken, watermark, signature, text';

  return generateInkArt({
    prompt: tattooPrompt,
    width: finalDimensions.width,
    height: finalDimensions.height,
    negativePrompt,
    guidanceScale: 8.0, // Higher guidance for more precise tattoo designs
    promptStrength: 0.9,
    saveToFile: true,
    filename: `tattoo-${style}-${subject.replace(/\s+/g, '-')}-${finalDimensions.width}x${finalDimensions.height}-${Date.now()}.png`
  });
}

/**
 * Batch generate multiple variations of a design
 * @param params - Base parameters for generation
 * @param variations - Number of variations to generate
 * @returns Promise<InkArtResult[]> - Array of generated designs
 */
export async function generateDesignVariations(
  params: TattooDesignParams,
  variations: number = 3
): Promise<InkArtResult[]> {
  const results: InkArtResult[] = [];
  
  for (let i = 0; i < variations; i++) {
    try {
      // Slightly vary the prompt for each iteration
      const variedParams = {
        ...params,
        subject: `${params.subject}, variation ${i + 1}`
      };
      
      const result = await generateTattooDesign(variedParams);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate variation ${i + 1}:`, error);
      // Continue with other variations even if one fails
    }
  }
  
  return results;
}

export default {
  generateInkArt,
  generateTattooDesign,
  generateDesignVariations
};