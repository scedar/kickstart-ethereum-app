import React, { Component } from 'react';
import { Button, Header, Icon, Table, Grid, Loader, Dimmer, Label, Message } from 'semantic-ui-react';

import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import { Link } from '../../../routes';
import getCampaignInstance from '../../../ethereum/campaign';

class RequestsIndex extends Component {

    state = {
        requests: [],
        areRequestsLoading: true,
        requestsLoadingMessage: 'Preparing to fetch requests',
        message: '',
        hasErrors: false
    }

    static async getInitialProps(props){

        const { address } = props.query;

        const campaignInstance = getCampaignInstance(address);
        const requestCount = await campaignInstance.methods.getRequestsCount().call();

        return { 
            address, requestCount
         };
    }

    updateMessage = (message) => {
        this.setState({ message });
    }

    updateHasErrors = (hasErrors) => {
        this.setState({ hasErrors });
    }

    async componentDidMount() {

        const campaignInstance = getCampaignInstance(this.props.address);
        const requestCount = this.props.requestCount;
        const contributorsCount = await campaignInstance.methods.approversCount().call();
        let requests = this.state.requests;

        for(let i=0; i<requestCount; i++){
            this.setState({ requestsLoadingMessage: 'Fetching request '+(i+1)+' of '+requestCount+' request(s)'});

            let result = await campaignInstance.methods.requests(i).call();
            let request = {
                description: result[0],
                value: result[1],
                recipient: result[2],
                complete: result[3],
                approvalCount: result[4],
                contributorsCount: contributorsCount
            }
            requests.push(request);
            this.setState({ requests });
        }
        this.setState({ areRequestsLoading: false, requestsLoadingMessage: '' });

    }

    render() {

        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}`}>
                                <a>
                                    <Button 
                                        floated="left"
                                        content="Back to Campaign"
                                        labelPosition="left"
                                        icon="left chevron"
                                        size="mini"
                                    />
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Header as='h2' style={{paddingTop: '20px', paddingBottom: '20px'}}>
                                <Icon name='podcast' />
                                <Header.Content>
                                    Withdrawal Requests
                                    <Header.Subheader>All withdrawal request made on this campaign and their statuses</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Link route={`/campaigns/${this.props.address}/requests/new`}>
                                <a>
                                    <Button 
                                        floated="right"
                                        content="Create Withdrawal Request"
                                        labelPosition="left"
                                        icon="add circle"
                                        primary
                                    />
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column floated='right' width={6} textAlign='right'>
                            {
                                this.state.message !== '' && !this.state.hasErrors &&
                                    <Label>{this.state.message}</Label>
                            }
                            {
                                this.state.message !== '' && this.state.hasErrors &&
                                <Message error={true} header="Oops!" content={this.state.message} />
                            }
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>#</Table.HeaderCell>
                                        <Table.HeaderCell>Description</Table.HeaderCell>
                                        <Table.HeaderCell>Amount</Table.HeaderCell>
                                        <Table.HeaderCell>Recepient</Table.HeaderCell>
                                        <Table.HeaderCell>Approval Rate</Table.HeaderCell>
                                        <Table.HeaderCell colSpan='2'><center>Actions</center></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>

                                    {
                                        this.state.areRequestsLoading && 
                                            <Table.Row>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell>
                                                    <Dimmer active inverted>
                                                        <Loader>{this.state.requestsLoadingMessage}</Loader>
                                                    </Dimmer>
                                                </Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                    }

                                    {
                                        !this.state.areRequestsLoading && this.state.requests.length == 0 &&
                                            <Table.Row>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell>No requests found</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                    } 

                                    {
                                        !this.state.areRequestsLoading && this.state.requests.length > 0 &&
                                            this.state.requests.map((request, index) => (
                                                <RequestRow 
                                                    key={index}
                                                    id={index}
                                                    request={request}
                                                    address={this.props.address}
                                                    fnUpdateMessage={this.updateMessage}
                                                    fnUpdateHasErrors={this.updateHasErrors}
                                                />
                                            ))
                                    }

                                </Table.Body>
                            </Table>
                            <div>Found { this.props.requestCount } request(s)</div>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Layout>
        );
    };
};

export default RequestsIndex;