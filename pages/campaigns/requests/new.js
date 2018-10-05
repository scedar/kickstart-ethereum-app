import React, { Component } from 'react';

import { Form, Button, Message, Input, Dropdown, Label, Grid, Header, Icon } from 'semantic-ui-react';

import Layout from '../../../components/Layout';
import { Link, Router} from '../../../routes';
import getCampaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class NewRequest extends Component {

    state = {
        amount: '',
        recepient: '',
        description: '',
        loading: false,
        statusMessage: '',
        errorMessage: ''
    }

    static async getInitialProps(props) {
        return { address:props.query.address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ 
            loading: true, errorMessage: '',
            statusMessage: 'Connecting to bockchain network'
         });
        let msg;
        const campaign = getCampaignInstance(this.props.address);

        try {
            const accounts = await web3.eth.getAccounts();

            this.setState({ statusMessage: 'Creating withdrawal request. This might take a while. Please wait...' })

            await campaign.methods
                .createRequest(
                    this.state.description,
                    web3.utils.toWei(this.state.amount, 'ether'),
                    this.state.recepient
                    )
                .send({
                    from: accounts[0]
                });
                msg = 'Withdrawal request created successfully';
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
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
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button 
                                        floated="left"
                                        content="Back to Requests"
                                        labelPosition="left"
                                        icon="left chevron"
                                        size="mini"
                                    />
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h2' style={{paddingTop: '20px', paddingBottom: '20px'}}>
                                <Icon name='money' />
                                <Header.Content>
                                    Create Withdrawal Request
                                    <Header.Subheader>Request contributors to authorize funds transfer or withdrawal</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <Form.Field>
                                    <label>Amount to Withdraw</label>
                                    <Input 
                                        label={ <Dropdown defaultValue='eth' options={ currencies } /> }
                                        labelPosition='right'
                                        placeholder="10.005" 
                                        value={ this.state.amount }
                                        onChange={ event => this.setState({ amount: event.target.value }) }
                                    />

                                    <Form.Input
                                        label="Recepient Address"
                                        placeholder="0x1E554a1786dD070E181D2b0A33633143A3039dcC" 
                                        value={ this.state.recepient }
                                        onChange={ event => this.setState({ recepient: event.target.value }) }
                                    />

                                    <Form.TextArea
                                        label="Description"
                                        placeholder='I would like to withdraw some money for paying the blockchain developers...'
                                        value={ this.state.description }
                                        onChange={ event => this.setState({ description: event.target.value }) } />
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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    };
};

export default NewRequest;