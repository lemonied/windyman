import React, { FC, useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import Form, { Field, useForm } from 'rc-field-form';
import { Input } from '../../components/input';
import { post } from '../../helpers/http';

const formatCity = (cities: any) => {
  return cities.map((item: any) => {
    return {
      value: item.id,
      name: item.text,
      children: formatCity(item.children)
    };
  });
};

const Examples: FC<any> = function(): JSX.Element {
  const [options, setOptions] = useState([]);
  const [city, setCity] = useState([]);
  const [form] = useForm();
  useEffect(() => {
    const subscription = post('/service/sys/config/config/getConditionList', {
      plateform: 1,
      tabStr: 'TAB_EDUCATION,TAB_CITY'
    }).subscribe(res => {
      setOptions(res.result.TAB_EDUCATION.map((item: any) => {
        return {
          name: item.name,
          value: item.code
        };
      }));
      setCity(formatCity(res.result.TAB_CITY.children));
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
            validator: (rule, value) => {
              if (value < 20) {
                return Promise.resolve();
              } else {
                return Promise.reject('error');
              }
            }
          }]}
        >
          <Input type={'picker'} data={options} />
        </Field>
        <Field
          name={'city'}
          initialValue={[]}
        >
          <Input
            data={city}
            multi={3}
            type={'picker'}
          />
        </Field>
      </Form>
    </Layout>
  );
};

export default Examples;
