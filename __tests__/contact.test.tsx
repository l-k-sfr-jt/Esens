import { render, screen } from '@testing-library/react';
import Page from '../app/contact/page';

describe('Page', () => {
  it('renders a heading and form', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { name: 'Nepropásněte život na Letné' });
    expect(heading).toBeVisible();
    const form = screen.getByRole('form', { name: 'Kontaktní formulář' });
    expect(form).toBeInTheDocument();
  });
});
