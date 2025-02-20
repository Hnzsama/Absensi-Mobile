export const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
};

export const findNearestAgency = (
    currentLat: number,
    currentLon: number,
    agencies: Array<{ latitude: string, longitude: string }>,
    allowedRadius: number
) => {
    let nearest = {
        agency: null as any,
        distance: Infinity,
        isWithinRadius: false
    };

    agencies.forEach(agency => {
        const distance = getDistance(
            currentLat,
            currentLon,
            parseFloat(agency.latitude),
            parseFloat(agency.longitude)
        );

        if (distance < nearest.distance) {
            nearest = {
                agency,
                distance,
                isWithinRadius: distance <= allowedRadius
            };
        }
    });

    return nearest;
};
