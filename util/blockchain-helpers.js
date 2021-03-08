var Pact = require('./pact-lang-api')

const sleepPromise = async (timeout) => {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

const pollTxRes = async (reqKey, host) => {
  //check kadena tx status until we get a response (success or fail) or 400
  //seconds has gone by
  var timeLimit = 480;
  var sleepTime = 5;
  var pollRes;
  while (timeLimit > 0) {
    await sleepPromise(sleepTime * 1000);

    pollRes = await Pact.fetch.poll({requestKeys: [reqKey]}, host);
    if (Object.keys(pollRes).length === 0) {
      timeLimit = timeLimit - sleepTime;
    } else {
      timeLimit = 0;
    }

    // exponential backoff to reduce server load
    if (sleepTime < 30) {
      sleepTime = sleepTime * 2;
    }
  }
  return pollRes[reqKey]
}

const makePactContCommand = (
  chainId,
  pactId,
  proof,
  step,
  meta,
  networkId,
  rollback = false
) => ({
  type: "cont",
  keyPairs: [],
  meta,
  step,
  rollback,
  pactId,
  proof,
  networkId,
});

module.exports = {
  sleepPromise,
  pollTxRes,
  makePactContCommand
}
