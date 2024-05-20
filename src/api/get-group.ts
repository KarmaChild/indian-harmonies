const API_ENDPOINT: string = "getGroup"
export const getGroup = async (day: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = {
                day: day
            }

            const url = `https://us-central1-indian-harmonies.cloudfunctions.net/${API_ENDPOINT}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const groupData = await response.json()

            console.log("response:", groupData)
            resolve(groupData)
        } catch (error) {
            console.error("Error:", error)
            reject(error)
        }
    })
}
