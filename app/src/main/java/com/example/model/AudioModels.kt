package com.example.model

data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val duration: Int, // seconds
    val bpm: Int,
    val genre: String,
    val coverUrl: String
)

enum class RepeatMode {
    NONE,
    ALL,
    ONE;

    fun next(): RepeatMode {
        val values = entries
        val nextIdx = (ordinal + 1) % values.size
        return values[nextIdx]
    }
}

val DEFAULT_PLAYLIST = listOf(
    Track(
        id = "track-1",
        title = "Riding Rhythms",
        artist = "CyberCruise",
        album = "E-Boost Velocity Vol. 1",
        duration = 215,
        bpm = 118,
        genre = "Synthwave / Chillstep",
        coverUrl = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80"
    ),
    Track(
        id = "track-2",
        title = "Motor Melodies",
        artist = "Volt Runner",
        album = "High Torque Soundscapes",
        duration = 184,
        bpm = 124,
        genre = "Electronic Pulse",
        coverUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"
    ),
    Track(
        id = "track-3",
        title = "Trail Tunes",
        artist = "Pedal Dynamics",
        album = "Alpine Ascents",
        duration = 242,
        bpm = 110,
        genre = "Organic Ambient",
        coverUrl = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80"
    ),
    Track(
        id = "track-4",
        title = "E-Boost Bass",
        artist = "Regen Grid",
        album = "Kinetic Drive",
        duration = 198,
        bpm = 130,
        genre = "Future Bass",
        coverUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"
    )
)
