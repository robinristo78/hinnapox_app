// This file acts as a proxy.
// Metro Bundler will automatically pick:
// 1. components/MapScreen.web.tsx (for Web)
// 2. components/MapScreen.tsx (for iOS/Android)

import MapScreen from 'components/MapScreen';

export default MapScreen;