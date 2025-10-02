import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container } from '@mui/material';
import Footer from 'src/components/Footer';

import InvoiceFormContent from './InvoiceFormContent';
import InvoiceFormPageHeader from './InvoiceFormPageHeader';

function InvoiceFormContainer() {
    return (
        <>
            <Helmet>
                <title>Invoice Form - Applications</title>
            </Helmet>
            <PageTitleWrapper>
                <InvoiceFormPageHeader />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <InvoiceFormContent />
            </Container>
            <Footer />
        </>
    );
}

export default InvoiceFormContainer;