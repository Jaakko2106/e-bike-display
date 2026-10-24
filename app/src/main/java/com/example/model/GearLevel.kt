package com.example.model

enum class GearLevel(
    val displayName: String,
    val acceleration: Float,
    val drainRate: Float
) {
    OFF("OFF", 0.0f, 0.0f),
    ECO("ECO", 1.0f, 0.005f),
    TOUR("TOUR", 2.0f, 0.01f),
    SPORT("SPORT", 3.5f, 0.02f),
    TURBO("TURBO", 5.0f, 0.04f);

    fun next(): GearLevel {
        val values = entries
        val nextIdx = (ordinal + 1) % values.size
        return values[nextIdx]
    }
}
