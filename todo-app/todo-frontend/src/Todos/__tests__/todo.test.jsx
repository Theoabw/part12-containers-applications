import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Todo from '../Todo';

describe('Todo component', () => {
    it('renders todo text', () => {
        const todo = { text: 'Test todo', done: false };
        const { getByText } = render(<Todo todo={todo} onDelete={() => {}} onComplete={() => {}} />);
        expect(getByText('Test todo')).toBeDefined();
    });
});