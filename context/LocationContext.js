import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
    const [location, setLocation] = useState({
        city: "Select Location",
        pincode: "",
        isDetected: false
    });

    // Load saved location on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            setLocation(JSON.parse(savedLocation));
        }
    }, []);

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Use OpenStreetMap Nominatim API for reverse geocoding (Free & No Key required)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    // Improved address parsing priority
                    const address = data.address;
                    const city = address.city || address.town || address.suburb || address.village || address.neighbourhood || address.county || "Unknown Location";
                    const pincode = address.postcode || "";

                    // Create a more descriptive formatted address
                    const fullAddress = [address.suburb, address.city, address.state]
                        .filter(Boolean)
                        .join(", ");

                    const detectedLoc = {
                        city, // Main display name
                        fullAddress, // More detailed context
                        pincode,
                        isDetected: true
                    };
                    updateLocation(detectedLoc);
                } catch (error) {
                    console.error("Error detecting location:", error);
                    alert("Failed to fetch address details.");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please check browser permissions.");
            }
        );
    };

    return (
        <LocationContext.Provider value={{ location, updateLocation, detectLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    return useContext(LocationContext);
}
