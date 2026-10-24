# E-Bike Dashboard (Android / Jetpack Compose)

A futuristic, high-contrast digital cockpit and telemetry dashboard for electric bicycles, completely rewritten as a native Android application using **Kotlin** and **Jetpack Compose (Material 3)**.

## Core Features & Architecture

### 1. Real-time Telemetry Dashboard (`DashboardScreen`)
- **Digital Speedometer**: Large high-contrast monospace readout (0.0 to 35.0 km/h) with subtle radial glowing backdrop.
- **Battery Indicator (`BatteryBar`)**: Dynamic 48V battery voltage calculation (42.0V empty to 54.6V full), animated charge level bar, charging status badge, and estimated remaining range.
- **Motor Assist Level (`GearControlBar`)**: Dynamic assist mode selector cycling through `OFF`, `ECO`, `TOUR`, `SPORT`, and `TURBO` with realistic acceleration dynamics and battery drain simulation.

### 2. Comprehensive Trip Computer (`TripScreen`)
- Live trip distance tracking (KM).
- Lifetime odometer (KM).
- Trip duration timer with formatted "MM:SS" display.
- Dynamic average speed calculation.

### 3. Integrated Bike Navigation (`MapScreen` & `InteractiveMapCanvas`)
- Destination search bar and quick trail suggestion pills (Marina Green Path, Golden Gate Viewpoint, Ocean Beach Trail, Presidio Heights).
- Custom interactive map canvas with GPS telemetry lock badge, futuristic user e-bike beacon marker with pulsating radar rings & directional chevron, destination pin, dashed neon route line, tile theme toggling (Dark, Street, Satellite), zoom buttons, and re-center on user action.
- Turn-by-turn guidance HUD with turn icons (`Straight`, `Left`, `Right`, `Merge`, `Arrive`), distance countdown, and route progression controls.
- **100m Intersection Alert Toast (`NavigationToastOverlay`)**: Slide-in warning banner when approaching within 100 meters of an intersection with countdown progress bar, quick turn button, and dismiss action.

### 4. Bluetooth Audio & Visualizer (`MusicScreen` & `AudioPlayerSection`)
- Album artwork display with glowing ambient light.
- Real-time animated audio visualizer waveform bars.
- Track information, playlist drawer with BPM ratings, and track selection.
- Full audio playback controls: Play/Pause, Next/Prev, interactive scrubber slider, Shuffle, Repeat modes, Volume slider, Mute toggle, and Bluetooth helmet/headset connectivity state.

### 5. Reverse Camera View (`CameraScreen` & `ReverseCameraSurface`)
- Simulated rear view safety camera feed with mirrored perspective.
- Distance guidance lines (red danger, yellow caution, green safe zone markers).
- Real-time video stream adjustments for brightness (50%–150%) and contrast (50%–150%).
- Quick-access floating camera button accessible across dashboard screens.

### 6. Diagnostics & System Setup (`SettingsScreen`)
- Battery health diagnostics (cycle count and lifespan percentage).
- Fluctuating GPS signal strength indicator.
- Simulation charger toggle (plug-in charging mode).
- Trip reset and simulation stop controls.

## Project Structure

```
app/
 ├── src/main/
 │    ├── AndroidManifest.xml
 │    ├── java/com/example/
 │    │    ├── MainActivity.kt
 │    │    ├── model/
 │    │    │    ├── DisplayMode.kt
 │    │    │    ├── GearLevel.kt
 │    │    │    ├── NavigationModels.kt
 │    │    │    └── AudioModels.kt
 │    │    ├── ui/
 │    │    │    ├── components/
 │    │    │    │    ├── AudioPlayerSection.kt
 │    │    │    │    ├── BatteryBar.kt
 │    │    │    │    ├── BottomNavBar.kt
 │    │    │    │    ├── GearControlBar.kt
 │    │    │    │    ├── InteractiveMapCanvas.kt
 │    │    │    │    ├── MetricCard.kt
 │    │    │    │    ├── NavigationToastOverlay.kt
 │    │    │    │    ├── ReverseCameraSurface.kt
 │    │    │    │    └── SpeedometerGauge.kt
 │    │    │    ├── screens/
 │    │    │    │    ├── CameraScreen.kt
 │    │    │    │    ├── DashboardScreen.kt
 │    │    │    │    ├── MapScreen.kt
 │    │    │    │    ├── MusicScreen.kt
 │    │    │    │    ├── SettingsScreen.kt
 │    │    │    │    └── TripScreen.kt
 │    │    │    └── theme/
 │    │    │         ├── Color.kt
 │    │    │         └── Theme.kt
 │    │    └── viewmodel/
 │    │         └── BikeDashboardViewModel.kt
 │    └── res/
 │         ├── drawable/
 │         ├── mipmap-*/
 │         └── values/
 └── build.gradle.kts
```

## Running the Android App
Build and run using Android Studio or Gradle:
```bash
./gradlew assembleDebug
```
