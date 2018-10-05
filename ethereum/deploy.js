const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'spell harsh follow onion culture soap unknown coast pull fluid walnut dog',
    'https://rinkeby.infura.io/v3/75e4b11a48fe450e939fc956bbee19bb'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: '0x' + compiledFactory.bytecode })
    .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployed @->', result.options.address);
  //v1.DEBUG -> 0xA5CCdA9F2637c3004819dE1CF821702ADe0d9E40
  //v2.DEBUG -> 0xEB3f3fbE4B90f9ab5EE0EafEf2BD03e7190e4753
  //v3.DEBUG -> 0x90B765D3fEfa5adb6993bE9F66665D9C4aF682D7
  //v1.0.PROD -> 0xedf1d273BE7543277a41247F93e8b4d77B03300d
};
deploy();