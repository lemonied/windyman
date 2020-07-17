import React, { Component, ReactNode, createRef, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { YField, YForm } from '../y-form';
import { Input } from '../input';
import { FormInstance } from 'rc-field-form';
import { Rule } from 'rc-field-form/es/interface';

interface Footer {
  text: string;
  callback?: (val?: any) => void;
}
interface Props {
  header?: ReactNode;
  content?: ReactNode;
  footer?: Footer[];
  maskClick?: (e: any) => void;
}
const defaultProps: Props = {
  header: '提示',
  footer: []
};

export class Modal extends Component<Props, any> {
  static defaultProps: Props = defaultProps;
  readonly state = {
    show: false
  };

  preventClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }
  show() {
    this.setState({ show: true });
  }
  hide() {
    this.setState({ show: false });
  }

  render() {
    const { header, content, footer, maskClick } = this.props;
    const { show } = this.state;
    return (
      <CSSTransition
        in={show}
        classNames={{
          enter: 'modal-enter',
          enterActive: 'modal-enter-active',
          exit: 'modal-exit',
          exitActive: 'modal-exit-active',
          exitDone: 'modal-exit-done'
        }}
        timeout={300}
      >
        <div className={'windy-modal-wrapper'} onClick={maskClick}>
          <div className={'modal'} onClick={this.preventClick.bind(this)}>
            <div className={'modal-header'}>{ header }</div>
            <div className={'modal-content'}>{ content }</div>
            <div className={'modal-footer'}>
              {
                footer?.map((item, key) =>(
                  <button key={key} className={'button'} onClick={item.callback}>{item.text}</button>
                ))
              }
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

interface ToastProps {
  content?: ReactNode;
}
interface ToastState {
  show: boolean;
}
export class Toast extends Component<ToastProps, ToastState> {
  readonly state = {
    show: false
  };
  show() {
    this.setState({ show: true });
  }
  hide() {
    this.setState({ show: false });
  }
  render() {
    const { content } = this.props;
    const { show } = this.state;

    return (
      <CSSTransition
        classNames={'windy-toast'}
        timeout={300}
        in={show}
      >
        <div className={'windy-toast-modal'}>{ content }</div>
      </CSSTransition>
    );
  }
}

interface PromptInputProps {
  rules?: Rule[];
  placeholder?: string;
  initialValue?: any;
}
class PromptInput extends Component<PromptInputProps, any> {
  ref = createRef<FormInstance>();

  componentDidMount() {}

  render() {
    const { rules, placeholder, initialValue } = this.props;

    return (
      <YForm ref={this.ref} className={'windy-modal-form'}>
        <YField
          name={'prompt'}
          rules={rules}
          initialValue={initialValue}
        >
          <Input className={'windy-modal-input'} type={'text'} placeholder={placeholder} />
        </YField>
      </YForm>
    );
  }
}

interface ConfirmOptions {
  title?: string;
  cancelText?: string;
  content?: ReactNode;
  confirmText?: string;
}
interface PromptOptions {
  title?: string;
  cancelText?: string;
  confirmText?: string;
  placeholder?: string;
  rules?: Rule[];
  initialValue?: any;
}
export class ModalService {
  ele: Element[] = [];

  create(
    ele: ReactElement,
    callback?: () => void
  ): HTMLElement {
    const container = document.createElement('div');
    container.className = 'modal-container';
    document.body.appendChild(container);
    ReactDOM.render(ele, container, callback);
    this.ele.push(container);
    return container;
  }
  confirm(
    options: ConfirmOptions
  ): Promise<boolean> {
    const { title = '提示', content, cancelText = '取消', confirmText = '确定' } = options;
    const instance = createRef<Modal>();
    const close = (ele: HTMLElement) => {
      instance.current?.hide();
      setTimeout(() => this.destroy(ele), 500);
    };
    return new Promise((resolve, reject) => {
      const container = this.create(
        <Modal
          ref={ instance }
          header={ title }
          content={ content }
          maskClick={ e => close(container) }
          footer={
            [{
              text: cancelText,
              callback: () => {
                close(container);
                resolve(false);
              }
            }, {
              text: confirmText,
              callback: () => {
                close(container);
                resolve(true);
              }
            }]
          }
        />,
        () => instance.current?.show()
      );
    });
  }
  prompt(
    options: PromptOptions
  ): Promise<any> {
    const { title = '提示', cancelText = '取消', confirmText = '确定', placeholder, rules, initialValue } = options;
    const prompt = createRef<PromptInput>();
    const instance = createRef<Modal>();
    const close = (ele: HTMLElement) => {
      instance.current?.hide();
      setTimeout(() => this.destroy(ele), 500);
    };
    return new Promise((resolve, reject) => {
      const container = this.create(
        <Modal
          ref={instance}
          header={title}
          content={
            <PromptInput ref={prompt} placeholder={placeholder} rules={rules} initialValue={initialValue} />
          }
          footer={
            [{
              text: cancelText,
              callback: () => {
                close(container);
                resolve();
              }
            }, {
              text: confirmText,
              callback: () => {
                if (prompt.current) {
                  prompt.current.ref.current?.validateFields().then(val => {
                    close(container);
                    resolve(val.prompt);
                  });
                }
              }
            }]
          }
        />,
        () => instance.current?.show()
      );
    });
  }
  alert(content: ReactNode, confirmText = '好的'): Promise<boolean> {
    const instance = createRef<Modal>();
    const close = (ele: HTMLElement) => {
      instance.current?.hide();
      setTimeout(() => this.destroy(ele), 500);
    };
    return new Promise((resolve, reject) => {
      const container = this.create(
        <Modal
          ref={instance}
          header={'提示'}
          content={content}
          footer={
            [{
              text: confirmText,
              callback: () => {
                close(container);
                resolve(true);
              }
            }]
          }
        />,
        () => instance.current?.show()
      );
    });
  }
  toast(content: ReactNode, timeout = 3000): Promise<boolean> {
    const instance = createRef<Toast>();
    return new Promise((resolve, reject) => {
      const container = this.create(
        <Toast
          ref={instance}
          content={content}
        />,
        () => instance.current?.show()
      );
      setTimeout(() => {
        instance.current?.hide();
        resolve(true);
        setTimeout(() => this.destroy(container), 500);
      }, timeout);
    });
  }

  destroy(ele: Element) {
    ReactDOM.unmountComponentAtNode(ele);
    ele.remove();
    const index = this.ele.indexOf(ele);
    if (index > -1) {
      this.ele.splice(index, 1);
    }
  }
  destroyAll() {
    this.ele.forEach(el => {
      ReactDOM.unmountComponentAtNode(el);
      el.remove();
    });
  }
}

export const modal = new ModalService();
