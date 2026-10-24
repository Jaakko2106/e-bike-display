package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.Merge
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.TurnLeft
import androidx.compose.material.icons.filled.TurnRight
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.POPULAR_TRAILS
import com.example.model.RouteStep
import com.example.model.TurnType
import com.example.ui.components.InteractiveMapCanvas
import com.example.ui.theme.AlertAmber
import com.example.ui.theme.AlertAmberDark
import com.example.ui.theme.CyberIndigo
import com.example.ui.theme.CyberIndigoBright
import com.example.ui.theme.DangerRed
import com.example.ui.theme.DarkCardBorder
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.ElectricCyan
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.TextSecondary

@Composable
fun MapScreen(
    isNavigating: Boolean,
    destination: String,
    currentStep: RouteStep,
    nextStep: RouteStep?,
    distanceToNextTurn: Float,
    onDestinationChange: (String) -> Unit,
    onStartRoute: () -> Unit,
    onEndRoute: () -> Unit,
    onCycleDirection: () -> Unit,
    onTest85mAlert: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isWithin100m = distanceToNextTurn <= 100f && distanceToNextTurn > 0f
    val roundedDist = distanceToNextTurn.toInt().coerceAtLeast(0)

    fun formatDistance(meters: Float): String {
        return if (meters < 1000f) {
            "${meters.toInt()} M"
        } else {
            String.format("%.1f KM", meters / 1000f)
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(10.dp)
            .testTag("map_screen")
    ) {
        if (!isNavigating) {
            // Search Input Bar
            OutlinedTextField(
                value = destination,
                onValueChange = onDestinationChange,
                placeholder = { Text("Enter destination or cycle point...", color = TextSecondary, fontSize = 13.sp) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = CyberIndigoBright,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (destination.isNotEmpty()) {
                        IconButton(onClick = { onDestinationChange("") }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear",
                                tint = TextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberIndigo,
                    unfocusedBorderColor = DarkCardBorder,
                    focusedContainerColor = DarkSurface,
                    unfocusedContainerColor = DarkSurface,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("destination_input")
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Popular bike trails chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Trails: ",
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(end = 6.dp)
                )

                POPULAR_TRAILS.forEach { trail ->
                    val isSelected = destination == trail
                    Box(
                        modifier = Modifier
                            .padding(end = 6.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) CyberIndigo else DarkSurface)
                            .border(1.dp, if (isSelected) CyberIndigoBright else DarkCardBorder, RoundedCornerShape(12.dp))
                            .clickable { onDestinationChange(trail) }
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = trail,
                            color = if (isSelected) Color.White else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }

        // Interactive Map
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            InteractiveMapCanvas(
                destination = if (isNavigating) destination else null,
                modifier = Modifier.fillMaxSize()
            )

            if (isNavigating) {
                // Top HUD Directions Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.TopCenter)
                        .clip(RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp))
                        .background(
                            if (isWithin100m) AlertAmberDark.copy(alpha = 0.95f)
                            else DarkSurface.copy(alpha = 0.95f)
                        )
                        .border(
                            1.dp,
                            if (isWithin100m) AlertAmber else CyberIndigo,
                            RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp)
                        )
                        .padding(12.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "DEST: $destination",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                maxLines = 1,
                                modifier = Modifier.weight(1f, fill = false)
                            )

                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isWithin100m) AlertAmber else ElectricCyan.copy(alpha = 0.2f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                if (isWithin100m) {
                                    Icon(
                                        imageVector = Icons.Default.Warning,
                                        contentDescription = null,
                                        tint = Color.Black,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Spacer(modifier = Modifier.width(3.dp))
                                }
                                Text(
                                    text = "NEXT TURN IN ${formatDistance(distanceToNextTurn)}",
                                    color = if (isWithin100m) Color.Black else ElectricCyan,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            val turnIcon = when (currentStep.turnType) {
                                TurnType.LEFT -> Icons.Default.TurnLeft
                                TurnType.RIGHT -> Icons.Default.TurnRight
                                TurnType.STRAIGHT -> Icons.Default.Navigation
                                TurnType.MERGE -> Icons.AutoMirrored.Filled.Merge
                                TurnType.ARRIVE -> Icons.Default.CheckCircle
                            }
                            Icon(
                                imageVector = turnIcon,
                                contentDescription = null,
                                tint = if (currentStep.turnType == TurnType.ARRIVE) NeonGreen else AlertAmber,
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = currentStep.instruction,
                                color = Color.White,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1
                            )
                        }

                        if (!currentStep.subText.isNullOrEmpty()) {
                            Text(
                                text = currentStep.subText,
                                color = TextSecondary,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(start = 30.dp)
                            )
                        }
                    }
                }

                // Bottom Route Actions HUD
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .padding(10.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkSurface.copy(alpha = 0.95f))
                        .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Next Intersection: ${roundedDist}m",
                                color = if (isWithin100m) AlertAmber else ElectricCyan,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )

                            // Quick test button for 85m alert
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(AlertAmber.copy(alpha = 0.2f))
                                    .border(1.dp, AlertAmber.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                    .clickable(onClick = onTest85mAlert)
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                                    .testTag("test_85m_alert_button")
                            ) {
                                Text(
                                    text = "Test 85m Alert",
                                    color = AlertAmber,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = onEndRoute,
                                colors = ButtonDefaults.buttonColors(containerColor = DangerRed),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("end_route_button")
                            ) {
                                Text("End", fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = onCycleDirection,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isWithin100m) AlertAmber else CyberIndigo
                                ),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(2f)
                                    .testTag("next_direction_button")
                            ) {
                                Text(
                                    text = nextStep?.let { "Next: ${it.instruction}" } ?: "Arrived!",
                                    color = if (isWithin100m) Color.Black else Color.White,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1
                                )
                            }
                        }
                    }
                }
            }
        }

        if (!isNavigating) {
            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = onStartRoute,
                enabled = destination.isNotBlank(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyberIndigo,
                    disabledContainerColor = DarkSurface
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .testTag("start_route_button")
            ) {
                Text(
                    text = if (destination.isNotBlank()) "Start Route to $destination" else "Start Route",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }
    }
}
