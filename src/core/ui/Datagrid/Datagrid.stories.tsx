import type { Meta, StoryObj } from '@storybook/react';

import { Datagrid } from './Datagrid';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Datagrid> = {
  component: Datagrid,
};

export default meta;
type Story = StoryObj<typeof Datagrid>;

export const FirstStory: Story = {
  args: {
    items: []
  },
}
