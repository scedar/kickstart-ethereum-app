import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xedf1d273BE7543277a41247F93e8b4d77B03300d'
);

export default instance;