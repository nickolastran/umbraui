// Imports ONLY the root entry. The production bundle for this page must contain no Motion or three.js code.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, CardHeader, CardTitle, Container, ThemeProvider, type ButtonProps } from 'umbra-ui';
import 'umbra-ui/styles.css';

const variant: ButtonProps['variant'] = 'soft';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Container size="sm" style={{ paddingBlock: 48 }}>
        <Card>
          <CardHeader>
            <CardTitle>Root entry only</CardTitle>
          </CardHeader>
          <Button variant={variant}>No motion, no three.js</Button>
        </Card>
      </Container>
    </ThemeProvider>
  </StrictMode>,
);
