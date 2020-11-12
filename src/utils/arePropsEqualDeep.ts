import { stringifiedEqual } from 'src/utils'
import isDeeplyEqual from 'react-fast-compare'

function arePropsEqualDeep<T>(prevProps: T, nextProps: T) {

	for (let key in nextProps) {
		const prevProp = prevProps[ key as keyof T ]
		const nextProp = nextProps[ key as keyof T ]
		const propType = typeof prevProp
		let hasPropChanged: boolean = false
		//Objects should not be compared with JSON.stringify
		if (propType === 'object')
			hasPropChanged = !isDeeplyEqual(prevProp, nextProp)
		else
			hasPropChanged = !stringifiedEqual(prevProp, nextProp)

		if (hasPropChanged)
			return false
	}
	return true
}

export default arePropsEqualDeep