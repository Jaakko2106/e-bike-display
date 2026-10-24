package com.example.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.model.DEFAULT_PLAYLIST
import com.example.model.DEFAULT_ROUTE_STEPS
import com.example.model.DisplayMode
import com.example.model.GearLevel
import com.example.model.RepeatMode
import com.example.model.RouteStep
import com.example.model.Track
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.random.Random

data class BikeUiState(
    val speed: Float = 0.0f,
    val gear: GearLevel = GearLevel.OFF,
    val batteryPercent: Float = 100f,
    val isCharging: Boolean = false,
    val tripDistance: Float = 0.0f,
    val odometer: Float = 1245.7f,
    val tripStartTime: Long? = null,
    val tripDurationSeconds: Long = 0L,
    val displayMode: DisplayMode = DisplayMode.DASHBOARD,
    val destination: String = "",
    val isNavigating: Boolean = false,
    val directionIndex: Int = 0,
    val distanceToNextTurn: Float = DEFAULT_ROUTE_STEPS[0].initialDistanceMeters,
    val isToastDismissed: Boolean = false,
    val gpsSignalStrength: String = "Excellent",
    val batteryCycleCount: Int = 158,
    val batteryLifespan: Int = 92,
    // Audio Player State
    val isAudioPlaying: Boolean = false,
    val trackIndex: Int = 0,
    val audioCurrentTime: Int = 0,
    val audioVolume: Int = 65,
    val isAudioMuted: Boolean = false,
    val isBluetoothConnected: Boolean = true,
    val isShuffle: Boolean = false,
    val repeatMode: RepeatMode = RepeatMode.ALL,
    val playlist: List<Track> = DEFAULT_PLAYLIST,
    // Camera State
    val cameraBrightness: Float = 100f,
    val cameraContrast: Float = 100f,
    val showCameraOverlay: Boolean = false
) {
    val fullVoltage: Float = 54.6f
    val emptyVoltage: Float = 42.0f
    val batteryVoltage: Float
        get() = emptyVoltage + (batteryPercent / 100f) * (fullVoltage - emptyVoltage)

    val currentTrack: Track
        get() = playlist.getOrElse(trackIndex) { playlist[0] }

    val currentStep: RouteStep
        get() = DEFAULT_ROUTE_STEPS.getOrElse(directionIndex) { DEFAULT_ROUTE_STEPS[0] }

    val nextStep: RouteStep?
        get() = if (directionIndex + 1 < DEFAULT_ROUTE_STEPS.size) DEFAULT_ROUTE_STEPS[directionIndex + 1] else null

    val tripDurationFormatted: String
        get() {
            val minutes = (tripDurationSeconds / 60).toString().padStart(2, '0')
            val seconds = (tripDurationSeconds % 60).toString().padStart(2, '0')
            return "$minutes:$seconds"
        }

    val averageSpeedFormatted: String
        get() {
            val hours = tripDurationSeconds / 3600f
            return if (hours > 0f) {
                String.format("%.1f", tripDistance / hours)
            } else {
                "0.0"
            }
        }
}

class BikeDashboardViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(BikeUiState())
    val uiState: StateFlow<BikeUiState> = _uiState.asStateFlow()

    private var ticker500msJob: Job? = null
    private var ticker1000msJob: Job? = null

    init {
        startSimulation()
    }

    private fun startSimulation() {
        ticker500msJob?.cancel()
        ticker500msJob = viewModelScope.launch {
            while (isActive) {
                delay(500)
                updateSimulationTick()
            }
        }

        ticker1000msJob?.cancel()
        ticker1000msJob = viewModelScope.launch {
            while (isActive) {
                delay(1000)
                updateTimeTick()
            }
        }
    }

    private fun updateSimulationTick() {
        _uiState.update { current ->
            var newSpeed = current.speed
            val gear = current.gear

            if (gear != GearLevel.OFF) {
                newSpeed = (newSpeed + (gear.acceleration * 0.1f)).coerceAtMost(35.0f)
            } else {
                newSpeed = (newSpeed - 1.0f).coerceAtLeast(0.0f)
            }

            // Distance increment: (speed km/h / 3600) * 0.5 sec
            val distanceDelta = (newSpeed / 3600f) * 0.5f
            val newTripDist = if (newSpeed > 0f) current.tripDistance + distanceDelta else current.tripDistance
            val newOdometer = if (newSpeed > 0f) current.odometer + distanceDelta else current.odometer

            // Navigation turn countdown
            var newTurnDist = current.distanceToNextTurn
            if (current.isNavigating && newSpeed > 0f) {
                val metersDelta = (newSpeed * 1000f / 3600f) * 0.5f
                newTurnDist = (newTurnDist - metersDelta).coerceAtLeast(0f)
            }

            // Battery drain / charge
            var newBattery = current.batteryPercent
            if (current.isCharging) {
                newBattery = (newBattery + 0.5f).coerceAtMost(100f)
            } else if (newSpeed > 0f && gear.drainRate > 0f) {
                newBattery = (newBattery - gear.drainRate).coerceAtLeast(0f)
            }

            // Fluctuating GPS
            var newGps = current.gpsSignalStrength
            if (Random.nextFloat() > 0.95f) {
                val levels = listOf("Excellent", "Good", "Fair", "Poor")
                newGps = levels[Random.nextInt(levels.size)]
            }

            current.copy(
                speed = newSpeed,
                tripDistance = newTripDist,
                odometer = newOdometer,
                distanceToNextTurn = newTurnDist,
                batteryPercent = newBattery,
                gpsSignalStrength = newGps
            )
        }
    }

    private fun updateTimeTick() {
        _uiState.update { current ->
            // Update trip duration
            var newDuration = current.tripDurationSeconds
            if (current.speed > 0f && current.tripStartTime != null) {
                newDuration += 1
            }

            // Update audio progress
            var newAudioTime = current.audioCurrentTime
            var newTrackIdx = current.trackIndex
            var newIsPlaying = current.isAudioPlaying

            if (current.isAudioPlaying && current.isBluetoothConnected) {
                newAudioTime += 1
                val trackDuration = current.currentTrack.duration
                if (newAudioTime >= trackDuration) {
                    when (current.repeatMode) {
                        RepeatMode.ONE -> {
                            newAudioTime = 0
                        }
                        RepeatMode.ALL -> {
                            newAudioTime = 0
                            newTrackIdx = (newTrackIdx + 1) % current.playlist.size
                        }
                        RepeatMode.NONE -> {
                            if (newTrackIdx + 1 < current.playlist.size) {
                                newAudioTime = 0
                                newTrackIdx += 1
                            } else {
                                newIsPlaying = false
                            }
                        }
                    }
                }
            }

            current.copy(
                tripDurationSeconds = newDuration,
                audioCurrentTime = newAudioTime,
                trackIndex = newTrackIdx,
                isAudioPlaying = newIsPlaying
            )
        }
    }

    fun cycleGear() {
        _uiState.update { current ->
            val nextGear = current.gear.next()
            val startTime = if (nextGear != GearLevel.OFF && current.tripStartTime == null) {
                System.currentTimeMillis()
            } else {
                current.tripStartTime
            }
            current.copy(gear = nextGear, tripStartTime = startTime)
        }
    }

    fun setDisplayMode(mode: DisplayMode) {
        _uiState.update { it.copy(displayMode = mode) }
    }

    fun setDestination(dest: String) {
        _uiState.update { it.copy(destination = dest) }
    }

    fun startRoute() {
        _uiState.update { current ->
            if (current.destination.isNotBlank()) {
                current.copy(
                    isNavigating = true,
                    directionIndex = 0,
                    distanceToNextTurn = DEFAULT_ROUTE_STEPS[0].initialDistanceMeters,
                    isToastDismissed = false
                )
            } else {
                current
            }
        }
    }

    fun endRoute() {
        _uiState.update { current ->
            current.copy(
                isNavigating = false,
                destination = "",
                directionIndex = 0,
                distanceToNextTurn = DEFAULT_ROUTE_STEPS[0].initialDistanceMeters,
                isToastDismissed = false
            )
        }
    }

    fun cycleDirection() {
        _uiState.update { current ->
            if (current.directionIndex < DEFAULT_ROUTE_STEPS.size - 1) {
                val nextIdx = current.directionIndex + 1
                current.copy(
                    directionIndex = nextIdx,
                    distanceToNextTurn = DEFAULT_ROUTE_STEPS[nextIdx].initialDistanceMeters,
                    isToastDismissed = false
                )
            } else {
                current.copy(
                    isNavigating = false,
                    destination = "",
                    directionIndex = 0,
                    distanceToNextTurn = DEFAULT_ROUTE_STEPS[0].initialDistanceMeters,
                    isToastDismissed = false
                )
            }
        }
    }

    fun dismissToast() {
        _uiState.update { it.copy(isToastDismissed = true) }
    }

    fun test85mAlert() {
        _uiState.update { it.copy(distanceToNextTurn = 85f, isToastDismissed = false) }
    }

    fun toggleCamera() {
        _uiState.update { current ->
            val newMode = if (current.displayMode == DisplayMode.CAMERA) {
                DisplayMode.DASHBOARD
            } else {
                DisplayMode.CAMERA
            }
            current.copy(displayMode = newMode)
        }
    }

    fun resetTrip() {
        _uiState.update { current ->
            current.copy(
                speed = 0f,
                gear = GearLevel.OFF,
                tripDistance = 0f,
                tripStartTime = null,
                tripDurationSeconds = 0L
            )
        }
    }

    fun toggleCharging() {
        _uiState.update { it.copy(isCharging = !it.isCharging) }
    }

    fun toggleBluetooth() {
        _uiState.update { current ->
            val nextState = !current.isBluetoothConnected
            current.copy(
                isBluetoothConnected = nextState,
                isAudioPlaying = if (!nextState) false else current.isAudioPlaying
            )
        }
    }

    fun toggleAudioPlay() {
        _uiState.update { current ->
            if (!current.isBluetoothConnected) current
            else current.copy(isAudioPlaying = !current.isAudioPlaying)
        }
    }

    fun nextTrack() {
        _uiState.update { current ->
            val nextIdx = if (current.isShuffle) {
                Random.nextInt(current.playlist.size)
            } else {
                (current.trackIndex + 1) % current.playlist.size
            }
            current.copy(trackIndex = nextIdx, audioCurrentTime = 0)
        }
    }

    fun prevTrack() {
        _uiState.update { current ->
            if (current.audioCurrentTime > 3) {
                current.copy(audioCurrentTime = 0)
            } else {
                val prevIdx = (current.trackIndex - 1 + current.playlist.size) % current.playlist.size
                current.copy(trackIndex = prevIdx, audioCurrentTime = 0)
            }
        }
    }

    fun seekAudio(seconds: Int) {
        _uiState.update { current ->
            val clamped = seconds.coerceIn(0, current.currentTrack.duration)
            current.copy(audioCurrentTime = clamped)
        }
    }

    fun setAudioVolume(volume: Int) {
        _uiState.update { it.copy(audioVolume = volume.coerceIn(0, 100), isAudioMuted = false) }
    }

    fun toggleMuteAudio() {
        _uiState.update { it.copy(isAudioMuted = !it.isAudioMuted) }
    }

    fun toggleShuffleAudio() {
        _uiState.update { it.copy(isShuffle = !it.isShuffle) }
    }

    fun toggleRepeatAudio() {
        _uiState.update { it.copy(repeatMode = it.repeatMode.next()) }
    }

    fun selectTrack(index: Int) {
        _uiState.update { current ->
            if (index in current.playlist.indices) {
                current.copy(trackIndex = index, audioCurrentTime = 0, isAudioPlaying = true)
            } else current
        }
    }

    fun updateCameraBrightness(brightness: Float) {
        _uiState.update { it.copy(cameraBrightness = brightness.coerceIn(50f, 150f)) }
    }

    fun updateCameraContrast(contrast: Float) {
        _uiState.update { it.copy(cameraContrast = contrast.coerceIn(50f, 150f)) }
    }

    fun toggleCameraOverlay() {
        _uiState.update { it.copy(showCameraOverlay = !it.showCameraOverlay) }
    }
}
