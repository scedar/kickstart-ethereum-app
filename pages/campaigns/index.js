import React, { Component } from 'react';
import { Grid, Item, Icon, Container, Card, Button, Header} from 'semantic-ui-react';
import moment from 'moment';

import Layout from '../../components/Layout';
import getCampaignInstance from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class ShowCampaign extends Component {

    static async getInitialProps(props) {
        const campaign = getCampaignInstance(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        return {
            campaignAddress: props.query.address,
            minimumContribution: summary[0],
            contractBalance: summary[1],
            contractRequestsCount: summary[2],
            contractContributorsCount: summary[3],
            contractManagerAddress: summary[4],
            contractName: summary[5],
            contractDescription: summary[6],
            contractDpUrl: summary[7],
            contractDateCreated: moment(summary[8] * 1000).format('LLL'),
        };
    }

    renderCards() {

        const {
            minimumContribution,
            contractBalance,
            contractRequestsCount,
            contractContributorsCount,
            contractManagerAddress,
        } = this.props;

        const items = [
            {
                header: contractManagerAddress,
                meta: 'Address for contract manager',
                description: 'The manager created this campaign and can create requests for withdrawing money from this campaign.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(contractBalance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'This is how much money the campaign has left to spend'
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (Wei)',
                description: 'You must contribute at least this much wei to become a contributor in this campaign'
            },
            {
                header: contractContributorsCount,
                meta: 'Active contributors',
                description: 'This is the number of people who have donated to this campaign'
            },
            {
                header: contractRequestsCount,
                meta: 'Withdrawal Requests',
                description: 'A request is initiated by a manager and tries to withdraw money from the campaign. Requests must be approved by at least 51% of the contributors'
            }
        ];

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/`}>
                                <a>
                                    <Button 
                                        floated="left"
                                        content="Back to Campaigns"
                                        labelPosition="left"
                                        icon="left chevron"
                                        size="mini"
                                    />
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Container>
                            <Header as='h2' style={{paddingTop: '20px', paddingBottom: '20px'}}>
                                <Icon name='th list' />
                                <Header.Content>
                                    Campaign Details
                                    <Header.Subheader>All you need to know about the project in this campaign</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Container>
                    </Grid.Row>
                    <Grid.Row>
                        <Container>
                            <Item.Group>
                                <Item>
                                    <Item.Image size='large' src={this.props.contractDpUrl} />
                                    <Item.Content>
                                        <Item.Header as='a'>{this.props.contractName}</Item.Header>
                                        <Item.Description>{this.props.contractDescription}</Item.Description>
                                        <Item.Extra>
                                        <Icon color='blue' name='clock outline' /> {this.props.contractDateCreated}
                                        </Item.Extra>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Container>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            {this.renderCards()}
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a>
                                    <Button 
                                        floated="right"
                                        content="View Withdrawal Requests"
                                        labelPosition="left"
                                        icon="ethereum"
                                        primary
                                    />
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <ContributeForm address={this.props.campaignAddress} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    };
};

export default ShowCampaign;