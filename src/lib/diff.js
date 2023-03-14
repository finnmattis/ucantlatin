export default function diff(a, b) {
    let changelog = []

    a = a.split("\n")
    b = b.split("\n")

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (i >= a.length) {
            changelog.push([{ type: "insert", val: b[i] }])
        } else if (i >= b.length) {
            changelog.push([{ type: "delete", val: a[i] }])
        } else {
            changelog.push(diffLine(a[i], b[i]))
        }
    }

    return changelog
}

function diffLine(a, b) {
    let changelog = []

    //make array of 0s with extra length because algorithm will look at squares that are 1 index outside of the array
    let dp = Array.from({ length: a.length + 1 }, () =>
        Array.from({ length: b.length + 1 }, () => 0)
    )

    //loop through array from bottom right to top left
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            //if the valacters match, add 1 to the value of the square to the bottom right
            if (a[i] === b[j]) {
                dp[i][j] = dp[i + 1][j + 1] + 1
            } else {
                //if the valacters don't match, take the max of the values of the squares to the right and bottom
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
            }
        }
    }

    //trace back through the array to find the path
    let i = 0
    let j = 0
    while (i < a.length || j < b.length) {
        if (i >= a.length) {
            changelog.push({ type: "insert", val: b[j] })
            j++
        } else if (j >= b.length) {
            changelog.push({ type: "delete", val: a[i] })
            i++
        } else if (a[i] === b[j]) {
            changelog.push({ type: "match", val: a[i] })
            i++
            j++
        } else if (dp[i + 1][j] >= dp[i][j + 1]) {
            changelog.push({ type: "delete", val: a[i] })
            i++
        } else {
            changelog.push({ type: "insert", val: b[j] })
            j++
        }
    }

    return changelog
}
