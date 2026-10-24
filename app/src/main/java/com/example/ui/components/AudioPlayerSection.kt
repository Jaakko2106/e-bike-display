package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode as AnimRepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bluetooth
import androidx.compose.material.icons.filled.BluetoothDisabled
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.FastRewind
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.RepeatOne
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material.icons.filled.VolumeDown
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.model.RepeatMode
import com.example.model.Track
import com.example.ui.theme.CyberIndigo
import com.example.ui.theme.CyberIndigoBright
import com.example.ui.theme.DarkCardBorder
import com.example.ui.theme.DarkSurface
import com.example.ui.theme.ElectricCyan
import com.example.ui.theme.TextSecondary

@Composable
fun AudioPlayerSection(
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
    var showPlaylist by remember { mutableStateOf(false) }

    fun formatSeconds(sec: Int): String {
        val mins = sec / 60
        val s = sec % 60
        return "$mins:${s.toString().padStart(2, '0')}"
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
            .fillMaxWidth()
            .testTag("audio_player_section")
    ) {
        // Track Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(DarkSurface.copy(alpha = 0.85f))
                .border(1.dp, DarkCardBorder, RoundedCornerShape(24.dp))
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // Album Art
                Box(
                    modifier = Modifier
                        .size(110.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF1F2937))
                        .border(2.dp, CyberIndigo.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    if (isBluetoothConnected && currentTrack.coverUrl.isNotEmpty()) {
                        AsyncImage(
                            model = currentTrack.coverUrl,
                            contentDescription = currentTrack.title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(110.dp)
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.MusicNote,
                            contentDescription = null,
                            tint = if (isBluetoothConnected) CyberIndigoBright else TextSecondary,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = if (isBluetoothConnected) currentTrack.title else "Audio Disconnected",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    maxLines = 1
                )

                Text(
                    text = if (isBluetoothConnected) "${currentTrack.artist} • ${currentTrack.album}" else "Connect Bluetooth helmet / headset",
                    color = if (isBluetoothConnected) CyberIndigoBright else TextSecondary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    modifier = Modifier.padding(top = 2.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Visualizer bars
                if (isPlaying && isBluetoothConnected) {
                    AudioVisualizerBars(modifier = Modifier.height(20.dp))
                } else {
                    Spacer(modifier = Modifier.height(20.dp))
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Status badges: Bluetooth & Playlist toggle
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isBluetoothConnected) CyberIndigo.copy(alpha = 0.2f) else Color(0xFF1F2937))
                            .border(1.dp, if (isBluetoothConnected) CyberIndigo.copy(alpha = 0.5f) else DarkCardBorder, RoundedCornerShape(16.dp))
                            .clickable(onClick = onToggleBluetooth)
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                            .testTag("bluetooth_toggle_button"),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (isBluetoothConnected) Icons.Default.Bluetooth else Icons.Default.BluetoothDisabled,
                            contentDescription = "Bluetooth Status",
                            tint = if (isBluetoothConnected) ElectricCyan else TextSecondary,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isBluetoothConnected) "BT Connected" else "BT Off",
                            color = if (isBluetoothConnected) ElectricCyan else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (showPlaylist) Color(0xFF374151) else Color(0xFF1F2937))
                            .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                            .clickable { showPlaylist = !showPlaylist }
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                            .testTag("playlist_toggle_button"),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.QueueMusic,
                            contentDescription = "Playlist Drawer",
                            tint = ElectricCyan,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Tracks (${playlist.size})",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Playlist Drawer
        AnimatedVisibility(visible = showPlaylist) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkSurface)
                    .border(1.dp, DarkCardBorder, RoundedCornerShape(16.dp))
                    .padding(8.dp)
            ) {
                playlist.forEachIndexed { idx, track ->
                    val isSelected = idx == trackIndex
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) CyberIndigo.copy(alpha = 0.3f) else Color.Transparent)
                            .clickable {
                                onSelectTrack(idx)
                                showPlaylist = false
                            }
                            .padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "${idx + 1}. ",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = track.title,
                                color = if (isSelected) Color.White else TextSecondary,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                        Text(
                            text = "${track.bpm} BPM",
                            color = ElectricCyan,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Scrubber / Progress
        Column(modifier = Modifier.fillMaxWidth()) {
            Slider(
                value = currentTime.toFloat().coerceIn(0f, currentTrack.duration.toFloat()),
                onValueChange = { onSeek(it.toInt()) },
                valueRange = 0f..currentTrack.duration.toFloat(),
                colors = SliderDefaults.colors(
                    thumbColor = CyberIndigoBright,
                    activeTrackColor = CyberIndigo,
                    inactiveTrackColor = Color(0xFF374151)
                ),
                modifier = Modifier.testTag("audio_scrubber")
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = formatSeconds(currentTime),
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = formatSeconds(currentTrack.duration),
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Playback Controls Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onToggleShuffle,
                modifier = Modifier.testTag("audio_shuffle_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Shuffle,
                    contentDescription = "Shuffle",
                    tint = if (isShuffle) CyberIndigoBright else TextSecondary,
                    modifier = Modifier.size(22.dp)
                )
            }

            IconButton(
                onClick = onPrev,
                enabled = isBluetoothConnected,
                modifier = Modifier.testTag("audio_prev_button")
            ) {
                Icon(
                    imageVector = Icons.Default.FastRewind,
                    contentDescription = "Previous Track",
                    tint = if (isBluetoothConnected) Color.White else Color.Gray,
                    modifier = Modifier.size(28.dp)
                )
            }

            Box(
                modifier = Modifier
                    .size(54.dp)
                    .clip(CircleShape)
                    .background(CyberIndigo)
                    .clickable(enabled = isBluetoothConnected, onClick = onTogglePlay)
                    .testTag("audio_play_pause_button"),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Pause" else "Play",
                    tint = Color.White,
                    modifier = Modifier.size(32.dp)
                )
            }

            IconButton(
                onClick = onNext,
                enabled = isBluetoothConnected,
                modifier = Modifier.testTag("audio_next_button")
            ) {
                Icon(
                    imageVector = Icons.Default.FastForward,
                    contentDescription = "Next Track",
                    tint = if (isBluetoothConnected) Color.White else Color.Gray,
                    modifier = Modifier.size(28.dp)
                )
            }

            IconButton(
                onClick = onToggleRepeat,
                modifier = Modifier.testTag("audio_repeat_button")
            ) {
                Icon(
                    imageVector = when (repeatMode) {
                        RepeatMode.ONE -> Icons.Default.RepeatOne
                        else -> Icons.Default.Repeat
                    },
                    contentDescription = "Repeat",
                    tint = if (repeatMode != RepeatMode.NONE) CyberIndigoBright else TextSecondary,
                    modifier = Modifier.size(22.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Volume Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onToggleMute,
                modifier = Modifier.size(32.dp).testTag("audio_mute_button")
            ) {
                Icon(
                    imageVector = if (isMuted) Icons.Default.VolumeMute else Icons.Default.VolumeDown,
                    contentDescription = "Toggle Mute",
                    tint = if (isMuted) CyberIndigoBright else TextSecondary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Slider(
                value = if (isMuted) 0f else volume.toFloat(),
                onValueChange = { onVolumeChange(it.toInt()) },
                valueRange = 0f..100f,
                colors = SliderDefaults.colors(
                    thumbColor = CyberIndigoBright,
                    activeTrackColor = ElectricCyan,
                    inactiveTrackColor = Color(0xFF374151)
                ),
                modifier = Modifier
                    .weight(1f)
                    .testTag("audio_volume_slider")
            )

            Icon(
                imageVector = Icons.Default.VolumeUp,
                contentDescription = null,
                tint = TextSecondary,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

@Composable
fun AudioVisualizerBars(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "audio_visualizer")
    val heights = List(16) { i ->
        infiniteTransition.animateFloat(
            initialValue = 4f,
            targetValue = (12f + (i % 5) * 4f),
            animationSpec = infiniteRepeatable(
                animation = tween(250 + (i * 35), easing = FastOutSlowInEasing),
                repeatMode = AnimRepeatMode.Reverse
            ),
            label = "bar_$i"
        )
    }

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(3.dp),
        verticalAlignment = Alignment.Bottom
    ) {
        heights.forEach { h ->
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(h.value.dp)
                    .clip(RoundedCornerShape(1.5.dp))
                    .background(ElectricCyan)
            )
        }
    }
}
