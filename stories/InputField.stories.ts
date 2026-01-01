import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InputField } from '@/components/InputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof InputField>;

type Story = StoryObj<typeof meta>;
export default meta;

export const Input: Story = {
  args: {
    label: 'Email',
    name: 'email',
    htmlType: 'email',
  },
};
