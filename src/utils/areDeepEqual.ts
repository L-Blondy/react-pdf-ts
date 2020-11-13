import { stringifiedEqual } from 'src/utils'
import isDeeplyEqual from 'react-fast-compare'

function areDeepEqual<T>(obj1: T, obj2: T) {

	for (let key in obj1) {
		const val1 = obj1[ key as keyof T ]
		const val2 = obj2[ key as keyof T ]
		const valType = typeof val1
		let areDeepEqual: boolean = false
		//Objects should not be compared with JSON.stringify
		if (valType === 'object')
			areDeepEqual = isDeeplyEqual(val1, val2)
		else
			areDeepEqual = stringifiedEqual(val1, val2)

		if (!areDeepEqual)
			return false
	}
	return true
}

export default areDeepEqual