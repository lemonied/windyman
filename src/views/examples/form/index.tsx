import React, { FC, useEffect, useState } from 'react';
import { Header, Layout } from '../../../components/layout';
import { useForm } from 'rc-field-form';
import { Input } from '../../../components/input';
import { post } from '../../../helpers/http';
import { YField, YForm } from '../../../components/y-form';

const demoDataSet = [
  [{name: '红色', value: 1}, {name: '白色', value: 2}, {name: '绿色', value: 3}],
  [{name: '小号', value: 4, disabled: true}, {name: '中号', value: 5}, {name: '大号', value: 6}]
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
      education: '21'
    });
    form.validateFields().then(values => {
      // validate all fields
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
          label={'教育程度'}
          rules={[{
            required: true
          }]}
        >
          <Input type={'picker'} data={options} placeholder={'单选下拉'} />
        </YField>
        {/*多列选择*/}
        <YField
          name={'multi'}
          label={'多列'}
        >
          <Input type={'picker'} multi={2} data={demoDataSet} placeholder={'多列选择'} />
        </YField>
        {/*级联选择*/}
        <YField
          name={'city'}
          label={'多列'}
        >
          <Input
            data={city}
            multi={3}
            type={'picker'}
            placeholder={'级联选择'}
            title={'选择城市'}
          />
        </YField>
        {/*普通text输入框*/}
        <YField
          initialValue={'123'}
          rules={[{
            required: true
          }, {
            validator(rule, value) {
              if (/^\d+$/.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject('只能输入数字');
              }
            }
          }]}
          name={'username'}
          label={'用户名'}
        >
          <Input type={'text'} placeholder={'username'} />
        </YField>
        {/* 日期时间选择器 */}
        <YField
          name={'datatime'}
          label={'日期时间'}
        >
          <Input placeholder={'日期时间选择器'} type={'dateTime'} title={'日期时间'} column={6} />
        </YField>
        {/* 时间选择器 */}
        <YField
          name={'time'}
          label={'时间'}
          rules={[{
            required: true
          }]}
        >
          <Input placeholder={'时间选择器'} type={'time'} title={'时间'} column={3} />
        </YField>
        <YField
          name={'selector'}
          label={'Selector'}
        >
          <Input placeholder={'Selector'} type={'selector'} data={city} />
        </YField>
      </YForm>
    </Layout>
  );
};

export { YFormDemo };
