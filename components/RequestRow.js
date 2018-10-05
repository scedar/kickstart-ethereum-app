import React, { Component } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';

import { Router } from '../routes';
import getCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {

    state = {
        approveLoading: false,
        finalizeLoading: false,
    }

    onApprove = async () => {
        let msg;
        this.setState({ approveLoading: true });
        this.props.fnUpdateHasErrors(false);
        this.props.fnUpdateMessage('Connecting to bockchain network');
        
        try{
            const campaign = getCampaignInstance(this.props.address);
            const accounts = await web3.eth.getAccounts();

            this.props.fnUpdateMessage('Approving withdrawal request. This might take a while. Please wait...');

            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
            
            msg = 'Approval success!';
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }catch(err) {
            msg = err.message;
            this.props.fnUpdateHasErrors(true);
        }
        this.setState({ approveLoading: false });
        this.props.fnUpdateMessage(msg);
    }

    onFinalize =  async () => {
        let msg;
        this.setState({ finalizeLoading: true });
        this.props.fnUpdateHasErrors(false);
        this.props.fnUpdateMessage('Connecting to bockchain network');
        
        try{
            const campaign = getCampaignInstance(this.props.address);
            const accounts = await web3.eth.getAccounts();

            this.props.fnUpdateMessage('Finalizing withdrawal request. This might take a while. Please wait...');

            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
            
            msg = 'Withdrawal request has been finalized!!';
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }catch(err) {
            msg = err.message;
            this.props.fnUpdateHasErrors(true);
        }
        this.setState({ finalizeLoading: false });
        this.props.fnUpdateMessage(msg);
    }

    render() {

        const { Row, Cell } = Table;
        const { id, request } = this.props;

        const approvalRate = ((request.approvalCount / request.contributorsCount)*100)+'% ('+request.approvalCount +'/'+ request.contributorsCount+')';
        const readyToFinalize = request.approvalCount > request.contributorsCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id+1}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{approvalRate}</Cell>
                {
                    request.complete ? (
                        <Cell colSpan="2">
                            <center>
                                <Button 
                                    icon 
                                    labelPosition='right'
                                    disabled={true}
                                >
                                    Request Finalized
                                    <Icon name='check' />
                                </Button>    
                            </center>
                        </Cell>
                    ) : (
                        <React.Fragment>
                            <Cell>
                                <Button 
                                    icon 
                                    labelPosition='right' 
                                    color='green' 
                                    basic onClick={this.onApprove}
                                    disabled={this.state.approveLoading}
                                    loading={this.state.approveLoading}
                                >
                                    Approve
                                    <Icon name='angle double up' />
                                </Button>                 
                            </Cell>
                            <Cell>
                                <Button 
                                    icon 
                                    labelPosition='right' 
                                    color='teal' 
                                    basic onClick={this.onFinalize}
                                    disabled={this.state.finalizeLoading}
                                    loading={this.state.finalizeLoading}
                                >
                                    Finalize
                                    <Icon name='level up alternate' />
                                </Button>      
                            </Cell>
                        </React.Fragment>
                    )
                }
            </Row>
        );
    };
};

export default RequestRow;