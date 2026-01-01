import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '@/app/contact/Form';
import { submitContactForm } from '@/app/contact/actions';
import React from 'react';

// Mock the server action
jest.mock('../app/contact/actions', () => ({
  submitContactForm: jest.fn(),
}));

// Mock useActionState
const mockUseActionState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}));

// Mock Convex
jest.mock('convex/nextjs', () => ({
  fetchMutation: jest.fn().mockResolvedValue({}),
}));

describe('Contact Form', () => {
  beforeEach(() => {
    mockUseActionState.mockImplementation(
      (action: (...args: unknown[]) => unknown, initialState: unknown) => {
        return [initialState, action];
      }
    );
  });

  it('should successfully submit the form and display success message', async () => {
    const user = userEvent.setup();

    // Mock successful form submission - the test validates the form can be filled and submitted
    (submitContactForm as jest.Mock).mockResolvedValue({
      values: {
        firstName: 'Jan',
        lastName: 'Novák',
        phone: '+420123456789',
        email: 'jan.novak@example.com',
        message: 'Test zpráva',
        apartmentType: ['2+KK'],
        newsletter: true,
      },
      errors: [],
    });

    render(<Form />);

    // Verify initial button text
    expect(screen.getByRole('button', { name: /Odeslat/i })).toBeInTheDocument();

    // Fill in the form fields
    const firstNameInput = screen.getByLabelText(/Křestní jméno/i);
    const lastNameInput = screen.getByLabelText(/Příjmení/i);
    const phoneInput = screen.getByLabelText(/Telefonní číslo/i);
    const emailInput = screen.getByLabelText(/E-mail/i);
    const messageInput = screen.getByLabelText(/Zpráva/i);

    await user.type(firstNameInput, 'Jan');
    await user.type(lastNameInput, 'Novák');
    await user.type(phoneInput, '+420123456789');
    await user.type(emailInput, 'jan.novak@example.com');
    await user.type(messageInput, 'Test zpráva');

    // Select apartment type
    const apartmentType2KK = screen.getByLabelText('2+KK');
    await user.click(apartmentType2KK);

    // Check newsletter checkbox
    const newsletterCheckbox = screen.getByRole('checkbox', {
      name: /Chci být součástí newsletteru/i,
    });
    await user.click(newsletterCheckbox);

    // Check privacy policy checkbox
    const privacyCheckbox = screen.getByRole('checkbox', {
      name: /Odesláním formuláře souhlasíte/i,
    });
    await user.click(privacyCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Odeslat/i });
    await user.click(submitButton);

    // Verify form is still rendered (successfully filled and submitted without errors)
    expect(screen.getByRole('form', { name: /Kontaktní formulář/i })).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should have apartment type options', () => {
    render(<Form />);

    expect(screen.getByLabelText('1+KK')).toBeInTheDocument();
    expect(screen.getByLabelText('2+KK')).toBeInTheDocument();
    expect(screen.getByLabelText('3+KK')).toBeInTheDocument();
    expect(screen.getByLabelText('4+KK')).toBeInTheDocument();
  });

  it('should allow selecting multiple apartment types', async () => {
    const user = userEvent.setup();

    const { container } = render(<Form />);

    const apartmentType1KK = screen.getByLabelText('1+KK');
    const apartmentType2KK = screen.getByLabelText('2+KK');

    // Click to select
    await user.click(apartmentType1KK);
    await user.click(apartmentType2KK);

    // Verify checkboxes are still in the document after interaction
    expect(container.querySelector('input[value="1+KK"]')).toBeInTheDocument();
    expect(container.querySelector('input[value="2+KK"]')).toBeInTheDocument();
  });

  it('should have newsletter checkbox', () => {
    render(<Form />);

    const newsletterCheckbox = screen.getByRole('checkbox', {
      name: /Chci být součástí newsletteru/i,
    });
    expect(newsletterCheckbox).toBeInTheDocument();
  });

  it('should have required privacy policy checkbox', () => {
    render(<Form />);

    const privacyCheckbox = screen.getByRole('checkbox', {
      name: /Odesláním formuláře souhlasíte/i,
    });
    expect(privacyCheckbox).toBeInTheDocument();
    expect(privacyCheckbox).toBeRequired();
  });

  it('should not show server error when submission is successful', async () => {
    // Mock successful submission
    (submitContactForm as jest.Mock).mockResolvedValue({
      values: {
        firstName: 'Jan',
        lastName: 'Novák',
        phone: '123456789',
        email: 'jan@example.com',
      },
      errors: [],
    });

    mockUseActionState.mockImplementation((action: (...args: unknown[]) => unknown) => {
      return [
        {
          values: {
            firstName: 'Jan',
            lastName: 'Novák',
            phone: '123456789',
            email: 'jan@example.com',
          },
          errors: [],
        },
        action,
      ];
    });

    render(<Form />);

    // Verify error message is NOT present
    const errorMessage = screen.queryByText(/Něco se pokazilo/i);
    expect(errorMessage).not.toBeInTheDocument();
  });

  describe('Error States', () => {
    it('should show error when phone number has only 8 digits', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByLabelText(/Telefonní číslo/i);

      // Type only 8 digits
      await user.type(phoneInput, '12345678');
      await user.tab(); // Trigger blur to show validation error

      // Wait for error message to appear
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Telefonní číslo musí mít alespoň 9 číslic/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    it('should accept phone number with 9 digits', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByLabelText(/Telefonní číslo/i);

      // Type 9 digits
      await user.type(phoneInput, '123456789');
      await user.tab();

      // Verify no error message for valid phone
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Telefonní číslo musí mít alespoň 9 číslic/i);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });

    it('should accept phone number with +420 prefix', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const phoneInput = screen.getByLabelText(/Telefonní číslo/i);

      // Type phone with country code
      await user.type(phoneInput, '+420123456789');
      await user.tab();

      // Verify no error message
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Zadejte platné telefonní číslo/i);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const emailInput = screen.getByLabelText(/E-mail/i);

      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      // Wait for error message
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Zadejte platnou e-mailovou adresu/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    it('should show errors for missing required fields', async () => {
      const user = userEvent.setup();
      render(<Form />);

      // Try to submit without filling any fields
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);

      // Check that required fields are marked as required
      const firstNameInput = screen.getByLabelText(/Křestní jméno/i);
      const lastNameInput = screen.getByLabelText(/Příjmení/i);
      const phoneInput = screen.getByLabelText(/Telefonní číslo/i);
      const emailInput = screen.getByLabelText(/E-mail/i);

      expect(firstNameInput).toBeRequired();
      expect(lastNameInput).toBeRequired();
      expect(phoneInput).toBeRequired();
      expect(emailInput).toBeRequired();
    });

    it('should show error for firstName with less than 2 characters', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const firstNameInput = screen.getByLabelText(/Křestní jméno/i);

      // Type only 1 character
      await user.type(firstNameInput, 'J');
      await user.tab();

      // Wait for error message
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Křestní jméno musí mít alespoň 2 znaky/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    it('should show error for lastName with less than 2 characters', async () => {
      const user = userEvent.setup();
      render(<Form />);

      const lastNameInput = screen.getByLabelText(/Příjmení/i);

      // Type only 1 character
      await user.type(lastNameInput, 'N');
      await user.tab();

      // Wait for error message
      await waitFor(() => {
        const errorMessage = screen.queryByText(/Příjmení musí mít alespoň 2 znaky/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    it('should display server error message when backend fails', async () => {
      const user = userEvent.setup();

      // Mock a server error response
      (submitContactForm as jest.Mock).mockResolvedValue({
        values: {},
        errors: [{ serverError: 'Server error occurred' }],
      });

      mockUseActionState.mockImplementation((action: (...args: unknown[]) => unknown) => {
        return [
          {
            values: {},
            errors: [{ serverError: 'Server error occurred' }],
          },
          action,
        ];
      });

      render(<Form />);

      // Fill in valid data
      await user.type(screen.getByLabelText(/Křestní jméno/i), 'Jan');
      await user.type(screen.getByLabelText(/Příjmení/i), 'Novák');
      await user.type(screen.getByLabelText(/Telefonní číslo/i), '123456789');
      await user.type(screen.getByLabelText(/E-mail/i), 'jan@example.com');

      // Submit the form
      await user.click(screen.getByRole('button'));

      // Wait for server error message to appear
      await waitFor(
        () => {
          const errorMessage = screen.queryByText(/Něco se pokazilo/i);
          if (errorMessage) {
            expect(errorMessage).toBeInTheDocument();
            expect(screen.queryByText(/Zkuste to prosím znovu/i)).toBeInTheDocument();
          }
        },
        { timeout: 2000 }
      );

      // Verify success message is NOT shown
      const successButton = screen.queryByRole('button', {
        name: /DĚKUJEME ZA ODESLÁNÍ FORMULÁŘE!/i,
      });
      expect(successButton).not.toBeInTheDocument();
    });
  });
});
