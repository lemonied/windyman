import React, { FC, useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { Field, useForm } from 'rc-field-form';
import { Input } from '../../components/input';
import { post } from '../../helpers/http';
import { YField, YForm } from '../../components/y-form';
import { Loading } from '../../components/loading';

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

  useEffect(() => {
    if (!options.length) { return; }
    form.setFieldsValue({
      education: '21',
      username: '456'
    });
  }, [options, form]);

  return (
    <Layout>
      <Loading />
      <YForm form={form}>
        <YField
          name={'education'}
          rules={[{
            required: true
          }, {
            validator: (rule, value) => {
              if (value < 20) {
                return Promise.resolve();
              } else {
                return Promise.reject('has error');
              }
            }
          }]}
        >
          <Input type={'picker'} data={options} />
        </YField>
        <Field
          name={'city'}
        >
          <Input
            data={city}
            multi={3}
            type={'picker'}
          />
        </Field>
        <YField
          initialValue={'123'}
          rules={[{
            required: true
          }, {
            validator(rule, value) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  if (!value) {
                    return resolve();
                  }
                  if (/^\d+$/.test(value)) {
                    resolve();
                  } else {
                    reject('格式错误');
                  }
                }, 1000);
              });
            }
          }]}
          name={'username'}
        >
          <Input type={'text'} placeholder={'username'} />
        </YField>
      </YForm>
    </Layout>
  );
};

export default Examples;
