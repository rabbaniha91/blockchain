const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
  address: "*authorize-reward*",
};
const MINING_REWARD = 50;

const GENESIS_BLOCK = {
  timestamp: 1,
  hash: "genesis-hash",
  lastHash: "------",
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};

module.exports = {
  GENESIS_BLOCK,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
};
