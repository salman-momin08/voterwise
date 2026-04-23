import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ChatAssistant from '../components/Chat/ChatAssistant';

describe('ChatAssistant Component', () => {
  it('renders correctly', () => {
    render(<ChatAssistant />);
    expect(screen.getByText('VoterWise Assistant')).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText('Ask about registration, deadlines...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'How do I register?' } });
    expect(input.value).toBe('How do I register?');
  });

  it('has accessible buttons', () => {
    render(<ChatAssistant />);
    expect(screen.getByLabelText('Voice input')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });
});
