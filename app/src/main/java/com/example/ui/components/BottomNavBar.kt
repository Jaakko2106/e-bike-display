package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.DisplayMode
import com.example.ui.theme.CyberIndigo
import com.example.ui.theme.CyberIndigoBright
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.TextSecondary

private data class NavItem(
    val mode: DisplayMode,
    val label: String,
    val icon: ImageVector,
    val tag: String
)

@Composable
fun BottomNavBar(
    currentMode: DisplayMode,
    onModeSelected: (DisplayMode) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavItem(DisplayMode.DASHBOARD, "Dash", Icons.Default.Speed, "nav_dash"),
        NavItem(DisplayMode.TRIP, "Trip", Icons.Default.AccessTime, "nav_trip"),
        NavItem(DisplayMode.MAP, "Nav", Icons.Default.Map, "nav_map"),
        NavItem(DisplayMode.MUSIC, "Music", Icons.Default.MusicNote, "nav_music"),
        NavItem(DisplayMode.SETTINGS, "Setup", Icons.Default.Settings, "nav_settings")
    )

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(DarkSurface.copy(alpha = 0.95f))
            .padding(vertical = 6.dp, horizontal = 4.dp)
            .testTag("bottom_nav_bar"),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        items.forEach { item ->
            val isSelected = currentMode == item.mode
            Column(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onModeSelected(item.mode) }
                    .padding(horizontal = 14.dp, vertical = 6.dp)
                    .testTag(item.tag),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = item.icon,
                    contentDescription = item.label,
                    tint = if (isSelected) CyberIndigoBright else TextSecondary,
                    modifier = Modifier.size(24.dp)
                )
                Text(
                    text = item.label,
                    color = if (isSelected) Color.White else TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                )
            }
        }
    }
}
