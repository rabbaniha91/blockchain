const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

class PubSub {
  constructor({ blockchain, transactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.nodeId = `node-${Math.random()}`; // اضافه کردن یک ID یکتا برای هر نود
    this.isPublisher = false;

    // اتصال کلاینت‌ها به Redis
    this.publisher
      .connect()
      .then(() => {
        console.log(
          "Publisher connected to Redis"
        );
      })
      .catch(console.error);

    this.subscriber
      .connect()
      .then(() => {
        console.log(
          "Subscriber connected to Redis"
        );
        if (!this.isPublisher) {
          this.subscribeToChannel();
        }
        this.isPublisher = false;
      })
      .catch(console.error);
  }

  subscribeToChannel() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(
        channel,
        (message) => {
          this.handleMessage(channel, message);
        }
      );
    });
  }

  publish({ channel, message }) {
    this.isPublisher = true;
    const fullMessage = JSON.stringify({
      message,
      nodeId: this.nodeId,
    }); // اضافه کردن ID به پیام
    this.publisher.publish(channel, fullMessage);
  }

  handleMessage(channel, fullMessage) {
    const { message, nodeId } =
      JSON.parse(fullMessage);

    if (nodeId === this.nodeId) return; // پیام نود خودش را پردازش نکنید

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(
          JSON.parse(message),
          true,
          () => {
            this.transactionPool.clearBlockchainTransaction(
              { chain: JSON.parse(message) }
            );
          }
        );
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(
          JSON.parse(message)
        );
        break;
      default:
        break;
    }
  }

  boardcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(
        this.blockchain.chain
      ),
    });
  }

  boardcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;
