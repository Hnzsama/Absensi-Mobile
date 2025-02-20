import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { View } from '@/components/ui/view';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface LocationMapProps {
    location: Location.LocationObject | null;
}

export const LocationMap = ({ location }: LocationMapProps) => (
    <VStack>
        {location ? (
            <Box className="h-[200px] rounded-md overflow-hidden">
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    />
                </MapView>
            </Box>
        ) : (
            <Box className="h-[200px] items-center justify-center">
                <Spinner size="large" />
                <Text className="mt-2">Getting location...</Text>
            </Box>
        )}
    </VStack>
);
