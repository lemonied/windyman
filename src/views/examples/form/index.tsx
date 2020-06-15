import React, { FC, useEffect, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { Field, useForm } from 'rc-field-form';
import { Input } from '../../../components/input';
import { post } from '../../../helpers/http';
import { YField, YForm } from '../../../components/y-form';

const demoDataSet = [
  [{name: '一月', value: 1}, {name: '二月', value: 2}, {name: '三月', value: 3}],
  [{name: '一日', value: 4}, {name: '二日', value: 5}, {name: '三日', value: 6}]
];

const formatCity = (cities: any) => {
  return cities.map((item: any) => {
    return {
      value: item.id,
      name: item.text,
      children: formatCity(item.children)
    };
  });
};

const YFormDemo: FC<any> = function(): JSX.Element {
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
    <Layout
      header={
        <Header title={'YForm'} />
      }
    >
      <YForm form={form}>
        {/*单选示例*/}
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
          <Input type={'picker'} data={options} placeholder={'单选下拉'} />
        </YField>
        {/*多选示例（数据结构一）*/}
        <YField
          name={'multi'}
        >
          <Input type={'picker'} multi={2} data={demoDataSet} placeholder={'级联选择-1'} />
        </YField>
        {/*多选示例（数据结构二）*/}
        <Field
          name={'city'}
        >
          <Input
            data={city}
            multi={3}
            type={'picker'}
            placeholder={'级联选择-2'}
          />
        </Field>
        {/*Input type="text"*/}
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

export { YFormDemo };
