function stringifiedEqual(v1: any, v2: any) {
	return JSON.stringify(v1) === JSON.stringify(v2)
}

export default stringifiedEqual