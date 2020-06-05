import React, { FC, useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import Form, { Field, useForm } from 'rc-field-form';
import { Input } from '../../components/input';
import { post } from '../../helpers/http';

const Examples: FC<any> = function(): JSX.Element {
  const [options, setOptions] = useState([]);
  const [form] = useForm();
  useEffect(() => {
    const subscription = post('/service/sys/config/config/getConditionList', {
      plateform: 1,
      tabStr: 'TAB_EDUCATION'
    }).subscribe(res => {
      setOptions(res.result.TAB_EDUCATION.map((item: any) => {
        return {
          name: item.name,
          value: item.code
        };
      }));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <Form form={form}>
        <Field
          name={'education'}
          initialValue={'21'}
          rules={[{
            required: true
          }, {
            validator: (rule, value, callback: (error?: string) => void) => {
              if (value) {
                callback();
              } else {
                callback('error');
              }
            }
          }]}
        >
          <Input type={'picker'} data={options} />
        </Field>
      </Form>
    </Layout>
  );
};

export default Examples;
