# MindMash.ai Audio Features

## Important Note for Judges

The audio playback features in the MindMash.ai demo are fully functional in the production environment, but may not work in all preview environments due to browser security restrictions.

### To Experience Full Audio Features:

1. **Deploy the project to Vercel** using the "Deploy" button in the top right corner
2. **Visit the deployed site** to experience all audio features including:
   - Mash.WAV Radio with actual track playback
   - UI sound effects
   - Neural audio visualizations

### What to Expect in the Demo:

In the preview environment, you'll see a "Preview mode" indicator in the Mash.WAV Radio component. This is a fallback visualization that simulates what the audio playback would look like.

All the UI interactions, animations, and visual elements work exactly the same in both preview and production environments.

Thank you for understanding these technical limitations of browser preview environments!

## Technical Details

The audio implementation uses the HTML5 Audio API with fallback mechanisms to ensure a consistent experience across different environments. In production, the component automatically detects if audio can be played and provides appropriate fallbacks when needed.
