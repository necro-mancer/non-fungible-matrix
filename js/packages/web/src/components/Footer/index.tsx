import React from 'react';
import { TwitterOutlined, CodeOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const Footer = () => {
  return (
    <div style={{ marginBottom: '0px', marginLeft: '10px' }} className={'footer'}>
      <Button
        type={'link'}
        target={'_blank'}
        href={'https://github.com/necro-mancer'}
        icon={<CodeOutlined />}
      >GitHub</Button>
      <Button
        type={'link'}
        target={'_blank'}
        href={'https://twitter.com/gsissh_matrix'}
        icon={<TwitterOutlined />}
      >Twitter</Button>
    </div>
  );
};
