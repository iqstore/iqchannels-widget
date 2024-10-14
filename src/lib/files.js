export function imageSize (image) {
	return new Promise((resolve, reject) => {
		try {
			const fileReader = new FileReader()

			fileReader.onload = () => {
				const img = new Image()

				img.onload = () => {
					resolve({ width: img.width, height: img.height })
				}

				img.src = fileReader.result
			}

			fileReader.onloadend = () => {
				console.log("END")
			}

			fileReader.readAsDataURL(image)
		} catch (e) {
			reject(e)
		}
	})
}
