package com.example.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.example.ui.components.ReverseCameraSurface

@Composable
fun CameraScreen(
    brightness: Float,
    contrast: Float,
    showOverlay: Boolean,
    onToggleOverlay: () -> Unit,
    onBrightnessChange: (Float) -> Unit,
    onContrastChange: (Float) -> Unit,
    onCloseCamera: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .testTag("camera_screen")
    ) {
        ReverseCameraSurface(
            brightness = brightness,
            contrast = contrast,
            showOverlay = showOverlay,
            onToggleOverlay = onToggleOverlay,
            onBrightnessChange = onBrightnessChange,
            onContrastChange = onContrastChange,
            onCloseCamera = onCloseCamera,
            onNavigateToSettings = onNavigateToSettings
        )
    }
}
