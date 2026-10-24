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
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.model.GearLevel
import com.example.ui.components.BatteryBar
import com.example.ui.components.MetricCard
import com.example.ui.components.SpeedometerGauge

@Composable
fun DashboardScreen(
    speed: Float,
    gear: GearLevel,
    batteryPercent: Float,
    batteryVoltage: Float,
    isCharging: Boolean,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(12.dp)
            .testTag("dashboard_screen"),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        SpeedometerGauge(
            speed = speed,
            speedUnit = "KM/H",
            modifier = Modifier.weight(1.3f)
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            BatteryBar(
                percent = batteryPercent,
                voltage = batteryVoltage,
                isCharging = isCharging,
                modifier = Modifier.weight(1f)
            )

            MetricCard(
                icon = Icons.Default.Bolt,
                label = "Assist Level",
                value = gear.displayName,
                unit = "",
                modifier = Modifier.weight(1f)
            )
        }
    }
}
