import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ApartmentTypeSelector } from '@/components/ApartmentTypeSelector';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ApartmentTypeSelector',
  component: ApartmentTypeSelector,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ApartmentTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label: 'O jaký byt máte zájem?`',
    options: [
      { label: '1+KK', value: '1+KK' },
      { label: '2+KK', value: '2+KK' },
      { label: '3+KK', value: '3+KK' },
      { label: '4+KK', value: '4+KK' },
    ],
  },
};
