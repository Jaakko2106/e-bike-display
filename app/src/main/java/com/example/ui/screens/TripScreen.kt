package com.example.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.DirectionsBike
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.ui.components.MetricCard

@Composable
fun TripScreen(
    tripDistance: Float,
    odometer: Float,
    tripDurationFormatted: String,
    averageSpeedFormatted: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(12.dp)
            .testTag("trip_screen"),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            MetricCard(
                icon = Icons.Default.DirectionsBike,
                label = "Trip Distance",
                value = String.format("%.2f", tripDistance),
                unit = "KM",
                modifier = Modifier.weight(1f)
            )

            MetricCard(
                icon = Icons.Default.TrendingUp,
                label = "Odometer",
                value = String.format("%.0f", odometer),
                unit = "KM",
                modifier = Modifier.weight(1f)
            )
        }

        MetricCard(
            icon = Icons.Default.AccessTime,
            label = "Trip Duration",
            value = tripDurationFormatted,
            unit = "",
            large = true,
            modifier = Modifier.fillMaxWidth()
        )

        MetricCard(
            icon = Icons.Default.Bolt,
            label = "Average Speed",
            value = averageSpeedFormatted,
            unit = "KM/H",
            modifier = Modifier.fillMaxWidth()
        )
    }
}
