package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.AlertAmber
import com.example.ui.theme.CyberIndigo
import com.example.ui.theme.DarkCardBorder
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.ElectricCyan
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.TextSecondary
import kotlin.math.cos
import kotlin.math.sin

enum class MapTileTheme(val label: String) {
    DARK("Dark"),
    STREETS("Streets"),
    SATELLITE("Satellite")
}

@Composable
fun InteractiveMapCanvas(
    destination: String?,
    modifier: Modifier = Modifier
) {
    var offsetX by remember { mutableFloatStateOf(0f) }
    var offsetY by remember { mutableFloatStateOf(0f) }
    var zoomLevel by remember { mutableFloatStateOf(1.0f) }
    var isFollowing by remember { mutableStateOf(true) }
    var tileTheme by remember { mutableStateOf(MapTileTheme.DARK) }

    val infiniteTransition = rememberInfiniteTransition(label = "beacon_radar")
    val radarPulse by infiniteTransition.animateFloat(
        initialValue = 18f,
        targetValue = 65f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radar_radius"
    )
    val radarAlpha by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 0.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radar_alpha"
    )

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(24.dp))
            .border(2.dp, CyberIndigo.copy(alpha = 0.6f), RoundedCornerShape(24.dp))
            .background(
                when (tileTheme) {
                    MapTileTheme.DARK -> Color(0xFF030712)
                    MapTileTheme.STREETS -> Color(0xFF1E293B)
                    MapTileTheme.SATELLITE -> Color(0xFF0B192C)
                }
            )
            .pointerInput(Unit) {
                detectDragGestures { change, dragAmount ->
                    change.consume()
                    offsetX += dragAmount.x
                    offsetY += dragAmount.y
                    isFollowing = false
                }
            }
            .testTag("interactive_map_canvas")
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val cx = size.width / 2f + (if (isFollowing) 0f else offsetX)
            val cy = size.height / 2f + (if (isFollowing) 0f else offsetY)

            // Draw grid lines representing map coordinate grid
            val gridSpacing = 60f * zoomLevel
            val startX = (cx % gridSpacing)
            val startY = (cy % gridSpacing)

            val gridColor = when (tileTheme) {
                MapTileTheme.DARK -> Color(0xFF1F2937).copy(alpha = 0.4f)
                MapTileTheme.STREETS -> Color(0xFF334155).copy(alpha = 0.5f)
                MapTileTheme.SATELLITE -> Color(0xFF1E3A8A).copy(alpha = 0.3f)
            }

            var gx = startX
            while (gx < size.width) {
                drawLine(
                    color = gridColor,
                    start = Offset(gx, 0f),
                    end = Offset(gx, size.height),
                    strokeWidth = 1.dp.toPx()
                )
                gx += gridSpacing
            }

            var gy = startY
            while (gy < size.height) {
                drawLine(
                    color = gridColor,
                    start = Offset(0f, gy),
                    end = Offset(size.width, gy),
                    strokeWidth = 1.dp.toPx()
                )
                gy += gridSpacing
            }

            // Draw roads / bike trails
            val roadColor = when (tileTheme) {
                MapTileTheme.DARK -> Color(0xFF111827)
                MapTileTheme.STREETS -> Color(0xFF475569)
                MapTileTheme.SATELLITE -> Color(0xFF1E293B)
            }
            drawCircle(
                color = roadColor,
                radius = 180f * zoomLevel,
                center = Offset(cx - 40f, cy + 30f),
                style = Stroke(width = 16f * zoomLevel)
            )

            // Destination and simulated route path
            if (!destination.isNullOrBlank()) {
                val destX = cx + (110f * zoomLevel)
                val destY = cy - (140f * zoomLevel)

                // Route Polyline
                val routePath = Path().apply {
                    moveTo(cx, cy)
                    lineTo(cx + (35f * zoomLevel), cy - (20f * zoomLevel))
                    lineTo(cx + (40f * zoomLevel), cy - (90f * zoomLevel))
                    lineTo(destX, destY)
                }

                drawPath(
                    path = routePath,
                    color = CyberIndigo,
                    style = Stroke(
                        width = 5.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(16f, 12f), 0f)
                    )
                )

                // Destination Pin Marker
                drawCircle(
                    color = AlertAmber.copy(alpha = 0.35f),
                    radius = 24f * zoomLevel,
                    center = Offset(destX, destY)
                )
                drawCircle(
                    color = AlertAmber,
                    radius = 12f * zoomLevel,
                    center = Offset(destX, destY)
                )
                drawCircle(
                    color = Color.Black,
                    radius = 4f * zoomLevel,
                    center = Offset(destX, destY)
                )
            }

            // User Location Radar Pulse Rings
            drawCircle(
                color = ElectricCyan.copy(alpha = radarAlpha),
                radius = radarPulse * zoomLevel,
                center = Offset(cx, cy)
            )

            // Inner Core Beacon
            drawCircle(
                color = CyberIndigo.copy(alpha = 0.45f),
                radius = 22f * zoomLevel,
                center = Offset(cx, cy)
            )
            drawCircle(
                color = ElectricCyan,
                radius = 12f * zoomLevel,
                center = Offset(cx, cy)
            )
            drawCircle(
                color = Color.White,
                radius = 6f * zoomLevel,
                center = Offset(cx, cy)
            )

            // Directional Chevron
            val chevronAngle = Math.toRadians(-45.0)
            val chevronLen = 14f * zoomLevel
            val tipX = cx + (chevronLen * cos(chevronAngle)).toFloat()
            val tipY = cy + (chevronLen * sin(chevronAngle)).toFloat()

            drawLine(
                color = Color.White,
                start = Offset(cx, cy),
                end = Offset(tipX, tipY),
                strokeWidth = 3f * zoomLevel
            )
        }

        // Top Telemetry HUD
        Row(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(10.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(DarkSurface.copy(alpha = 0.9f))
                .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                .padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(NeonGreen)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "GPS LOCK",
                color = Color.White,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "37.8024, -122.4665",
                color = TextSecondary,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace
            )
        }

        // Theme Switcher Button
        IconButton(
            onClick = {
                val values = MapTileTheme.entries
                tileTheme = values[(tileTheme.ordinal + 1) % values.size]
            },
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(10.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(DarkSurface.copy(alpha = 0.9f))
                .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                .size(36.dp)
                .testTag("map_theme_toggle")
        ) {
            Icon(
                imageVector = Icons.Default.Layers,
                contentDescription = "Switch Map Theme",
                tint = CyberIndigoBright,
                modifier = Modifier.size(20.dp)
            )
        }

        // Zoom & Recenter controls
        Column(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(12.dp)
        ) {
            IconButton(
                onClick = {
                    isFollowing = true
                    offsetX = 0f
                    offsetY = 0f
                },
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isFollowing) CyberIndigo else DarkSurface.copy(alpha = 0.9f))
                    .border(1.dp, if (isFollowing) CyberIndigoBright else DarkCardBorder, RoundedCornerShape(12.dp))
                    .testTag("recenter_button")
            ) {
                Icon(
                    imageVector = Icons.Default.MyLocation,
                    contentDescription = "Center on E-Bike",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            IconButton(
                onClick = { zoomLevel = (zoomLevel * 1.25f).coerceAtMost(3.0f) },
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkSurface.copy(alpha = 0.9f))
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                    .testTag("zoom_in_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Zoom In",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            IconButton(
                onClick = { zoomLevel = (zoomLevel / 1.25f).coerceAtLeast(0.5f) },
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkSurface.copy(alpha = 0.9f))
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(12.dp))
                    .testTag("zoom_out_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Remove,
                    contentDescription = "Zoom Out",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        // Re-center banner when dragged
        if (!isFollowing) {
            Button(
                onClick = {
                    isFollowing = true
                    offsetX = 0f
                    offsetY = 0f
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyberIndigo),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp)
                    .testTag("recenter_banner_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Navigation,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Re-center on E-Bike",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
