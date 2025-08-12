'use client';

import { Page, Text } from '@react-pdf/renderer';


export default function JoinedContent() {
    const JoinedPDF = () => (
            <Page size="A4" >
                <Text>Hello</Text>
            </Page>
    );

    return <JoinedPDF />
}
