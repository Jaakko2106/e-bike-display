package com.example.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.model.RepeatMode
import com.example.model.Track
import com.example.ui.components.AudioPlayerSection

@Composable
fun MusicScreen(
    currentTrack: Track,
    playlist: List<Track>,
    trackIndex: Int,
    isPlaying: Boolean,
    currentTime: Int,
    volume: Int,
    isMuted: Boolean,
    isBluetoothConnected: Boolean,
    isShuffle: Boolean,
    repeatMode: RepeatMode,
    onTogglePlay: () -> Unit,
    onNext: () -> Unit,
    onPrev: () -> Unit,
    onSeek: (Int) -> Unit,
    onVolumeChange: (Int) -> Unit,
    onToggleMute: () -> Unit,
    onToggleShuffle: () -> Unit,
    onToggleRepeat: () -> Unit,
    onToggleBluetooth: () -> Unit,
    onSelectTrack: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .padding(12.dp)
            .testTag("music_screen")
    ) {
        AudioPlayerSection(
            currentTrack = currentTrack,
            playlist = playlist,
            trackIndex = trackIndex,
            isPlaying = isPlaying,
            currentTime = currentTime,
            volume = volume,
            isMuted = isMuted,
            isBluetoothConnected = isBluetoothConnected,
            isShuffle = isShuffle,
            repeatMode = repeatMode,
            onTogglePlay = onTogglePlay,
            onNext = onNext,
            onPrev = onPrev,
            onSeek = onSeek,
            onVolumeChange = onVolumeChange,
            onToggleMute = onToggleMute,
            onToggleShuffle = onToggleShuffle,
            onToggleRepeat = onToggleRepeat,
            onToggleBluetooth = onToggleBluetooth,
            onSelectTrack = onSelectTrack
        )
    }
}
