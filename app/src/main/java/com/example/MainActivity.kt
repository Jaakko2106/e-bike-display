package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.DisplayMode
import com.example.model.TurnType
import com.example.ui.components.BottomNavBar
import com.example.ui.components.GearControlBar
import com.example.ui.components.NavigationToastOverlay
import com.example.ui.screens.CameraScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.MapScreen
import com.example.ui.screens.MusicScreen
import com.example.ui.screens.SettingsScreen
import com.example.ui.screens.TripScreen
import com.example.ui.theme.AlertAmber
import com.example.ui.theme.DarkBackground
import com.example.ui.theme.DarkCardBorder
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.EBikeTheme
import com.example.viewmodel.BikeDashboardViewModel
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EBikeTheme {
                EBikeApp()
            }
        }
    }
}

@Composable
fun EBikeApp(
    viewModel: BikeDashboardViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    var currentTimeString by remember { mutableStateOf("") }
    LaunchedEffect(Unit) {
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        while (true) {
            currentTimeString = sdf.format(Date())
            delay(1000)
        }
    }

    // Hardware/gesture back handling
    BackHandler(enabled = uiState.displayMode != DisplayMode.DASHBOARD) {
        viewModel.setDisplayMode(DisplayMode.DASHBOARD)
    }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .statusBarsPadding()
            .testTag("app_scaffold"),
        containerColor = DarkBackground
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentAlignment = Alignment.Center
        ) {
            // Main frame container - responsive max width 600dp
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .widthIn(max = 600.dp)
                    .clip(RoundedCornerShape(28.dp))
                    .background(Color(0xFF030712))
                    .border(3.dp, Color(0xFF1F2937), RoundedCornerShape(28.dp))
            ) {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Header Bar with Title & Clock
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DarkSurface.copy(alpha = 0.9f))
                            .border(1.dp, DarkCardBorder)
                            .padding(horizontal = 16.dp, vertical = 10.dp)
                            .testTag("header_bar"),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "E-Bike OS v1.2",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )

                        Text(
                            text = currentTimeString,
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // Main Viewport
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                    ) {
                        when (uiState.displayMode) {
                            DisplayMode.DASHBOARD -> DashboardScreen(
                                speed = uiState.speed,
                                gear = uiState.gear,
                                batteryPercent = uiState.batteryPercent,
                                batteryVoltage = uiState.batteryVoltage,
                                isCharging = uiState.isCharging
                            )
                            DisplayMode.TRIP -> TripScreen(
                                tripDistance = uiState.tripDistance,
                                odometer = uiState.odometer,
                                tripDurationFormatted = uiState.tripDurationFormatted,
                                averageSpeedFormatted = uiState.averageSpeedFormatted
                            )
                            DisplayMode.MAP -> MapScreen(
                                isNavigating = uiState.isNavigating,
                                destination = uiState.destination,
                                currentStep = uiState.currentStep,
                                nextStep = uiState.nextStep,
                                distanceToNextTurn = uiState.distanceToNextTurn,
                                onDestinationChange = { viewModel.setDestination(it) },
                                onStartRoute = { viewModel.startRoute() },
                                onEndRoute = { viewModel.endRoute() },
                                onCycleDirection = { viewModel.cycleDirection() },
                                onTest85mAlert = { viewModel.test85mAlert() }
                            )
                            DisplayMode.MUSIC -> MusicScreen(
                                currentTrack = uiState.currentTrack,
                                playlist = uiState.playlist,
                                trackIndex = uiState.trackIndex,
                                isPlaying = uiState.isAudioPlaying,
                                currentTime = uiState.audioCurrentTime,
                                volume = uiState.audioVolume,
                                isMuted = uiState.isAudioMuted,
                                isBluetoothConnected = uiState.isBluetoothConnected,
                                isShuffle = uiState.isShuffle,
                                repeatMode = uiState.repeatMode,
                                onTogglePlay = { viewModel.toggleAudioPlay() },
                                onNext = { viewModel.nextTrack() },
                                onPrev = { viewModel.prevTrack() },
                                onSeek = { viewModel.seekAudio(it) },
                                onVolumeChange = { viewModel.setAudioVolume(it) },
                                onToggleMute = { viewModel.toggleMuteAudio() },
                                onToggleShuffle = { viewModel.toggleShuffleAudio() },
                                onToggleRepeat = { viewModel.toggleRepeatAudio() },
                                onToggleBluetooth = { viewModel.toggleBluetooth() },
                                onSelectTrack = { viewModel.selectTrack(it) }
                            )
                            DisplayMode.SETTINGS -> SettingsScreen(
                                batteryCycleCount = uiState.batteryCycleCount,
                                batteryLifespan = uiState.batteryLifespan,
                                gpsSignalStrength = uiState.gpsSignalStrength,
                                isCharging = uiState.isCharging,
                                onToggleCharging = { viewModel.toggleCharging() },
                                onResetTrip = { viewModel.resetTrip() }
                            )
                            DisplayMode.CAMERA -> CameraScreen(
                                brightness = uiState.cameraBrightness,
                                contrast = uiState.cameraContrast,
                                showOverlay = uiState.showCameraOverlay,
                                onToggleOverlay = { viewModel.toggleCameraOverlay() },
                                onBrightnessChange = { viewModel.updateCameraBrightness(it) },
                                onContrastChange = { viewModel.updateCameraContrast(it) },
                                onCloseCamera = { viewModel.toggleCamera() },
                                onNavigateToSettings = { viewModel.setDisplayMode(DisplayMode.SETTINGS) }
                            )
                        }

                        // Floating Rear Camera Toggle Button
                        if (uiState.displayMode != DisplayMode.CAMERA && uiState.displayMode != DisplayMode.SETTINGS) {
                            FloatingActionButton(
                                onClick = { viewModel.toggleCamera() },
                                containerColor = AlertAmber,
                                contentColor = Color(0xFF111827),
                                shape = CircleShape,
                                modifier = Modifier
                                    .align(Alignment.BottomEnd)
                                    .padding(end = 16.dp, bottom = 16.dp)
                                    .testTag("floating_camera_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Videocam,
                                    contentDescription = "Activate Rear Camera",
                                    modifier = Modifier.size(26.dp)
                                )
                            }
                        }

                        // Navigation Toast Overlay (when within 100m of intersection)
                        val showToast = uiState.isNavigating &&
                                uiState.distanceToNextTurn <= 100f &&
                                !uiState.isToastDismissed &&
                                uiState.currentStep.turnType != TurnType.ARRIVE

                        NavigationToastOverlay(
                            distanceMeters = uiState.distanceToNextTurn,
                            instruction = uiState.currentStep.instruction,
                            turnType = uiState.currentStep.turnType,
                            subText = uiState.currentStep.subText,
                            visible = showToast,
                            onDismiss = { viewModel.dismissToast() },
                            onTurnAction = { viewModel.cycleDirection() },
                            modifier = Modifier
                                .align(Alignment.TopCenter)
                                .padding(top = 8.dp)
                        )
                    }

                    // Bottom Panel: Assist Gear Controls & Navigation Bar
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DarkSurface.copy(alpha = 0.9f))
                            .border(1.dp, DarkCardBorder)
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        GearControlBar(
                            gear = uiState.gear,
                            onCycle = { viewModel.cycleGear() }
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        BottomNavBar(
                            currentMode = uiState.displayMode,
                            onModeSelected = { viewModel.setDisplayMode(it) }
                        )
                    }
                }
            }
        }
    }
}
