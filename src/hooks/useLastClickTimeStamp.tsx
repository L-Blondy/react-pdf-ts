import { useState } from 'react';
import { useGlobalClick } from './'

function useLastClickTimeStamp() {

	const [ lastClickTimeStamp, setLastClickTimeStamp ] = useState(0)

	useGlobalClick(e => setLastClickTimeStamp(e.timeStamp))

	return lastClickTimeStamp
}

export default useLastClickTimeStamp;