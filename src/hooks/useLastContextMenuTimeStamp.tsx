import { useState } from 'react';
import { useGlobalContextMenu } from './'

function useLastContextMenuTimeStamp() {

	const [ lastContextMenuTimeStamp, setLastContextMenuTimeStamp ] = useState(0)

	useGlobalContextMenu(e => setLastContextMenuTimeStamp(e.timeStamp))

	return lastContextMenuTimeStamp
}

export default useLastContextMenuTimeStamp;