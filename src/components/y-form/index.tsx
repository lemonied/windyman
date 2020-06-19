import React, {
  Children,
  cloneElement,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  ReactElement, ReactNode,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useMemo, useState
} from 'react';
import Form, { Field, FormInstance, useForm } from 'rc-field-form';
import { FormProps } from 'rc-field-form/es/Form';
import { FieldData, FieldError, NamePath } from 'rc-field-form/es/interface';
import { FieldProps } from 'rc-field-form/es/Field';
import './style.scss';
import { combineClassNames } from '../../common/utils';

interface YFormProps extends FormProps {
  children?: ReactElement<any, any>[];
}
const FormFc: ForwardRefRenderFunction<FormInstance, YFormProps> = function(props, ref): JSX.Element {
  const { form: propForm, onFieldsChange: propOnFieldsChange, children: propChildren } = props;
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [formInstance] = useForm();
  const form = useMemo<FormInstance>(() => {
    return propForm || formInstance;
  }, [propForm, formInstance]);
  const children = useMemo(() => {
    return Children.map(propChildren, (item, key) => {
      if (item) {
        return cloneElement(item, { form, errors });
      }
      return item;
    });
  }, [propChildren, form, errors]);
  const onFieldsChange = useCallback<(changedFields: FieldData[], allFields: FieldData[]) => void>((changedValues, values) => {
    setErrors(form.getFieldsError());
    if (propOnFieldsChange) {
      propOnFieldsChange(changedValues, values);
    }
  }, [propOnFieldsChange, form]);
  useImperativeHandle(ref, () => {
    return form;
  });
  return (
    <Form {...props} form={form} onFieldsChange={onFieldsChange} children={children} />
  );
};

export const YForm: ForwardRefExoticComponent<YFormProps & RefAttributes<FormInstance>> = forwardRef<FormInstance, YFormProps>(FormFc);

const findErrors = (errors?: FieldError[], name?: NamePath): string[] | undefined => {
  if (!errors || !name) {
    return undefined;
  }
  if (!Array.isArray(name)) {
    name = [name];
  }
  const ret = errors.find(item => {
    return item.name.every(val => (name as (string | number)[]).includes(val));
  })?.errors;
  return ret && ret.length ? ret : undefined;
};

interface YFieldProps extends FieldProps {
  form?: FormInstance;
  children?: ReactElement;
  errors?: FieldError[];
  label?: string | ReactNode;
}
const YField: FC<YFieldProps> = function(props): JSX.Element {
  const {rules = [], name, errors, label } = props;

  const formatErrors = useMemo(() => {
    return findErrors(errors, name);
  }, [errors, name]);
  const required = useMemo(() => {
    return rules.some((val: any) => val && val.required);
  }, [rules]);
  return (
    <div className={combineClassNames('y-form-item', required ? 'required' : '')}>
      <span className={'y-label'}>{ label }</span>
      <Field {...props} />
      <span>{formatErrors}</span>
    </div>
  );
};

export { YField };
