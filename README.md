<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Guesty Guard - AI Property Inspection App

Professional property inspection tool powered by AI and advanced camera technology.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Features

- 📷 **Professional Camera Capture** - Native browser camera with full-screen capture
  - Auto-start camera with permission request
  - Rear camera support for mobile devices (`facingMode: environment`)
  - HD photo quality (1920x1080)
  - Grid overlay for composition guidance
  - Real-time video preview
- 🤖 **AI-Powered Analysis** - Gemini AI compares baseline and current photos to detect damages
- 📊 **Detailed Reports** - Generate comprehensive inspection reports with findings and cost estimates
- 📁 **Flexible Upload** - Support for both camera capture and file upload
- 🏠 **Room-Based Workflow** - Organized inspection by room type

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## How It Works

1. **Select Property** - Choose a property to inspect
2. **Select Room** - Pick the room type (Living Room, Kitchen, Bedroom, Bathroom)
3. **Capture Baseline Photo** - Take a photo of the room's initial state
4. **Capture Current Photo** - Take a photo after guest checkout
5. **AI Analysis** - Gemini AI compares both photos and identifies:
   - Damages and missing items
   - Severity levels (Low, Medium, High, Critical)
   - Estimated repair costs
   - Detailed descriptions
6. **Review Report** - View comprehensive findings and generate inspection report

## Technologies

- **React** + **TypeScript** + **Vite** - Modern frontend stack
- **MediaDevices API** - Native browser camera access
- **Google Gemini AI** - Advanced image analysis
- **Tailwind CSS** - Beautiful, responsive UI
