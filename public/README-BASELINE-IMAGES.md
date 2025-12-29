# Baseline Images for Room Overlays

Place the following baseline/previous images in this `public/` folder:

## Required Files:

1. **`baseline-kitchen.jpg`** - Kitchen baseline photo (before guest stay)
2. **`baseline-bathroom.jpg`** - Bathroom baseline photo (before guest stay)
3. **`baseline-livingroom.jpg`** - Living room baseline photo (before guest stay)
4. **`baseline-bedroom.jpg`** - Bedroom baseline photo (before guest stay)

## Purpose:

These images will be displayed as semi-transparent overlays (55% opacity) when users take photos during inspections. This helps users align their shots with the baseline images for accurate damage comparison.

## Image Requirements:

- **Format**: JPG or PNG
- **Recommended Resolution**: 1920x1080 or higher
- **Orientation**: Match the actual room orientation
- **Content**: Clear, well-lit photos taken from the same angle for consistency

## Usage:

The images are mapped in `components/CameraCapture.tsx`:
```typescript
const roomImageMap = {
  'kitchen': '/baseline-kitchen.jpg',
  'bathroom': '/baseline-bathroom.jpg',
  'livingRoom': '/baseline-livingroom.jpg',
  'bedroom': '/baseline-bedroom.jpg',
};
```

## Temporary Placeholder:

If you don't have baseline images yet, you can:
1. Use the same placeholder for all rooms temporarily
2. Or remove the overlay by setting the paths to `null` in the code

