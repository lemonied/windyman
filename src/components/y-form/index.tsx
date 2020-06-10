import React, {
  Children,
  cloneElement,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  ReactElement,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useMemo, useState
} from 'react';
import Form, { Field, FormInstance, useForm } from 'rc-field-form';
import { FormProps } from 'rc-field-form/es/Form';
import { FieldData, FieldError, NamePath } from 'rc-field-form/es/interface';
import { FieldProps } from 'rc-field-form/es/Field';

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
}
const YField: FC<YFieldProps> = function(props): JSX.Element {
  const { children: propChildren, form, rules = [], name, errors } = props;
  const children = useMemo<ReactElement | undefined>(() => {
    if (propChildren) {
      return cloneElement(propChildren, {
        form,
        required: rules.some((item: any) => item && item.required),
        name,
        errors: findErrors(errors, name)
      });
    }
    return propChildren;
  }, [propChildren, form, rules, name, errors]);
  return (
    <Field {...props} children={children} />
  );
};

export { YField };
