import React, { FC, useCallback } from 'react';
import { Header, Layout } from '../../../components/layout';
import { modal } from '../../../components/modal';
import { Item, List } from '../../../components/list';
import { Button } from '../../../components/button';

const ModalDemo: FC = function(): JSX.Element {

  const onConfirm = useCallback(() => {
    modal.confirm({
      title: '警告',
      content: '蔡徐坤邀请你打篮球，是否同意？',
      cancelText: '拒绝'
    }).then(res => {
      if (res) {
        console.log('点击了确定');
      } else {
        console.log('点击了取消');
      }
    });
  }, []);
  const onAlert = useCallback(() => {
    modal.alert('哈哈啊哈哈哈和').then(res => {
      console.log('好的');
    });
  }, []);
  const onPrompt = useCallback(() => {
    modal.prompt({
      title: '请输入邮箱',
      placeholder: '请输入邮箱',
      rules: [{
        required: true
      }, {
        validator(rule, value) {
          if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('请输入正确格式的邮箱');
        }
      }]
    }).then(res => {
      if (res) {
        console.log(res);
      }
    });
  }, []);
  const onToast = useCallback(() => {
    modal.toast('这是一句话').then(() => {
      // after closed
    });
  }, []);

  return (
    <Layout
      header={
        <Header title={'Modal'} />
      }
    >
      <List>
        <Item extra={'确认弹窗'}>
          <Button type={'danger'} onClick={onConfirm}>Confirm</Button>
        </Item>
        <Item extra={'提示弹窗'}>
          <Button onClick={onAlert} type={'primary'} ghost>Alert</Button>
        </Item>
        <Item>
          <Button onClick={onPrompt} ghost>Prompt</Button>
        </Item>
        <Item>
          <Button type={'warn'} onClick={onToast} ghost>Toast</Button>
        </Item>
      </List>
    </Layout>
  );
};

export { ModalDemo };
