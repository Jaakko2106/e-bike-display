package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.AlertAmber
import com.example.ui.theme.CyberIndigo
import com.example.ui.theme.CyberIndigoBright
import com.example.ui.theme.DangerRed
import com.example.ui.theme.DarkCardBorder
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.TextSecondary

@Composable
fun ReverseCameraSurface(
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
            .background(Color.Black)
            .testTag("reverse_camera_surface")
    ) {
        // Mirrored camera feed image
        AsyncImage(
            model = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
            contentDescription = "Rear View Camera Feed",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Guide Lines Simulation
        // Bottom gradient
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .align(Alignment.BottomCenter)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                    )
                )
        )

        // Safety lines
        Box(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .height(2.dp)
                .align(Alignment.Center)
                .background(DangerRed.copy(alpha = 0.85f))
        )
        Box(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .height(2.dp)
                .align(Alignment.Center)
                .padding(top = 80.dp)
                .background(AlertAmber.copy(alpha = 0.85f))
        )
        Box(
            modifier = Modifier
                .fillMaxWidth(0.98f)
                .height(2.dp)
                .align(Alignment.Center)
                .padding(top = 160.dp)
                .background(NeonGreen.copy(alpha = 0.85f))
        )

        // Top Left Title Badge
        Row(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(14.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(DarkSurface.copy(alpha = 0.85f))
                .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Videocam,
                contentDescription = null,
                tint = AlertAmber,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "REVERSE CAMERA",
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )
        }

        // Top Right Controls
        Row(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onToggleOverlay,
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (showOverlay) CyberIndigo else DarkSurface.copy(alpha = 0.85f))
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                    .testTag("camera_settings_toggle")
            ) {
                Icon(
                    imageVector = Icons.Default.Tune,
                    contentDescription = "Camera Settings",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = onCloseCamera,
                colors = ButtonDefaults.buttonColors(containerColor = DangerRed),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.height(40.dp).testTag("close_camera_button")
            ) {
                Text(text = "CLOSE", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }

        // Camera Adjustments Overlay Card
        AnimatedVisibility(
            visible = showOverlay,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 64.dp, end = 14.dp)
        ) {
            Box(
                modifier = Modifier
                    .width(260.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkSurface.copy(alpha = 0.95f))
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Text(
                        text = "CAMERA ADJUSTMENTS",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Brightness slider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.WbSunny,
                            contentDescription = null,
                            tint = AlertAmber,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Brightness", color = TextSecondary, fontSize = 12.sp)
                        Spacer(modifier = Modifier.weight(1f))
                        Text(text = "${brightness.toInt()}%", color = Color.White, fontSize = 12.sp)
                    }
                    Slider(
                        value = brightness,
                        onValueChange = onBrightnessChange,
                        valueRange = 50f..150f,
                        colors = SliderDefaults.colors(
                            thumbColor = CyberIndigoBright,
                            activeTrackColor = CyberIndigo
                        )
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Contrast slider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Tune,
                            contentDescription = null,
                            tint = ElectricCyan,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Contrast", color = TextSecondary, fontSize = 12.sp)
                        Spacer(modifier = Modifier.weight(1f))
                        Text(text = "${contrast.toInt()}%", color = Color.White, fontSize = 12.sp)
                    }
                    Slider(
                        value = contrast,
                        onValueChange = onContrastChange,
                        valueRange = 50f..150f,
                        colors = SliderDefaults.colors(
                            thumbColor = CyberIndigoBright,
                            activeTrackColor = CyberIndigo
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Button(
                        onClick = onNavigateToSettings,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1F2937)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = null,
                            tint = CyberIndigoBright,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Go to Main Settings", color = CyberIndigoBright, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
