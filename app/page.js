"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  TrafficLayer,
  Polyline,
} from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  Search,
  Navigation,
  Car,
  Bike,
  MapPin,
  Clock,
  Star,
  Home,
  Building,
  X,
  MoreHorizontal,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

const libraries = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
}

const center = {
  lat: 10.8505,
  lng: 76.2711,
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

export default function GoogleMapsClone() {
  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [directions, setDirections] = useState(null)
  const [travelMode, setTravelMode] = useState("DRIVING")
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [showDirections, setShowDirections] = useState(false)
  const [showTraffic, setShowTraffic] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileBottomSheetHeight, setMobileBottomSheetHeight] = useState("h-1/3")
  const [recentSearches, setRecentSearches] = useState([
    "Chettupuzha, Thrissur, Kerala 680012",
    "Cotolore Enterprises LLP Bldg No: 15, Peringala...",
    "Kanjany Kerala",
    "Manaloor Village Office Anavalav, Manalur, Ker...",
    "JAS MEDICALS Kanjany, Kerala",
    "Infopark Campus Kochi, Kerala",
    "Rashpal Malakhauvada Kannala Vetaranapally...",
  ])
  const [savedPlaces, setSavedPlaces] = useState([
    { name: "Home", address: "Chettupuzha, Thrissur, Kerala 680...", icon: Home },
    { name: "Cotolore Enterprises", address: "", icon: Building },
  ])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchMarkers, setSearchMarkers] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [trafficPolylines, setTrafficPolylines] = useState([])
  const [startLocationCoords, setStartLocationCoords] = useState(null)
  const [endLocationCoords, setEndLocationCoords] = useState(null)

  const autocompleteRef = useRef(null)
  const startAutocompleteRef = useRef(null)
  const endAutocompleteRef = useRef(null)

  const onLoad = useCallback((map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(pos)
          if (map) {
            map.setCenter(pos)
          }
        },
        () => {
          console.log("Error: The Geolocation service failed.")
        },
      )
    }
  }, [map])

  const handleSearch = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()

      // Check if place exists and has geometry
      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        map.setCenter(location)
        map.setZoom(15)

        // Add marker for searched location
        const newMarker = {
          position: location,
          title: place.name || place.formatted_address || "Selected Location",
          id: Date.now(),
        }
        setSearchMarkers([newMarker])

        // Add to recent searches
        if (place.formatted_address && !recentSearches.includes(place.formatted_address)) {
          setRecentSearches((prev) => [place.formatted_address, ...prev.slice(0, 6)])
        }

        // Close mobile menu after search
        setIsMobileMenuOpen(false)
      } else {
        // If no valid place, try to geocode the search value
        if (searchValue && isLoaded && window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ address: searchValue }, (results, status) => {
            if (status === "OK" && results[0]) {
              const location = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              }
              map.setCenter(location)
              map.setZoom(15)

              // Add marker for searched location
              const newMarker = {
                position: location,
                title: searchValue,
                id: Date.now(),
              }
              setSearchMarkers([newMarker])

              // Add to recent searches
              if (!recentSearches.includes(searchValue)) {
                setRecentSearches((prev) => [searchValue, ...prev.slice(0, 6)])
              }

              // Close mobile menu after search
              setIsMobileMenuOpen(false)
            } else {
              alert("Location not found. Please try a different search.")
            }
          })
        }
      }
    }
  }

  const createTrafficAwarePolylines = (route) => {
    if (!route || !route.overview_path) return []

    const path = route.overview_path
    const polylines = []

    // Create segments for traffic visualization
    const segmentLength = Math.max(1, Math.ceil(path.length / 8))

    for (let i = 0; i < path.length - 1; i += segmentLength) {
      const segmentEnd = Math.min(i + segmentLength, path.length - 1)
      const segmentPath = path.slice(i, segmentEnd + 1).map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }))

      if (segmentPath.length < 2) continue

      // Simulate different traffic conditions
      let color = "#4285F4" // Default blue
      let weight = 6

      // Simulate traffic based on segment position
      const trafficLevel = Math.random()
      if (trafficLevel > 0.7) {
        color = "#EA4335" // Red for heavy traffic
        weight = 8
      } else if (trafficLevel > 0.4) {
        color = "#4285F4" // Blue for moderate traffic
        weight = 7
      } else {
        color = "#4285F4" // Blue for light traffic
        weight = 6
      }

      polylines.push({
        path: segmentPath,
        options: {
          strokeColor: color,
          strokeWeight: weight,
          strokeOpacity: 0.8,
          zIndex: 1000,
        },
        id: `traffic-${i}`,
      })
    }

    return polylines
  }

  // Helper function to geocode an address and return coordinates
  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps) {
        reject(new Error("Google Maps not loaded"))
        return
      }

      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }

  const calculateRoute = async () => {
    if (!startLocation || !endLocation || !isLoaded || !window.google?.maps) {
      alert("Please enter both start and destination locations.")
      return
    }

    try {
      const directionsService = new window.google.maps.DirectionsService()

      // Prepare origin
      let origin
      if (startLocation === "Your location") {
        if (!currentLocation) {
          alert("Current location not available. Please enable location services.")
          return
        }
        origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)
      } else if (startLocationCoords) {
        origin = new window.google.maps.LatLng(startLocationCoords.lat, startLocationCoords.lng)
      } else {
        // Try to geocode the start location
        try {
          const coords = await geocodeAddress(startLocation)
          setStartLocationCoords(coords)
          origin = new window.google.maps.LatLng(coords.lat, coords.lng)
        } catch (error) {
          alert("Could not find the starting location. Please check the address and try again.")
          return
        }
      }

      // Prepare destination
      let destination
      if (endLocation === "Your location") {
        if (!currentLocation) {
          alert("Current location not available. Please enable location services.")
          return
        }
        destination = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng)
      } else if (endLocationCoords) {
        destination = new window.google.maps.LatLng(endLocationCoords.lat, endLocationCoords.lng)
      } else {
        // Try to geocode the end location
        try {
          const coords = await geocodeAddress(endLocation)
          setEndLocationCoords(coords)
          destination = new window.google.maps.LatLng(coords.lat, coords.lng)
        } catch (error) {
          alert("Could not find the destination. Please check the address and try again.")
          return
        }
      }

      // Validate that we have valid locations
      if (!origin || !destination) {
        alert("Please enter valid start and destination locations.")
        return
      }

      // Calculate route
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode[travelMode],
          avoidHighways: false,
          avoidTolls: false,
          provideRouteAlternatives: true,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess",
          },
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result)

            // Create traffic-aware polylines if traffic is enabled
            if (showTraffic) {
              const trafficLines = createTrafficAwarePolylines(result.routes[0])
              setTrafficPolylines(trafficLines)
            } else {
              setTrafficPolylines([])
            }

            // Extract route information
            const route = result.routes[0]
            const leg = route.legs[0]
            setRouteInfo({
              distance: leg.distance.text,
              duration: leg.duration.text,
              durationInTraffic: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
            })
          } else {
            setRouteInfo(null)
            setTrafficPolylines([])

            // Provide specific error messages based on status
            let errorMessage = "Could not find directions between these locations."

            switch (status) {
              case "ZERO_RESULTS":
                errorMessage =
                  "No route could be found between these locations. Please try different addresses or check if they are accessible by the selected travel mode."
                break
              case "NOT_FOUND":
                errorMessage =
                  "One or both locations could not be found. Please check the spelling and try again with more specific addresses."
                break
              case "OVER_QUERY_LIMIT":
                errorMessage = "Too many requests. Please try again in a moment."
                break
              case "REQUEST_DENIED":
                errorMessage = "Directions request was denied. Please check your API key configuration."
                break
              case "INVALID_REQUEST":
                errorMessage = "Invalid request. Please check your start and destination locations."
                break
              case "MAX_WAYPOINTS_EXCEEDED":
                errorMessage = "Too many waypoints in the request."
                break
              case "MAX_ROUTE_LENGTH_EXCEEDED":
                errorMessage = "The requested route is too long."
                break
              default:
                errorMessage = `Directions request failed: ${status}. Please try again with different locations.`
            }

            console.error("Directions request failed:", { status, startLocation, endLocation })
            alert(errorMessage)
          }
        },
      )
    } catch (error) {
      console.error("Error calculating route:", error)
      alert("An error occurred while calculating the route. Please try again.")
    }
  }

  // Update traffic polylines when traffic toggle changes
  useEffect(() => {
    if (directions) {
      if (showTraffic) {
        const trafficLines = createTrafficAwarePolylines(directions.routes[0])
        setTrafficPolylines(trafficLines)
      } else {
        setTrafficPolylines([])
      }
    }
  }, [showTraffic, directions])

  const handleStartLocationSelect = () => {
    if (startAutocompleteRef.current) {
      const place = startAutocompleteRef.current.getPlace()

      if (place && place.geometry && place.geometry.location) {
        const coords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setStartLocationCoords(coords)

        if (place.formatted_address) {
          setStartLocation(place.formatted_address)
        } else {
          setStartLocation(`${coords.lat},${coords.lng}`)
        }

        // Auto-calculate route if end location exists
        if (endLocation) {
          setTimeout(() => calculateRoute(), 100)
        }
      }
    }
  }

  const handleEndLocationSelect = () => {
    if (endAutocompleteRef.current) {
      const place = endAutocompleteRef.current.getPlace()

      if (place && place.geometry && place.geometry.location) {
        const coords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setEndLocationCoords(coords)

        if (place.formatted_address) {
          setEndLocation(place.formatted_address)
        } else {
          setEndLocation(`${coords.lat},${coords.lng}`)
        }

        // Auto-calculate route if start location exists
        if (startLocation) {
          setTimeout(() => calculateRoute(), 100)
        }
      }
    }
  }

  const directionsOptions = {
    polylineOptions: {
      strokeColor: showTraffic ? "transparent" : "#4285F4", // Hide default polyline when showing traffic
      strokeWeight: showTraffic ? 0 : 6,
      strokeOpacity: showTraffic ? 0 : 0.8,
    },
    suppressMarkers: false,
    preserveViewport: false,
    draggable: false,
  }

  const handleRecentSearchClick = (search) => {
    setSearchValue(search)
    if (!isLoaded || !window.google?.maps) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: search }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        }
        map.setCenter(location)
        map.setZoom(15)

        // Add marker for searched location
        const newMarker = {
          position: location,
          title: search,
          id: Date.now(),
        }
        setSearchMarkers([newMarker])
      }
    })
  }

  const handleSavedPlaceClick = (place) => {
    if (place.address && isLoaded && window.google?.maps) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: place.address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          }
          map.setCenter(location)
          map.setZoom(15)

          // Add marker for searched location
          const newMarker = {
            position: location,
            title: place.name,
            id: Date.now(),
          }
          setSearchMarkers([newMarker])
        }
      })
    }
  }

  const toggleBottomSheetHeight = () => {
    setMobileBottomSheetHeight((prev) => (prev === "h-1/3" ? "h-2/3" : prev === "h-2/3" ? "h-16" : "h-1/3"))
  }

  const clearDirections = () => {
    setDirections(null)
    setStartLocation("")
    setEndLocation("")
    setRouteInfo(null)
    setTrafficPolylines([])
    setStartLocationCoords(null)
    setEndLocationCoords(null)
  }

  return (
    <div className="flex h-screen relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={() => setIsLoaded(true)}
      >
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 bg-white border-r border-gray-200 flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-lg">Maps</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handleSearch}
              >
                <Input
                  placeholder="Search Google Maps"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </Autocomplete>
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1" onClick={handleSearch}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>

            {/* Current Location Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 flex items-center gap-2"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      }
                      setCurrentLocation(pos)
                      if (map) {
                        map.setCenter(pos)
                        map.setZoom(15)
                      }
                    },
                    () => {
                      alert("Error: Unable to get your location.")
                    },
                  )
                }
              }}
            >
              <div className="text-lg">📍</div>
              Your location
            </Button>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                variant={showDirections ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setShowDirections(!showDirections)}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
              <Button variant="outline" size="sm">
                Restaurants
              </Button>
              <Button variant="outline" size="sm">
                Hotels
              </Button>
            </div>
          </div>

          {/* Directions Panel */}
          {showDirections && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={travelMode === "DRIVING" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTravelMode("DRIVING")}
                >
                  <Car className="w-4 h-4" />
                </Button>
                <Button
                  variant={travelMode === "TRANSIT" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTravelMode("TRANSIT")}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
                <Button
                  variant={travelMode === "WALKING" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTravelMode("WALKING")}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
                <Button
                  variant={travelMode === "BICYCLING" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTravelMode("BICYCLING")}
                >
                  <Bike className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowDirections(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2 flex items-center gap-2"
                  onClick={() => {
                    if (currentLocation) {
                      setStartLocation("Your location")
                      setStartLocationCoords(currentLocation)
                      if (endLocation) {
                        setTimeout(() => calculateRoute(), 100)
                      }
                    } else {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                          }
                          setCurrentLocation(pos)
                          setStartLocation("Your location")
                          setStartLocationCoords(pos)
                          if (endLocation) {
                            setTimeout(() => calculateRoute(), 100)
                          }
                        },
                        () => {
                          alert("Error: Unable to get your location.")
                        },
                      )
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Use current location as start
                </Button>

                <div className="relative">
                  <div className="absolute left-3 top-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <Autocomplete
                    onLoad={(autocomplete) => (startAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={handleStartLocationSelect}
                  >
                    <Input
                      placeholder="Choose starting point"
                      value={startLocation}
                      onChange={(e) => {
                        setStartLocation(e.target.value)
                        setStartLocationCoords(null) // Clear cached coordinates when manually typing
                      }}
                      className="pl-8"
                    />
                  </Autocomplete>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-3 w-2 h-2 bg-red-500 rounded-full"></div>
                  <Autocomplete
                    onLoad={(autocomplete) => (endAutocompleteRef.current = autocomplete)}
                    onPlaceChanged={handleEndLocationSelect}
                  >
                    <Input
                      placeholder="Choose your destination"
                      value={endLocation}
                      onChange={(e) => {
                        setEndLocation(e.target.value)
                        setEndLocationCoords(null) // Clear cached coordinates when manually typing
                      }}
                      className="pl-8"
                    />
                  </Autocomplete>
                </div>

                {routeInfo && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">{routeInfo.durationInTraffic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">{routeInfo.distance}</span>
                      </div>
                    </div>
                    {routeInfo.durationInTraffic !== routeInfo.duration && (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Traffic delays detected</span>
                      </div>
                    )}
                    {showTraffic && (
                      <div className="mt-2 text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-blue-500 rounded"></div>
                            <span>Light</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-blue-500 rounded"></div>
                            <span>Moderate</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-red-500 rounded"></div>
                            <span>Heavy</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button className="flex-1" onClick={calculateRoute} disabled={!startLocation || !endLocation}>
                  Get Directions
                </Button>
                <Button variant="outline" onClick={clearDirections}>
                  Clear
                </Button>
              </div>

              {/* Traffic Toggle */}
              <div className="mt-3">
                <Button
                  variant={showTraffic ? "default" : "outline"}
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => setShowTraffic(!showTraffic)}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {showTraffic ? "Hide Traffic" : "Show Traffic"}
                </Button>
              </div>

              {/* Recent Searches in Directions Panel */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">Recent</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {recentSearches.slice(0, 4).map((search, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 hover:bg-gray-50 cursor-pointer rounded border"
                      onClick={() => {
                        if (!startLocation) {
                          setStartLocation(search)
                          setStartLocationCoords(null)
                        } else {
                          setEndLocation(search)
                          setEndLocationCoords(null)
                          setTimeout(() => calculateRoute(), 100)
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{search}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved Places */}
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4" />
                <span className="font-medium">Saved</span>
              </div>

              {savedPlaces.map((place, index) => (
                <Card
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSavedPlaceClick(place)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <place.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{place.name}</div>
                        {place.address && <div className="text-xs text-gray-500">{place.address}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Recents</span>
              </div>

              {recentSearches.map((search, index) => (
                <Card
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-sm">{search}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Top Search Bar */}
        <div className="lg:hidden absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handleSearch}
                >
                  <Input
                    placeholder="Search Google Maps"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-8 pr-4 py-2 w-full text-sm"
                  />
                </Autocomplete>
                <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 z-20 ${mobileBottomSheetHeight}`}
        >
          {/* Bottom Sheet Handle */}
          <div className="flex justify-center py-2">
            <Button variant="ghost" size="sm" onClick={toggleBottomSheetHeight} className="p-1">
              {mobileBottomSheetHeight === "h-16" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </Button>
          </div>

          {mobileBottomSheetHeight !== "h-16" && (
            <div className="px-4 pb-4 overflow-y-auto h-full">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={showDirections ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowDirections(!showDirections)}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Restaurants
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Hotels
                </Button>
              </div>

              {/* Current Location Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-4 flex items-center gap-2"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        }
                        setCurrentLocation(pos)
                        if (map) {
                          map.setCenter(pos)
                          map.setZoom(15)
                        }
                      },
                      () => {
                        alert("Error: Unable to get your location.")
                      },
                    )
                  }
                }}
              >
                <div className="text-lg">📍</div>
                Your location
              </Button>

              {/* Directions Panel for Mobile */}
              {showDirections && (
                <div className="mb-4">
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    <Button
                      variant={travelMode === "DRIVING" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTravelMode("DRIVING")}
                      className="flex-shrink-0"
                    >
                      <Car className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={travelMode === "TRANSIT" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTravelMode("TRANSIT")}
                      className="flex-shrink-0"
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={travelMode === "WALKING" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTravelMode("WALKING")}
                      className="flex-shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={travelMode === "BICYCLING" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setTravelMode("BICYCLING")}
                      className="flex-shrink-0"
                    >
                      <Bike className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-3 top-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <Autocomplete
                        onLoad={(autocomplete) => (startAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={handleStartLocationSelect}
                      >
                        <Input
                          placeholder="Starting point"
                          value={startLocation}
                          onChange={(e) => {
                            setStartLocation(e.target.value)
                            setStartLocationCoords(null)
                          }}
                          className="pl-8"
                        />
                      </Autocomplete>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 w-2 h-2 bg-red-500 rounded-full"></div>
                      <Autocomplete
                        onLoad={(autocomplete) => (endAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={handleEndLocationSelect}
                      >
                        <Input
                          placeholder="Destination"
                          value={endLocation}
                          onChange={(e) => {
                            setEndLocation(e.target.value)
                            setEndLocationCoords(null)
                          }}
                          className="pl-8"
                        />
                      </Autocomplete>
                    </div>

                    {routeInfo && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-800">{routeInfo.durationInTraffic}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-800">{routeInfo.distance}</span>
                          </div>
                        </div>
                        {routeInfo.durationInTraffic !== routeInfo.duration && (
                          <div className="flex items-center gap-2 text-xs text-orange-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Traffic delays detected</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={calculateRoute} disabled={!startLocation || !endLocation}>
                        Get Directions
                      </Button>
                      <Button variant="outline" onClick={clearDirections}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Places for Mobile */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Saved</span>
                </div>
                <div className="space-y-2">
                  {savedPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSavedPlaceClick(place)}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <place.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{place.name}</div>
                        {place.address && <div className="text-xs text-gray-500 truncate">{place.address}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Searches for Mobile */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Recent</span>
                </div>
                <div className="space-y-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-sm truncate">{search}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-lg">Maps</span>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Saved Places
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Traffic
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          {!isLoaded && (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          )}
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={mapOptions}
            >
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
            <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
          </svg>
        `),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 32),
                  }}
                />
              )}
              {searchMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  title={marker.title}
                  icon={{
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
        </svg>
      `),
                    scaledSize: new window.google.maps.Size(24, 24),
                  }}
                />
              ))}

              {/* Traffic Layer */}
              {showTraffic && <TrafficLayer />}

              {/* Directions with custom traffic-aware polylines */}
              {directions && <DirectionsRenderer directions={directions} options={directionsOptions} />}

              {/* Custom Traffic Polylines on Route using React Google Maps Polyline component */}
              {trafficPolylines.map((polyline) => (
                <Polyline key={polyline.id} path={polyline.path} options={polyline.options} />
              ))}
            </GoogleMap>
          )}

          {/* Desktop Top Navigation Bar */}
          <div className="hidden lg:block absolute top-4 left-4 right-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center gap-4 flex-1">
                <span className="text-blue-600 font-medium">Restaurants</span>
                <span className="text-gray-600">Hotels</span>
                <span className="text-gray-600">Things to do</span>
                <span className="text-gray-600">Museums</span>
                <span className="text-gray-600">Transit</span>
                <span className="text-gray-600">Pharmacies</span>
              </div>

              <div className="bg-white rounded-full p-2 shadow-md">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  G
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoadScript>
    </div>
  )
}
