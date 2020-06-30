import React, {
  Children,
  cloneElement,
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  ReactElement, ReactNode,
  useCallback, useEffect,
  useImperativeHandle,
  useMemo, useState
} from 'react';
import Form, { Field, FormInstance, useForm } from 'rc-field-form';
import { FormProps } from 'rc-field-form/es/Form';
import { FieldData, FieldError, NamePath } from 'rc-field-form/es/interface';
import { FieldProps } from 'rc-field-form/es/Field';
import './style.scss';
import { combineClassNames } from '../../common/utils';
import { Icon } from '../icon';
import { modal } from '../modal';
import { Item, List } from '../list';
import { usePicker } from '../input/picker-input';

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
    <Form {...props} form={form} onFieldsChange={onFieldsChange} children={<List className={'y-form'}>{children}</List>} />
  );
};

export const YForm = forwardRef<FormInstance, YFormProps>(FormFc);

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
  requiredTip?: string | ReactNode;
}
const YField: FC<YFieldProps> = function(props): JSX.Element {
  const { rules = [], name, errors, label, form, initialValue, requiredTip = '该项为必填项', children } = props;
  const [value, setValue] = useState(initialValue);
  const [hasArrow, setHasArrow] = useState(false);
  useEffect(() => {
    if (form && name) {
      setValue(form.getFieldValue(name));
    }
  }, [form, name, errors]);
  const formatErrors = useMemo(() => {
    const errs = findErrors(errors, name) || [];
    return errs.filter(item => !/^.+ is required$/.test(item));
  }, [errors, name]);
  const required = useMemo(() => {
    return rules.some((val: any) => val && val.required);
  }, [rules]);
  const className = useMemo(() => {
    return combineClassNames('y-label', required ? 'required' : '');
  }, [required]);
  const showErrorTip = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.alert(
      <div>{formatErrors.map((item, key) => (<div key={key}>{item}</div>))}</div>
    ).then(() => {
      // close
    });
  }, [formatErrors]);
  const showRequiredTip = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.alert(requiredTip).then(() => {
      // close
    });
  }, [requiredTip]);
  const picker = usePicker();
  const clonedChildren = useMemo(() => {
    if (children) {
      return cloneElement(children, {
        hasArrow: setHasArrow,
        picker
      });
    }
    return children;
  }, [children, picker]);
  const onItemClick = useCallback((e) => {
    if (picker.open) {
      picker.open();
    }
  }, [picker]);
  return (
    <Item
      onClick={onItemClick}
      arrow={hasArrow ? 'horizontal' : null}
      prefix={
        <span className={className}>{ label }</span>
      }
      extra={
        <span className={'input-after'}>
          {
            !value && required ?
              <span className={'required-icon'} onClick={showRequiredTip}>
                <Icon type={'info-circle'} />
              </span> :
              formatErrors.length ?
                <span className={'error-icon'} onClick={showErrorTip}>
                  <Icon type={'warning-circle'} />
                </span> :
                null
          }
        </span>
      }
    >
      <Field {...props} children={clonedChildren} />
    </Item>
  );
};

export { YField };
