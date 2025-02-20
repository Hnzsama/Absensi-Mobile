export const getTimeComparison = () => {
    const deviceTime = new Date();
    
    // Get WIB time (UTC+7)
    const wibTime = new Date(deviceTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    
    // Get time difference in minutes
    const timeDiff = Math.abs(deviceTime.getTime() - wibTime.getTime());
    const diffMinutes = Math.round(timeDiff / (1000 * 60));
    
    return {
        deviceTime,
        wibTime,
        timeDiff,
        diffMinutes,
        isInSync: diffMinutes <= 5, // Consider in sync if difference is 5 minutes or less
        deviceTimeString: deviceTime.toLocaleTimeString('id-ID'),
        wibTimeString: wibTime.toLocaleTimeString('id-ID'),
    };
};

export const formatWIBTime = (date: Date): string => {
    return date.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
    });
};
