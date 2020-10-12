import React, { FC } from 'react';
import { Button } from '../../../components/button';
import { Header, Layout } from '../../../components/layout';
import { Item, List } from '../../../components/list';
import './style.scss';
import { Icon } from '../../../components/icon';

const ButtonDemo: FC = function() {
  return (
    <Layout
      header={
        <Header title={'Button'} />
      }
    >
      <List className={'demo-btn-list'}>
        <Item>
          <Button>Default</Button>
          <Button ghost>Default Ghost</Button>
        </Item>
        <Item>
          <Button type={'primary'}>Primary</Button>
          <Button type={'primary'} disabled>Primary Disabled</Button>
        </Item>
        <Item>
          <Button type={'warn'}>Warn</Button>
          <Button type={'warn'} loading>Warn Loading</Button>
        </Item>
        <Item style={{background: '#f1f1f1'}}>
          <Button type={'danger'}>Danger</Button>
          <Button type={'danger'} ghost>Danger Ghost</Button>
        </Item>
        <Item>
          <Button type={'danger'} ghost loading>Danger Ghost Loading</Button>
        </Item>
        <Item>
          <Button type={'primary'} ghost>Primary Ghost</Button>
          <Button type={'warn'} ghost>Warn Ghost</Button>
        </Item>
        <Item>
          <Button
            type={'primary'}
            prefix={<Icon type={'search'} />}
          >Search</Button>
          <Button
            type={'primary'}
            after={<Icon type={'search'} />}
          >Search</Button>
        </Item>
      </List>
    </Layout>
  );
};

export { ButtonDemo };
