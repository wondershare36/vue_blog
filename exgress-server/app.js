const express = require('express')
const app = express()
const port = 8001
const compression = require('compression');

app.use(compression())//一定要写到静态资源托管之前
app.use(express.static("./dist"))
app.use("/front",express.static("./dist1"))
app.use(express.static("./dist2"))

app.listen(port, () => {
  console.log(`server running at http://127.0.0.1:${port}`);
})