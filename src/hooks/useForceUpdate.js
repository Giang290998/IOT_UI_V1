import { useState } from 'react';

function useForceUpdate() {
    const set = useState(false)[1]
    return () => set((s) => !s)
}

export default useForceUpdate;