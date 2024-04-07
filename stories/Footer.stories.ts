import Footer from '../components/footer';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Test/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
