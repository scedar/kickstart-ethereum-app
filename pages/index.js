import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button, Image, Popup, Header, Icon } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import moment from 'moment';

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        let campaignArr = [];

        for (let i=0; i<campaigns[0].length; i++) {
            campaignArr.push({
                name: campaigns[0][i],
                description: campaigns[1][i].substring(0, 50 - 3) + '...',
                address: campaigns[2][i],
                displayPictureUrl: campaigns[3][i],
                dateCreated: moment(campaigns[4][i] * 1000).format('LLL')
            })
         }

        return { campaigns:campaignArr, pageLoaded: true };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(campaign => {
            return (
                <Card key={campaign.address}>
                    <Image src={campaign.displayPictureUrl} />
                    <Card.Content>
                    <Card.Header>{campaign.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>Created: {campaign.dateCreated}</span>
                    </Card.Meta>
                    <Card.Description>{campaign.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                    <Link route={`/campaigns/${campaign.address}`} >
                        <a>
                            <Popup 
                                trigger={<span>View Campaign</span>} 
                                content={'Camapaign address@'+campaign.address} 
                            />
                        </a>
                    </Link>
                    </Card.Content>
                </Card>
            )
        });

        return <Card.Group>{items}</Card.Group>;
    }

    render() {

        return (
            <Layout>
                <Header as='h2' style={{paddingTop: '20px', paddingBottom: '30px'}}>
                    <Icon name='assistive listening systems' />
                    <Header.Content>
                        Active Campaigns
                        <Header.Subheader>All campaigns deployed on the CrowdCowin etherieum blockchain</Header.Subheader>
                    </Header.Content>
                </Header>
                
                <Link route="/campaigns/new">
                    <a>
                        <Button 
                            floated="right"
                            content="Create Campaign"
                            labelPosition="left"
                            icon="add circle"
                            primary
                        />
                    </a>
                </Link>
                {
                    this.props.campaigns.length === 0 && 
                    <div>
                        No campaigns yet. Would you like to create one?
                    </div>
                }
                {this.renderCampaigns()}
            </Layout>
        )
    }
}

export default CampaignIndex;