import React from 'react';
import { Container, Segment } from 'semantic-ui-react';

import Head from 'next/head';

import Header from './Header';

export default (props) => {
    return (
        <Container>
            <Head>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
            </Head>
            
            <Header />
            {props.children}
            
            <br /><br /><br /><hr />
            <footer>&copy; Copyright 2018, Scedar Technologies Inc.</footer>
            
        </Container>
    )
};