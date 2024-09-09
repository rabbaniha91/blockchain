console.clear();

const path = require("path");
const express = require("express");
const tcpPortUsed = require("tcp-port-used");
const {
  createProxyMiddleware,
} = require("http-proxy-middleware");
require("dotenv").config();

const blocksRouter = require("./routes/blocks.routes");
const transactionRouter = require("./routes/transaction.routes");
const walletRouter = require("./routes/wallet.routes");
const cryptoRouter = require("./routes/cryptoInfo.routes");
const syncOnConnect = require("./utils/syncOnConnect");

const INITIAL_PORT = parseInt(
  process.env.INITIAL_PORT
);
let PORT = INITIAL_PORT;

const app = express();
app.use(express.json());
app.use(express.static("./client/dist"));

app.use(
  "/crypto",
  createProxyMiddleware({
    target: "http://www.megaweb.ir",
    changeOrigin: true,
    pathRewrite: { "^/crypto": "/crypto" },
  })
);

app.use("/api/blocks", blocksRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/wallet", walletRouter);
app.use("/api", cryptoRouter);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "./client/dist/index.html"
    )
  );
});

tcpPortUsed
  .check(PORT, "127.0.0.1")
  .then((inUse) => {
    if (inUse) {
      PORT += Math.ceil(Math.random() * 1000);
    }
    app.listen(PORT, () => {
      console.log(`Server run on port ${PORT}`);
      if (PORT !== INITIAL_PORT) {
        syncOnConnect(INITIAL_PORT);
      }
    });
  });
