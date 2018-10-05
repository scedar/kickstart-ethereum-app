import React, { Component } from 'react';
import { Form, Button, Input, Label, Dropdown, Message } from 'semantic-ui-react';
import { Router } from '../routes';

import getCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {

    state = {
        contribution: '',
        loading: false,
        statusMessage: '',
        errorMessage: ''
    };

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

            this.setState({ statusMessage: 'Donating to campaign in the blockchain. This might take a while. Please wait...' })

            await campaign.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.contribution, 'ether')
                });
                msg = 'Donation successful. Thank you!';
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message })
            msg = '';
        }
        this.setState({ loading: false, statusMessage: msg });
        // setTimeout(function(){ this.setState({statusMessage: '' }); }, 3000);
    }   

    render() {

        const currencies = [
            { key: '1', text: 'ether', value: 'eth' },
            { key: '2', text: 'cowin', value: 'cwn' },
            { key: '3', text: 'wei', value: 'wei' },
          ]

        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        label={ <Dropdown defaultValue='eth' options={ currencies } /> }
                        labelPosition='right'
                        placeholder="1.01" 
                        value={ this.state.contribution }
                        onChange={ event => this.setState({ contribution: event.target.value }) }
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button 
                    disabled={this.state.loading}
                    primary loading={this.state.loading}
                    >
                    Contribute
                </Button>
                {
                    this.state.statusMessage !== '' && 
                        <Label>{this.state.statusMessage}</Label>
                }
            </Form>
        );
    };
};

export default ContributeForm;