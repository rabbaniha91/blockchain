const {
  getCryptosInfo,
} = require("../utils/getCryptoInfo");

const getInfo = (req, res) => {
  console.log("come");
  getCryptosInfo()
    .then((data) => {
      if (data) {
        res.status(200).json({...data});
      } else {
        res
          .status(500)
          .json({ message: "No data returned" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: error.message });
    });
};

module.exports = { getInfo };
