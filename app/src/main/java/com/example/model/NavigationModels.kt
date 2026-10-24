package com.example.model

enum class TurnType {
    STRAIGHT,
    LEFT,
    RIGHT,
    MERGE,
    ARRIVE
}

data class RouteStep(
    val instruction: String,
    val subText: String? = null,
    val turnType: TurnType,
    val initialDistanceMeters: Float
)

val DEFAULT_ROUTE_STEPS = listOf(
    RouteStep(
        instruction = "Continue straight on Main Trail",
        subText = "Follow protected cycle lane",
        turnType = TurnType.STRAIGHT,
        initialDistanceMeters = 250f
    ),
    RouteStep(
        instruction = "Turn left onto Elm Street",
        subText = "Watch for oncoming bicycle traffic",
        turnType = TurnType.LEFT,
        initialDistanceMeters = 220f
    ),
    RouteStep(
        instruction = "Turn right onto Marina Boulevard",
        subText = "Approaching waterfront junction",
        turnType = TurnType.RIGHT,
        initialDistanceMeters = 180f
    ),
    RouteStep(
        instruction = "Merge onto Highway 101 Cycleway",
        subText = "Yield to merging riders",
        turnType = TurnType.MERGE,
        initialDistanceMeters = 300f
    ),
    RouteStep(
        instruction = "You have arrived at your destination",
        subText = "Destination is on your right",
        turnType = TurnType.ARRIVE,
        initialDistanceMeters = 0f
    )
)

val POPULAR_TRAILS = listOf(
    "Marina Green Path",
    "Golden Gate Viewpoint",
    "Ocean Beach Trail",
    "Presidio Heights"
)
