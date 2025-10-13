import type { Meta, StoryObj } from '@storybook/nextjs';
import { Cover } from '../components/cover';

const meta = {
  title: 'Test/Cover',
  component: Cover,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Cover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    pathname: '/'
  }
};

export const Services: Story = {
  args: {
    pathname: '/services'
  }
};

export const Profile: Story = {
  args: {
    pathname: '/profile'
  }
};

export const Contact: Story = {
  args: {
    pathname: '/contact'
  }
};
