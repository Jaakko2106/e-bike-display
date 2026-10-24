package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = CyberIndigo,
    onPrimary = TextPrimary,
    primaryContainer = CyberIndigoDark,
    onPrimaryContainer = ElectricCyan,
    secondary = ElectricCyan,
    onSecondary = DarkBackground,
    secondaryContainer = ElectricCyanDark,
    onSecondaryContainer = TextPrimary,
    tertiary = AlertAmber,
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceElevated,
    onSurfaceVariant = TextSecondary,
    outline = DarkCardBorder,
    error = DangerRed
)

@Composable
fun EBikeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
