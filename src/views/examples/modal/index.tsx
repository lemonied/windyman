import React, { FC, useCallback } from 'react';
import { Header, Layout } from '../../../components/layout';
import { modal } from '../../../components/modal';

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

  return (
    <Layout
      header={
        <Header title={'Modal'} />
      }
    >
      <div className={'demo-content'}>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onAlert}>Alert</button>
      </div>
    </Layout>
  );
};

export { ModalDemo };
