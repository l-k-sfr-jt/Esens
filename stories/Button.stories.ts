import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    htmlType: 'button',
    children: 'Button',
    style: 'primary',
  },
};

export const Loading: Story = {
  args: {
    style: 'primary',
    isLoading: true,
    htmlType: 'button',
    children: 'Button',
  },
};
