import React, { Component } from 'react';

import { Grid, Image, Form, Button, Input, Label, Dropdown, Message, Header, Icon } from 'semantic-ui-react';

import Layout from '../../components/Layout'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class NewCampaign extends Component {

    state = {
        minimumContribution: '',
        campaignName: '',
        campaignDescription: '',
        campaignDpUrl: 'https://cdn2.iconfinder.com/data/icons/casino-people-gambling/426/casino-gambling-gambler-003-512.png',
        campaignDateCreated: '',
        loading: false,
        statusMessage: '',
        errorMessage: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ 
            loading: true, errorMessage: '',
            campaignDateCreated: Math.round((new Date()).getTime() / 1000).toString(),
            statusMessage: 'Connecting to bockchain network'
         });
         let msg;

        try {
            const accounts = await web3.eth.getAccounts();

            this.setState({ statusMessage: 'Deploying campaign to network. This might take a while. Please wait...' })

            await factory.methods
                .createCampaign(
                    this.state.campaignName,
                    this.state.campaignDescription,
                    this.state.campaignDpUrl,
                    this.state.campaignDateCreated,
                    this.state.minimumContribution
                    )
                .send({
                    from: accounts[0]
                });
                msg = 'Campaign created successfully';
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message })
            msg = '';
        }
        this.setState({ loading: false, statusMessage: msg });
        // setTimeout(function(){ this.setState({statusMessage: '' }); }, 3000);
    };

    render() {

        const currencies = [
            { key: '1', text: 'ether', value: 'eth' },
            { key: '2', text: 'cowin', value: 'cwn' },
            { key: '3', text: 'wei', value: 'wei' },
          ]

        return (
            <Layout>
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
                <Header as='h2' style={{paddingTop: '40px', paddingBottom: '20px'}}>
                    <Icon name='code branch' />
                    <Header.Content>
                        Create a Campaign
                        <Header.Subheader>Create a campaign to help raise funds for your project</Header.Subheader>
                    </Header.Content>
                </Header>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <Form.Input
                            label="Name"
                            placeholder="Cowin Campaign" 
                            value={ this.state.campaignName }
                            onChange={ event => this.setState({ campaignName: event.target.value }) }
                        />
                        <Form.TextArea
                            label="Description"
                            placeholder='Cowin funds drive project for...'
                            value={ this.state.campaignDescription }
                            onChange={ event => this.setState({ campaignDescription: event.target.value }) } />

                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Form.Input
                                        label="Display Picture URL"
                                        placeholder="https://cowin.ico/favicon" 
                                        value={ this.state.campaignDpUrl }
                                        onChange={ event => this.setState({ campaignDpUrl: event.target.value }) }
                                    /> 
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Image src={this.state.campaignDpUrl} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <br />
                        <label>Minimum Contribution</label>
                        <Input 
                            label={ <Dropdown defaultValue='wei' options={ currencies } /> }
                            labelPosition='right'
                            placeholder="1000" 
                            value={ this.state.minimumContribution }
                            onChange={ event => this.setState({ minimumContribution: event.target.value }) }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button 
                        disabled={this.state.loading}
                        primary loading={this.state.loading}
                        >
                        Create
                    </Button>
                    {
                        this.state.statusMessage !== '' && 
                            <Label>{this.state.statusMessage}</Label>
                    }
                </Form>

            </Layout>
        )
    };
};

export default NewCampaign;